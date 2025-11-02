
<template>
  <v-app-bar color="primary" dark flat>
    <v-app-bar-title>Painel de Monitoramento</v-app-bar-title>
    <v-spacer></v-spacer>
    <div class="d-flex align-center">
      <span class="mr-2">Operador</span>
      <v-icon>mdi-account-circle</v-icon>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DashboardHeader',
});
</script>
