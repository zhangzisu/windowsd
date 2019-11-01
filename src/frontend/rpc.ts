import { ipcRenderer } from 'electron'

let asyncIds = 0

export async function rpcCall (timeout: number, fName: string, args: any[]) {
  const asyncId = asyncIds++
  const channel = `zrpc-${asyncId}`
  ipcRenderer.send('zrpc', asyncId, fName, args)
  return new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout
    ipcRenderer.on(channel, (event, error: any, args: any[]) => {
      timeoutId && clearTimeout(timeoutId)
      ipcRenderer.removeAllListeners(channel)
      error ? reject(error) : resolve(args)
    })
    if (timeout) {
      timeoutId = setTimeout(() => {
        ipcRenderer.removeAllListeners(channel)
        reject(new Error('RPC Timeout'))
      }, timeout)
    }
  })
}
