
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
            :items="vendasComEstorno"
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
              <v-chip 
                :color="item.estornada ? 'error' : getCorPagamento(item.forma_pagamento)" 
                size="small"
              >
                {{ item.estornada ? 'ESTORNADO' : formatarPagamento(item.forma_pagamento) }}
              </v-chip>
            </template>
            <template v-slot:item.acoes="{ item }">
              <div class="d-flex justify-end">
                <v-btn
                  v-if="podeEstornar && !item.estornada"
                  icon
                  size="small"
                  color="error"
                  variant="text"
                  @click="abrirDialogEstorno(item)"
                  title="Estornar venda"
                >
                  <v-icon>mdi-undo-variant</v-icon>
                </v-btn>
                <span v-else-if="item.estornada" class="text-error text-caption">Estornado</span>
              </div>
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

    <!-- Dialog de confirmação de estorno -->
    <v-dialog v-model="dialogEstorno" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmar Estorno</v-card-title>
        <v-card-text>
          <p class="mb-4">Tem certeza que deseja estornar esta venda?</p>
          <v-text-field
            v-model="motivoEstorno"
            label="Motivo do estorno (opcional)"
            variant="outlined"
            density="comfortable"
            hint="Ex: Produto devolvido, erro no valor, etc."
          />
          <v-alert type="warning" class="mt-4" density="compact">
            Os produtos serão devolvidos ao estoque automaticamente.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="fecharDialogEstorno">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="confirmarEstorno" :loading="carregandoEstorno">
            Estornar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { listarVendas, criarEstorno, verificarEstorno } from '../../vendas/api';
import { getEstatisticas } from '../api';
import type { Venda } from '../../../types/venda';
import type { Estatisticas } from '../api';
import ModalNovaVenda from '../../vendas/components/ModalNovaVenda.vue';
import { PermissionService } from '../../../services/permissionService';

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
    const estornosMap = ref<Map<string, boolean>>(new Map());
    const dialogEstorno = ref(false);
    const vendaSelecionada = ref<Venda | null>(null);
    const motivoEstorno = ref('');
    const carregandoEstorno = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    const podeEstornar = PermissionService.canModify();

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

    const vendasComEstorno = computed(() => {
      return vendas.value.map(venda => ({
        ...venda,
        estornada: estornosMap.value.get(venda.id) || false,
      }));
    });
    
    const headers = [
      { title: 'Data', key: 'data_venda', sortable: true },
      { title: 'Operador', key: 'usuario_nome', sortable: true },
      { title: 'Total', key: 'valor_total', sortable: true },
      { title: 'Pagamento', key: 'forma_pagamento', sortable: true },
      { title: 'Ações', key: 'acoes', sortable: false, align: 'end' as const, width: '100px' }
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

        for (const venda of vendas.value) {
          const estornada = await verificarEstorno(venda.id);
          estornosMap.value.set(venda.id, estornada);
        }
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
      carregarDados();
    }

    function abrirDialogEstorno(venda: Venda) {
      vendaSelecionada.value = venda;
      motivoEstorno.value = '';
      dialogEstorno.value = true;
    }

    function fecharDialogEstorno() {
      dialogEstorno.value = false;
      vendaSelecionada.value = null;
      motivoEstorno.value = '';
    }

    async function confirmarEstorno() {
      if (!vendaSelecionada.value) return;

      carregandoEstorno.value = true;
      try {
        console.log('Estornando venda:', { 
          venda_id: vendaSelecionada.value.id, 
          vendaSelecionada: vendaSelecionada.value,
          motivo: motivoEstorno.value 
        });

        await criarEstorno({
          venda_id: vendaSelecionada.value.id,
          motivo: motivoEstorno.value || undefined,
        });

        estornosMap.value.set(vendaSelecionada.value.id, true);

        snackbarText.value = 'Venda estornada com sucesso! Produtos devolvidos ao estoque.';
        snackbarColor.value = 'success';
        snackbar.value = true;

        fecharDialogEstorno();
        carregarDados();
      } catch (error: any) {
        snackbarText.value = error.message || 'Erro ao estornar venda';
        snackbarColor.value = 'error';
        snackbar.value = true;
      } finally {
        carregandoEstorno.value = false;
      }
    }

    onMounted(() => {
      carregarDados();
    });
    
    return { 
      kpis, 
      vendas,
      vendasComEstorno,
      headers,
      modalNovaVenda,
      carregando,
      dialogEstorno,
      motivoEstorno,
      carregandoEstorno,
      snackbar,
      snackbarText,
      snackbarColor,
      podeEstornar,
      abrirModalVenda,
      handleVendaCriada,
      carregarDados,
      formatarPreco,
      formatarData,
      formatarPagamento,
      getCorPagamento,
      abrirDialogEstorno,
      fecharDialogEstorno,
      confirmarEstorno,
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
