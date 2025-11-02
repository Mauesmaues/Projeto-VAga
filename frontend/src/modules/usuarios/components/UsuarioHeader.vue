<template>
  <v-row align="center" class="mb-6" no-gutters>
    <v-col cols="12" md="6" class="d-flex align-center">
      <v-avatar color="primary" size="48">
        <v-icon>mdi-account-multiple</v-icon>
      </v-avatar>
      <div class="ml-4">
        <div class="text-h5 font-weight-bold">Gestão de Usuários</div>
        <div class="text-caption text-grey-lighten-1">Gerencie usuários do sistema</div>
      </div>
    </v-col>
    <v-col cols="12" md="6" class="d-flex justify-end">
      <v-btn 
        color="primary" 
        prepend-icon="mdi-account-plus" 
        variant="elevated"
        @click="$emit('abrirModalCadastro')"
      >
        Novo Usuário
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'UsuarioHeader',
  emits: ['abrirModalCadastro']
});
</script>
