import { listService, startService, stopService } from './services'
import { isAutoStart, enableAutoStart, disableAutoStart } from './autostart'

const rpcFunctions: { [K: string]: any } = {
  listServices: async () => {
    return listService()
  },
  startService: async (name: string) => {
    return startService(name)
  },
  stopService: async (name: string) => {
    return stopService(name)
  },
  isAutoStart: async () => {
    return isAutoStart()
  },
  enableAutoStart: async () => {
    return enableAutoStart()
  },
  disableAutoStart: async () => {
    return disableAutoStart()
  }
}

export async function handleRpc (fName: string, args: any[]) {
  if (fName in rpcFunctions) {
    return rpcFunctions[fName](...args)
  } else {
    throw new Error('Bad function')
  }
}
