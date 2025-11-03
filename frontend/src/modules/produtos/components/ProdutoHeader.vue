<template>
  <v-row align="center" class="mb-8" no-gutters>
    <v-col cols="12" :md="canModify ? 6 : 12" class="d-flex align-center mb-4 mb-md-0">
      <v-avatar color="primary" size="48">
        <v-icon>mdi-package-variant</v-icon>
      </v-avatar>
      <div class="ml-4">
        <div class="text-h5 font-weight-bold">Cadastro de Produtos</div>
        <div class="text-caption text-grey-lighten-1">
          {{ canModify ? 'Gerencie o catálogo de produtos' : 'Visualize o catálogo de produtos' }}
        </div>
      </div>
    </v-col>
    <v-col v-if="canModify" cols="12" md="6" class="d-flex justify-end justify-md-end flex-wrap ga-2">
      <v-btn 
        color="success" 
        prepend-icon="mdi-package-variant-plus" 
        variant="elevated"
        @click="$emit('abrirModalEstoque')"
      >
        Adicionar ao Estoque
      </v-btn>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        variant="elevated"
        @click="$emit('abrirModalCadastro')"
      >
        Novo Produto
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { PermissionService } from '../../../services/permissionService';

export default defineComponent({
  name: 'ProdutoHeader',
  emits: ['abrirModalCadastro', 'abrirModalEstoque'],
  setup() {
    const canModify = computed(() => PermissionService.canModify());

    return {
      canModify
    };
  }
});
</script>
