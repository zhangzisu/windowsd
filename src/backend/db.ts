import leveldown from 'leveldown'
import levelup from 'levelup'
import * as path from 'path'
import { app } from 'electron'

const db = levelup(leveldown(path.join(app.getPath('userData'), 'db')))
