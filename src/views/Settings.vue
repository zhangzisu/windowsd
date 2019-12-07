<template>
  <v-row class="fill-height">
    <v-col cols="12">
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-list>
          <v-list-item @click="openDevTools">
            <v-list-item-content>
              <v-list-item-title>Open Developer Tools</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeAutoStart" :disabled="autostart === null">
            <v-list-item-content>
              <v-list-item-title>{{ autostart === null ? 'Loading' : autostart ? 'Disable Autostart' : 'Enable autostart' }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-text>
          <v-form v-model="settingsValid">
            <v-text-field v-model.trim="device" label="DeviceID" :rules="[ required ]"></v-text-field>
            <v-text-field v-model.trim="server" label="Server" placeholder="http://api.zhangzisu.cn:8080"></v-text-field>
            <v-text-field v-model.trim.number="listen" label="API Listen" placeholder="5000" type="number"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" @click="reset">Reset</v-btn>
          <v-btn color="primary" :disabled="!settingsValid" @click="apply">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { uiOpenDevTools } from '@/frontend/ui'
import { remote } from 'electron'

const AutoLaunch = remote.require('auto-launch')
const autoLauncher = new AutoLaunch({ name: 'Windowsd' })

@Component
export default class Settings extends Vue {
  autostart: boolean | null = null
  settingsValid = false
  device: string = ''
  server: string = ''
  listen: number = 0
  required = (value: any) => !!value || 'Required.'

  created () {
    this.reset()
  }

  reset () {
    this.device = localStorage.DeviceID
    this.server = localStorage.Server
    this.listen = localStorage.Listen
  }

  apply () {
    localStorage.DeviceID = this.device || ''
    localStorage.Server = this.server || ''
    localStorage.Listen = this.listen || ''
  }

  async mounted () {
    this.autostart = await autoLauncher.isEnabled()
  }

  openDevTools () {
    uiOpenDevTools()
  }

  async changeAutoStart () {
    if (this.autostart) {
      this.autostart = null
      await autoLauncher.disable()
    } else {
      this.autostart = null
      await autoLauncher.enable()
    }
    this.autostart = await autoLauncher.isEnabled()
  }
}
</script>
