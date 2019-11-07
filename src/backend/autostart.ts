import AutoLaunch from 'auto-launch'

const autoLauncher = new AutoLaunch({ name: 'Windowsd' })

export async function enableAutoStart () {
  return autoLauncher.enable()
}

export async function disableAutoStart () {
  return autoLauncher.disable()
}

export async function isAutoStart () {
  return autoLauncher.isEnabled()
}
