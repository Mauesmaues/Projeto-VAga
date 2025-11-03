<template>
    <v-layout>
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      width="260"
      color="primary"
      style="border-right: 1px solid rgba(255,255,255,0.2);"
    >
      <DashboardSidebar @close-drawer="drawer = false" />
    </v-navigation-drawer>

    <!-- App Bar para Mobile -->
    <v-app-bar
      v-if="!mdAndUp"
      color="primary"
      density="compact"
      elevation="1"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-white d-flex align-center">
        <v-icon color="white" class="mr-2">mdi-cash-register</v-icon>
        ANB Farma
      </v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main style="height: 100vh; overflow-y: auto;">
      <v-container fluid style="padding: 24px; max-width: 100%;">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDisplay } from 'vuetify';
import DashboardSidebar from './components/DashboardSidebar.vue';

export default defineComponent({
  name: 'DashboardModule',
  components: {
    DashboardSidebar
  },
  setup() {
    const drawer = ref(true);
    const { mdAndUp } = useDisplay();

    return {
      drawer,
      mdAndUp
    };
  }
});
</script>

<style scoped>

* {
  box-sizing: border-box;
}
</style>
