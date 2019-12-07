import { remote, shell } from 'electron'

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

export function uiExit () {
  remote.app.quit()
}
