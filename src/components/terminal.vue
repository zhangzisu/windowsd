<template>
  <v-footer padless>
    <v-row>
      <v-col cols="12">
        <div ref="terminal" class="terminal">
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import 'xterm/css/xterm.css'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { IPty, spawn } from 'node-pty'

const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash'

@Component
export default class Terminal extends Vue {
  term: Xterm
  fit: FitAddon
  pty: IPty

  constructor () {
    super()
    this.term = new Xterm({
    })
    this.fit = new FitAddon()
    this.term.loadAddon(this.fit)
    this.pty = spawn(shell, [], { cols: this.term.cols, rows: this.term.rows })
  }

  mounted () {
    this.term.open(this.$refs.terminal as HTMLElement)
    this.fit.fit()
    this.term.onResize(({ cols, rows }) => {
      this.pty.resize(cols, rows)
    })
    this.term.onData(input => {
      this.pty.write(input)
    })
    this.pty.onData(input => {
      this.term.write(input)
    })
    this.pty.onExit(({ exitCode, signal }) => {
      this.term.writeln(`PTY exited with code ${exitCode} and signal ${signal}`)
    })
  }

  beforeDestory () {
    this.term.dispose()
    this.pty.kill()
  }
}
</script>

<style lang="scss" scoped>
.terminal {
  width: 100%;
  height: 120px;
}
</style>
