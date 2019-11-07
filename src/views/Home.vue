<template>
  <v-row align="start" class="fill-height">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Status</v-card-title>
            <v-list>
              <v-list-item v-for="(service, i) in services" :key="i" @click="changeState(i)" :disabled="disabled[i]">
                <v-list-item-icon>
                  <v-icon :color="getColorByStatus(service.status)">mdi-settings</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ service.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ service.status }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { rpcCall } from '../frontend/rpc'

@Component
export default class Home extends Vue {
  services: any[] = []
  timeout: NodeJS.Timeout | null = null
  disabled: boolean[] = []

  getColorByStatus (status: string) {
    switch (status) {
      case 'Running':
        return 'success'
      case 'Failed':
        return 'error'
      case 'Loaded':
        return 'primary'
      default:
        return ''
    }
  }

  mounted () {
    this.timeout = setInterval(() => this.update(), 1000)
    this.update()
  }

  beforeDestroy () {
    if (this.timeout) {
      clearInterval(this.timeout)
    }
  }

  async changeState (i: number) {
    const service = this.services[i]
    this.$set(this.disabled, i, true)
    try {
      if (service.status === 'Running') {
        await rpcCall(0, 'stopService', [service.name])
      } else {
        await rpcCall(0, 'startService', [service.name])
      }
    } catch (e) {
      //
    } finally {
      this.$set(this.disabled, i, false)
    }
  }

  async update () {
    this.services = (await rpcCall(0, 'listServices', [])) as any[]
  }
}
</script>
