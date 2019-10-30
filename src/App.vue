<template>
  <v-app>
    <v-system-bar app window style="-webkit-app-region: drag">
      <v-avatar size="32" class="mr-2" tile>
        <img src="@/../public/favicon.ico">
      </v-avatar>
      <v-spacer/>
      Windowsd
      <v-spacer/>
      <v-btn text @click="minimize" style="-webkit-app-region: no-drag" small>
        <v-icon right>mdi-minus</v-icon>
      </v-btn>
      <v-btn text @click="maximize" style="-webkit-app-region: no-drag" small>
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <v-btn text @click="close" style="-webkit-app-region: no-drag" color="error" small>
        <v-icon right>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar app>
      <v-app-bar-nav-icon/>
    </v-app-bar>
    <v-content>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { uiMinimize, uiMaximuze, uiClose } from '@/backend/ui'

@Component
export default class App extends Vue {
  minimize () {
    uiMinimize()
  }
  maximize () {
    uiMaximuze()
  }
  close () {
    uiClose()
  }
}
</script>
