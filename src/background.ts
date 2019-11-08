import { app, protocol, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import { handleRpc } from './backend/rpc-server'

const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null
let tray: Tray | null

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    icon: path.join(__static, 'favicon.ico')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

function createTray () {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => { if (win !== null) win.show() } },
    { label: 'Quit', click: () => { app.quit() } }
  ])
  tray = new Tray(path.join(__static, 'favicon.ico'))
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => {
    if (win !== null) {
      win.show()
    }
  })
}

if (app.requestSingleInstanceLock()) {
  protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })

  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installVueDevtools()
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
    createTray()
    autoUpdater.checkForUpdatesAndNotify()
  })

  if (isDevelopment) {
    if (process.platform === 'win32') {
      process.on('message', data => {
        if (data === 'graceful-exit') {
          app.quit()
        }
      })
    } else {
      process.on('SIGTERM', () => {
        app.quit()
      })
    }
  }

  ipcMain.on('zrpc', (event, asyncId: number, fName: string, args: any[]) => {
    const channel = `zrpc-${asyncId}`
    handleRpc(fName, args)
      .catch((e: any) => event.reply(channel, e.message))
      .then((v: any) => event.reply(channel, null, v))
  })
} else {
  app.quit()
}
