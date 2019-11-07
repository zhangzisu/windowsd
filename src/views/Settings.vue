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
  openDevTools () {
    uiOpenDevTools()
  }
  openServiceFolder () {
    uiOpenServiceFolder()
  }
}
</script>
