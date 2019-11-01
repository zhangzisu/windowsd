const rpcFunctions: { [K: string]: any } = {
  listServices: async () => {
    return [1, 2, 3]
  }
}

export async function handleRpc (fName: string, args: any[]) {
  if (typeof rpcFunctions[fName] !== 'function') {
    throw new Error('Bad function')
  } else {
    return rpcFunctions[fName](...args)
  }
}
