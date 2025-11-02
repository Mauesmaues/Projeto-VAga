
<template>
  <div style="width: 100%; max-width: 100%; overflow-y: auto; box-sizing: border-box;">
    <!-- Header -->
    <v-row align="center" class="mb-6" no-gutters>
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-avatar color="primary" size="48">
          <v-icon>mdi-view-dashboard</v-icon>
        </v-avatar>
        <div class="ml-4">
          <div class="text-h5 font-weight-bold">Painel de Monitoramento</div>
          <div class="text-caption text-grey-lighten-1">Visão geral do sistema</div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn color="success" prepend-icon="mdi-plus" variant="elevated" @click="abrirModalVenda">
          Nova Venda
        </v-btn>
      </v-col>
    </v-row>

    <!-- KPIs -->
    <v-row class="mb-6" no-gutters>
      <v-col 
        cols="12" 
        sm="6" 
        md="3" 
        v-for="kpi in kpis" 
        :key="kpi.label"
        class="pa-2"
      >
        <v-card elevation="2" class="pa-4" height="120">
          <v-skeleton-loader v-if="carregando" type="text, text"></v-skeleton-loader>
          <template v-else>
            <div class="text-h4 font-weight-bold mb-2">{{ kpi.value }}</div>
            <div class="text-caption text-grey">{{ kpi.label }}</div>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabela de Vendas -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-cart</v-icon>
            <span>Últimas Vendas</span>
            <v-spacer></v-spacer>
            <v-btn 
              icon 
              size="small" 
              @click="carregarDados"
              :loading="carregando"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="vendas"
            :items-per-page="10"
            :loading="carregando"
            class="elevation-0"
            density="comfortable"
          >
            <template v-slot:item.valor_total="{ item }">
              <span class="font-weight-bold text-success">{{ formatarPreco(item.valor_total) }}</span>
            </template>
            <template v-slot:item.data_venda="{ item }">
              {{ formatarData(item.data_venda) }}
            </template>
            <template v-slot:item.forma_pagamento="{ item }">
              <v-chip :color="getCorPagamento(item.forma_pagamento)" size="small">
                {{ formatarPagamento(item.forma_pagamento) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Nova Venda -->
    <ModalNovaVenda 
      v-model="modalNovaVenda" 
      @vendaCriada="handleVendaCriada"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { listarVendas } from '../../vendas/api';
import { getEstatisticas } from '../api';
import type { Venda } from '../../../types/venda';
import type { Estatisticas } from '../api';
import ModalNovaVenda from '../../vendas/components/ModalNovaVenda.vue';

export default defineComponent({
  name: 'DashboardKpis',
  components: {
    ModalNovaVenda
  },
  setup() {
    const modalNovaVenda = ref(false);
    const vendas = ref<Venda[]>([]);
    const estatisticas = ref<Estatisticas | null>(null);
    const carregando = ref(false);

    const kpis = computed(() => [
      { 
        value: estatisticas.value?.vendasDoDia?.toString() || '0', 
        label: 'Vendas do Dia' 
      },
      { 
        value: formatarPreco(estatisticas.value?.receitaDiaria || 0), 
        label: 'Receita Diária' 
      },
      { 
        value: estatisticas.value?.totalProdutos?.toString() || '0', 
        label: 'Produtos Cadastrados' 
      },
      { 
        value: estatisticas.value?.totalEstoque?.toString() || '0', 
        label: 'Itens em Estoque' 
      }
    ]);
    
    const headers = [
      { title: 'Data', key: 'data_venda', sortable: true },
      { title: 'Operador', key: 'usuario_nome', sortable: true },
      { title: 'Total', key: 'valor_total', sortable: true },
      { title: 'Pagamento', key: 'forma_pagamento', sortable: true }
    ];

    async function carregarDados() {
      carregando.value = true;
      try {
        const [vendasData, statsData] = await Promise.all([
          listarVendas(),
          getEstatisticas()
        ]);
        vendas.value = vendasData;
        estatisticas.value = statsData;
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        carregando.value = false;
      }
    }

    function formatarPreco(valor: number): string {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    function formatarData(data?: string): string {
      if (!data) return '-';
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function formatarPagamento(forma: string): string {
      const map: Record<string, string> = {
        'dinheiro': 'Dinheiro',
        'cartao': 'Cartão',
        'pix': 'PIX'
      };
      return map[forma] || forma;
    }

    function getCorPagamento(forma: string): string {
      const cores: Record<string, string> = {
        'dinheiro': 'success',
        'cartao': 'primary',
        'pix': 'info'
      };
      return cores[forma] || 'default';
    }

    function abrirModalVenda() {
      modalNovaVenda.value = true;
    }

    function handleVendaCriada(venda: any) {
      console.log('Venda criada:', venda);
      carregarDados(); // Recarregar dados após criar venda
    }

    onMounted(() => {
      carregarDados();
    });
    
    return { 
      kpis, 
      vendas, 
      headers,
      modalNovaVenda,
      carregando,
      abrirModalVenda,
      handleVendaCriada,
      carregarDados,
      formatarPreco,
      formatarData,
      formatarPagamento,
      getCorPagamento
    };
  }
});
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
.v-row {
  margin: 0 !important;
}
.pa-2 {
  padding: 8px !important;
}
</style>
