<template>
  <v-row align="start" class="fill-height">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Terminal
              <v-spacer/>
              <v-btn icon :disabled="loading || preparing" @click="switcher">
                <v-icon v-html="started ? 'mdi-cancel' : 'mdi-play'"></v-icon>
              </v-btn>
              <v-btn icon :loading="loading || preparing" @click="restart">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div ref="terminal">
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import 'xterm/css/xterm.css'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { IPty, spawn } from 'node-pty'
import { EOL } from 'os'
import { exec } from 'child_process'
import { remote } from 'electron'
import { promisify } from 'util'
import { Instance } from 'chalk'

const c = new Instance({ level: 3 })
const which = remote.require('which')
const execAsync = promisify(exec)

@Component
export default class Home extends Vue {
  term!: Xterm
  fitter!: FitAddon
  pty!: IPty
  loading = false
  started = false
  preparing = false

  mounted () {
    window.addEventListener('resize', () => {
      this.fitter && this.fitter.fit()
    })
    this.start()
  }

  async switcher () {
    this.loading = true
    if (this.started) {
      this.pty && this.pty.kill()
    } else {
      this.reset()
      await this.start()
    }
    this.loading = false
  }

  async restart () {
    this.loading = true
    this.reset()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await this.start()
    this.loading = false
  }

  async start () {
    this.term = new Xterm()
    this.fitter = new FitAddon()
    this.term.loadAddon(this.fitter)

    this.term.open(this.$refs.terminal as any)
    this.preparing = true
    const wdc = await this.prepare()
    this.preparing = false
    if (!wdc) return
    const device = localStorage.DeviceID
    if (!device) {
      this.term.writeln(c.red('Device not set!'))
      return
    }
    this.term.writeln(c.green('Starting Windowsd™ Client'))
    const args = ['--device', device]
    const server = localStorage.Server
    if (server) {
      args.push('--server', server)
    }
    const listen = localStorage.Listen
    if (listen) {
      args.push('--api', listen)
    }
    this.pty = spawn(wdc, args, { cols: this.term.cols, rows: this.term.rows })
    this.started = true
    this.term.onResize(({ cols, rows }) => {
      this.pty.resize(cols, rows)
    })
    // this.term.onData(input => {
    //   this.pty.write(input)
    // })
    this.pty.onData(input => {
      this.term.write(input)
    })
    this.pty.onExit(({ exitCode, signal }) => {
      this.term.writeln(`Windowsd™ exited with code ${exitCode} and signal ${signal}`)
      this.started = false
    })
  }

  async prepare () {
    this.term.writeln(c.blue('Checking nodejs...'))
    try {
      this.term.writeln(`node -> ${c.underline(which.sync('node'))}`)
    } catch (e) {
      this.term.writeln(c.red('NodeJS not found! Please install!'))
      return
    }
    this.term.writeln(c.blue('Checking npm...'))
    try {
      this.term.writeln(`npm -> ${which.sync('npm')}`)
    } catch (e) {
      this.term.writeln(c.red('npm not found! Please install!'))
      return
    }
    this.term.writeln(c.blue('Updating wdc...'))
    await this.installWdc()
    let wdc = ''
    try {
      wdc = which.sync('wdc')
      this.term.writeln(`wdc -> ${wdc}`)
    } catch (e) {
      this.term.writeln(c.yellow('wdc not found!'))
    }
    return wdc
  }

  async installWdc () {
    try {
      this.term.writeln('Installing @windowsd/client')
      const { stdout, stderr } = await execAsync('npm i -g @windowsd/client')
      // Normalize trilling char
      this.term.writeln(stdout.replace(new RegExp(EOL, 'g'), '\n'))
      this.term.writeln(stderr.replace(new RegExp(EOL, 'g'), '\n'))
      return true
    } catch (e) {
      this.term.writeln(e.toString())
      return false
    }
  }

  reset () {
    this.term && this.term.dispose()
    this.pty && this.pty.kill()
    this.started = false
  }

  beforeDestory () {
    this.reset()
  }
}
</script>
