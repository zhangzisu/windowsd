import { app } from 'electron'
import * as path from 'path'
import { existsSync, copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import * as cp from 'child_process'
import { handleRpc } from './rpc-server'

type ServiceStatus = 'Loaded' | 'Running' | 'Failed'
interface IService {
  name: string
  status: ServiceStatus
  src: string
  child: cp.ChildProcess | null
}

const serviceRoot = path.join(app.getPath('userData'), 'services')

if (!existsSync(serviceRoot)) {
  mkdirSync(serviceRoot)
}

const services = new Map<string, IService>(
  readdirSync(serviceRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .map(name => {
      const src = path.join(serviceRoot, name, 'index.js')
      return [name, {
        name,
        status: 'Loaded',
        src,
        child: null
      }]
    })
)

export function listService () {
  return [...services.values()].map(x => ({ name: x.name, status: x.status, src: x.src }))
}

export function startService (name: string) {
  const service = services.get(name)
  if (!service) throw new Error('No such service')
  if (service.status === 'Running') throw new Error('Service is already running')
  service.status = 'Running'
  const child = cp.fork(service.src)
  service.child = child
  child.on('error', (err) => {
    console.log(name, err)
    service.status = 'Failed'
    service.child = null
    child.kill()
    child.removeAllListeners()
  })
  child.on('exit', (code, signal) => {
    console.log(name, code, signal)
    service.status = 'Loaded'
    service.child = null
    child.removeAllListeners()
  })
  child.on('message', (msg) => {
    try {
      if (!(msg instanceof Array) || msg.length < 2) throw new Error('Bad message')
      const [asyncId, fName, ...args] = msg
      if (typeof asyncId !== 'number' || typeof fName !== 'string') throw new Error('Bad message')
      handleRpc(fName, args)
        .catch(e => child.send([asyncId, e]))
        .then(v => child.send([asyncId, null, v]))
    } catch (e) {
      service.status = 'Failed'
      service.child = null
      child.kill()
      child.removeAllListeners()
    }
  })
}

export function stopService (name: string) {
  const service = services.get(name)
  if (!service) throw new Error('No such service')
  if (service.status !== 'Running') throw new Error('Service is already stoped')
  const process = service.child
  if (!process) throw new Error('No such error')
  process.kill()
}
