import { remote, shell } from 'electron'
import * as path from 'path'

const currentWindow = remote.getCurrentWindow()

export function uiMinimize () {
  currentWindow.minimize()
}

export function uiMaximuze () {
  currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()
}

export function uiClose () {
  currentWindow.hide()
}

export function uiOpenDevTools () {
  currentWindow.webContents.openDevTools()
}

export function uiOpenFolder (path: string) {
  shell.openItem(path)
}

export function uiOpenServiceFolder () {
  uiOpenFolder(path.join(remote.app.getPath('userData'), 'services'))
}

export function uiExit () {
  remote.app.quit()
}
