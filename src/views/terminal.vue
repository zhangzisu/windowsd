<template>
  <v-row class="fill-height">
    <v-col cols="12" class="fill-height">
      <v-card>
        <v-card-text>
          <div ref="terminal">
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import 'xterm/css/xterm.css'
import { Terminal as Xterm } from 'xterm'
import * as pty from 'node-pty'

const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash'

@Component
export default class Terminal extends Vue {
  term = new Xterm()
  pty = pty.spawn(shell, [], { cols: this.term.cols, rows: this.term.rows })

  mounted () {
    this.term.open(this.$refs.terminal as any)
    this.term.onResize(({ cols, rows }) => {
      this.pty.resize(cols, rows)
    })
    this.term.onData(input => {
      this.pty.write(input)
    })
    this.pty.onData(input => {
      this.term.write(input)
    })
  }

  beforeDestory () {
    this.term.dispose()
    this.pty.kill()
  }
}
</script>
