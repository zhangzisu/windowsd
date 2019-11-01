import { listService, startService, stopService } from './services'

const rpcFunctions: { [K: string]: any } = {
  listServices: async () => {
    return listService()
  },
  startService: async (name: string) => {
    startService(name)
  },
  stopService: async (name: string) => {
    stopService(name)
  }
}

export async function handleRpc (fName: string, args: any[]) {
  if (typeof rpcFunctions[fName] !== 'function') {
    throw new Error('Bad function')
  } else {
    return rpcFunctions[fName](...args)
  }
}
