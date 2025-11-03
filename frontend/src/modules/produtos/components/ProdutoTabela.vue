<template>
  <v-card elevation="2" class="mt-6">
    <v-card-title class="d-flex align-center pa-4">
      <v-icon class="mr-2" color="primary" size="28">mdi-format-list-bulleted</v-icon>
      <span class="text-h6 font-weight-bold">Produtos Cadastrados</span>
      <v-spacer></v-spacer>
      <v-chip color="primary" variant="flat">
        {{ produtosFiltrados.length }}
      </v-chip>
    </v-card-title>
    
    <v-divider></v-divider>

    <!-- Barra de Pesquisa -->
    <v-card-text>
      <v-row align="center">
        <v-col cols="12">
          <v-text-field
            v-model="pesquisa"
            density="comfortable"
            placeholder="Pesquisar por nome..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <v-data-table
      :headers="headers"
      :items="produtosFiltrados"
      :items-per-page="10"
      class="elevation-0"
      density="comfortable"
      item-value="id"
    >
      <template v-slot:item.nome="{ item }">
        <div class="d-flex align-center py-2">
          <v-icon class="mr-2" color="primary" size="20">mdi-package-variant</v-icon>
          <span class="font-weight-medium">{{ item.nome }}</span>
        </div>
      </template>
      
      <template v-slot:item.preco="{ item }">
        <v-chip color="success" variant="flat" size="small">
          {{ formatarPreco(item.preco) }}
        </v-chip>
      </template>

      <template v-slot:item.quantidade="{ item }">
        <v-chip 
          :color="item.quantidade > 0 ? 'primary' : 'error'" 
          variant="flat" 
          size="small"
        >
          {{ item.quantidade }} un
        </v-chip>
      </template>

      <template v-slot:item.acoes="{ item }">
        <div v-if="canModify" class="d-flex justify-center ga-2">
          <v-btn
            icon
            size="small"
            color="primary"
            variant="text"
            @click="$emit('editar', item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="error"
            variant="text"
            @click="$emit('deletar', item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <div v-else class="text-center text-grey">
          <v-icon size="small">mdi-eye</v-icon>
        </div>
      </template>
      
      <template v-slot:no-data>
        <div class="text-center pa-8">
          <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
          <div class="text-h6 mt-4 text-grey">Nenhum produto cadastrado</div>
          <div class="text-caption text-grey-lighten-1">Adicione produtos usando o formulário acima</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue';
import type { Produto } from '../../../types/produto';
import { PermissionService } from '../../../services/permissionService';

export default defineComponent({
  name: 'ProdutoTabela',
  props: {
    produtos: {
      type: Array as PropType<Produto[]>,
      required: true,
    },
  },
  emits: ['editar', 'deletar'],
  setup(props) {
    const pesquisa = ref('');
    const canModify = computed(() => PermissionService.canModify());

    const produtosFiltrados = computed(() => {
      if (!pesquisa.value) {
        return props.produtos;
      }
      return props.produtos.filter(produto => 
        produto.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
      );
    });

    const headers = computed(() => [
      { 
        title: 'Nome do Produto', 
        key: 'nome', 
        sortable: true,
        width: '40%'
      },
      { 
        title: 'Preço', 
        key: 'preco', 
        sortable: true,
        align: 'end' as const,
        width: '20%'
      },
      { 
        title: 'Estoque', 
        key: 'quantidade', 
        sortable: true,
        align: 'end' as const,
        width: '20%'
      },
      { 
        title: 'Ações', 
        key: 'acoes', 
        sortable: false,
        align: 'center' as const,
        width: '20%'
      },
    ]);
    
    function formatarPreco(preco: number): string {
      if (preco !== undefined && preco !== null) {
        return preco.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
      }
      return 'R$ 0,00';
    }
    
    return { 
      headers, 
      formatarPreco, 
      pesquisa, 
      produtosFiltrados,
      canModify
    };
  },
});
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}

:deep(.v-data-table-header) {
  background-color: rgba(0, 0, 0, 0.02);
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(25, 118, 210, 0.05) !important;
}
</style>
