<template>
  <v-row class="fill-height">
    <v-col cols="12">
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-list>
          <v-list-item @click="openServiceFolder">
            <v-list-item-content>
              <v-list-item-title>Open Service Folder</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="openDevTools">
            <v-list-item-content>
              <v-list-item-title>Open Developer Tools</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeAutoStart" :disabled="autostart === null">
            <v-list-item-content>
              <v-list-item-title>
                {{ autostart === null ? 'Loading' : autostart ? 'Disable Autostart' : 'Enable autostart' }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { uiOpenDevTools, uiOpenServiceFolder } from '@/frontend/ui'
import { rpcCall } from '@/frontend/rpc'

@Component
export default class Settings extends Vue {
  autostart: boolean | null = null

  async mounted () {
    this.autostart = await rpcCall(0, 'isAutoStart', []) as boolean
  }
  openDevTools () {
    uiOpenDevTools()
  }
  openServiceFolder () {
    uiOpenServiceFolder()
  }
  async changeAutoStart () {
    if (this.autostart) {
      this.autostart = null
      await rpcCall(0, 'enableAutoStart', [])
    } else {
      this.autostart = null
      await rpcCall(0, 'disableAutoStart', [])
    }
    this.autostart = await rpcCall(0, 'isAutoStart', []) as boolean
  }
}
</script>
