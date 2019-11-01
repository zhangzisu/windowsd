<template>
  <v-row justify="center">
    <v-col cols="12" lg="3">
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-list>
          <v-list-item @click="openDevTools">
            <v-list-item-title>Open Developer Tools</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { uiOpenDevTools } from '@/frontend/ui'
import { rpcCall } from '@/frontend/rpc'

@Component
export default class Settings extends Vue {
  openDevTools () {
    uiOpenDevTools()
  }
}
</script>
