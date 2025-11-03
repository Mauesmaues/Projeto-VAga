<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center pa-4">
      <v-icon class="mr-2" color="primary" size="28">mdi-format-list-bulleted</v-icon>
      <span class="text-h6 font-weight-bold">Movimentações de Saída</span>
      <v-spacer></v-spacer>
    </v-card-title>
    
    <v-divider></v-divider>

    <!-- Filtros -->
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="pesquisa"
            density="comfortable"
            placeholder="Pesquisar por produto..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filtroProduto"
            :items="produtosUnicos"
            density="comfortable"
            label="Filtrar por produto"
            variant="outlined"
            hide-details
            clearable
            prepend-inner-icon="mdi-filter"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="ordenacao"
            :items="opcoesOrdenacao"
            density="comfortable"
            label="Ordenar por data"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-sort"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <v-data-table
      :headers="headers"
      :items="itensFiltrados"
      :items-per-page="15"
      class="elevation-0"
      density="comfortable"
      item-value="id"
    >
      <template v-slot:item.produto_nome="{ item }">
        <div class="d-flex align-center py-2">
          <v-icon class="mr-2" color="primary" size="20">mdi-package-variant</v-icon>
          <span class="font-weight-medium">{{ item.produto_nome }}</span>
        </div>
      </template>
      
      <template v-slot:item.quantidade="{ item }">
        <v-chip color="error" variant="flat" size="small" prepend-icon="mdi-minus">
          {{ item.quantidade }} un
        </v-chip>
      </template>

      <template v-slot:item.preco_unitario="{ item }">
        <span class="text-grey-darken-2">{{ formatarPreco(item.preco_unitario) }}</span>
      </template>

      <template v-slot:item.total_item="{ item }">
        <v-chip color="success" variant="flat" size="small">
          {{ formatarPreco(item.total_item) }}
        </v-chip>
      </template>

      <template v-slot:item.data_venda="{ item }">
        <span class="text-grey-darken-1">{{ formatarData(item.data_venda) }}</span>
      </template>

      <template v-slot:item.usuario_nome="{ item }">
        <div class="d-flex align-center">
          <v-icon class="mr-1" size="16" color="grey">mdi-account</v-icon>
          <span class="text-caption">{{ item.usuario_nome }}</span>
        </div>
      </template>
      
      <template v-slot:no-data>
        <div class="text-center pa-8">
          <v-icon size="64" color="grey-lighten-1">mdi-archive-off</v-icon>
          <div class="text-h6 mt-4 text-grey">Nenhuma movimentação registrada</div>
          <div class="text-caption text-grey-lighten-1">As saídas de estoque aparecerão aqui</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import type { HistoricoEstoqueItem } from '../api';

export default defineComponent({
  name: 'HistoricoEstoqueTabela',
  props: {
    historico: {
      type: Array as PropType<HistoricoEstoqueItem[]>,
      required: true,
    },
  },
  setup(props) {
    const pesquisa = ref('');
    const filtroProduto = ref('');
    const ordenacao = ref('recente');

    const opcoesOrdenacao = [
      { title: 'Mais Recentes', value: 'recente' },
      { title: 'Mais Antigos', value: 'antigo' },
    ];

    const headers = computed(() => [
      { 
        title: 'Produto', 
        key: 'produto_nome', 
        sortable: true,
        width: '25%'
      },
      { 
        title: 'Quantidade', 
        key: 'quantidade', 
        sortable: true,
        align: 'center' as const,
        width: '12%'
      },
      { 
        title: 'Preço Unit.', 
        key: 'preco_unitario', 
        sortable: true,
        align: 'end' as const,
        width: '13%'
      },
      { 
        title: 'Total', 
        key: 'total_item', 
        sortable: true,
        align: 'end' as const,
        width: '13%'
      },
      { 
        title: 'Data da Venda', 
        key: 'data_venda', 
        sortable: true,
        align: 'center' as const,
        width: '17%'
      },
      { 
        title: 'Vendedor', 
        key: 'usuario_nome', 
        sortable: true,
        align: 'center' as const,
        width: '20%'
      },
    ]);

    const produtosUnicos = computed(() => {
      const produtos = [...new Set(props.historico.map(item => item.produto_nome))];
      return produtos.sort().map(p => ({ title: p, value: p }));
    });

    const itensFiltrados = computed(() => {
      let resultado = [...props.historico];

      if (pesquisa.value) {
        const termo = pesquisa.value.toLowerCase();
        resultado = resultado.filter(item => 
          item.produto_nome.toLowerCase().includes(termo)
        );
      }

      if (filtroProduto.value) {
        resultado = resultado.filter(item => 
          item.produto_nome === filtroProduto.value
        );
      }

      resultado.sort((a, b) => {
        const dataA = new Date(a.data_venda || 0).getTime();
        const dataB = new Date(b.data_venda || 0).getTime();
        return ordenacao.value === 'recente' ? dataB - dataA : dataA - dataB;
      });

      return resultado;
    });

    function formatarPreco(preco: number): string {
      if (preco !== undefined && preco !== null) {
        return preco.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
      }
      return 'R$ 0,00';
    }

    function formatarData(data: string | undefined): string {
      if (!data) return 'N/A';
      try {
        return new Date(data).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'N/A';
      }
    }
    
    return { 
      headers, 
      pesquisa,
      filtroProduto,
      ordenacao,
      opcoesOrdenacao,
      produtosUnicos,
      itensFiltrados,
      formatarPreco,
      formatarData,
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
