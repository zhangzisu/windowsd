<template>
  <v-row align="start" class="fill-height">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Status</v-card-title>
            <v-list>
              <v-list-item v-for="(service, i) in services" :key="i">
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

@Component
export default class Home extends Vue {
  services = [
    { name: 'Service 1', status: 'Running' },
    { name: 'Service 2', status: 'Failed' },
    { name: 'Service 3', status: 'Loaded' }
  ]

  getColorByStatus (status: string) {
    switch (status) {
      case 'Running': return 'success'
      case 'Failed': return 'error'
      case 'Loaded': return 'primary'
      default: return ''
    }
  }
}
</script>
