<template>
  <v-row>
    <v-col cols="12">
      <v-card>
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
import { uiOpenDevTools } from '../backend/ui'

@Component
export default class Settings extends Vue {
  openDevTools () {
    uiOpenDevTools()
  }
}
</script>
