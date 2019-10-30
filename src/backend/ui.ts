import { remote } from 'electron'

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
