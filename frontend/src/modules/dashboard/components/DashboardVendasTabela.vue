
<template>
  <v-card elevation="2">
    <v-card-title>Últimas Vendas</v-card-title>
    <v-data-table 
      :items="vendasComEstorno" 
      :headers="headers" 
      class="elevation-1" 
      :items-per-page="10"
    >
      <template #item.valor_total="{ item }">
        <span>{{ formatarMoeda(item.valor_total) }}</span>
      </template>
      <template #item.forma_pagamento="{ item }">
        <v-chip 
          :color="item.estornada ? 'error' : getPaymentColor(item.forma_pagamento)" 
          size="small"
        >
          {{ item.estornada ? 'ESTORNADO' : formatarPagamento(item.forma_pagamento) }}
        </v-chip>
      </template>
      <template #item.data_venda="{ item }">
        <span>{{ formatarData(item.data_venda) }}</span>
      </template>
      <template #item.acoes="{ item }">
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
          <span v-else-if="!podeEstornar" class="text-grey text-caption">-</span>
        </div>
      </template>
    </v-data-table>

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
          <v-btn color="error" variant="elevated" @click="confirmarEstorno" :loading="carregando">
            Estornar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { listarVendas, criarEstorno, verificarEstorno } from '../../vendas/api';
import type { Venda } from '../../../types/venda';
import { PermissionService } from '../../../services/permissionService';

export default defineComponent({
  name: 'DashboardVendasTabela',
  setup() {
    const vendas = ref<Venda[]>([]);
    const estornosMap = ref<Map<string, boolean>>(new Map());
    const dialogEstorno = ref(false);
    const vendaSelecionada = ref<Venda | null>(null);
    const motivoEstorno = ref('');
    const carregando = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    const podeEstornar = PermissionService.canModify();

    console.log('Permissão para estornar:', podeEstornar);

    const headers = [
      { title: 'Data', key: 'data_venda', width: '200px' },
      { title: 'Operador', key: 'usuario_nome', width: '150px' },
      { title: 'Total', key: 'valor_total', width: '120px' },
      { title: 'Pagamento', key: 'forma_pagamento', width: '150px' },
      { title: 'Ações', key: 'acoes', sortable: false, align: 'end' as const, width: '100px' },
    ];

    const vendasComEstorno = computed(() => {
      return vendas.value.map(venda => ({
        ...venda,
        estornada: estornosMap.value.get(venda.id) || false,
      }));
    });

    const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor);
    };

    const formatarData = (data?: string) => {
      if (!data) return '-';
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const formatarPagamento = (forma: string) => {
      const formas: Record<string, string> = {
        dinheiro: 'Dinheiro',
        cartao: 'Cartão',
        pix: 'PIX',
      };
      return formas[forma] || forma;
    };

    const getPaymentColor = (forma: string) => {
      const cores: Record<string, string> = {
        dinheiro: 'success',
        cartao: 'primary',
        pix: 'info',
      };
      return cores[forma] || 'default';
    };

    const abrirDialogEstorno = (venda: Venda) => {
      vendaSelecionada.value = venda;
      motivoEstorno.value = '';
      dialogEstorno.value = true;
    };

    const fecharDialogEstorno = () => {
      dialogEstorno.value = false;
      vendaSelecionada.value = null;
      motivoEstorno.value = '';
    };

    const confirmarEstorno = async () => {
      if (!vendaSelecionada.value) return;

      carregando.value = true;
      try {
        await criarEstorno({
          venda_id: vendaSelecionada.value.id,
          motivo: motivoEstorno.value || undefined,
        });

        estornosMap.value.set(vendaSelecionada.value.id, true);

        snackbarText.value = 'Venda estornada com sucesso! Produtos devolvidos ao estoque.';
        snackbarColor.value = 'success';
        snackbar.value = true;

        fecharDialogEstorno();
      } catch (error: any) {
        snackbarText.value = error.message || 'Erro ao estornar venda';
        snackbarColor.value = 'error';
        snackbar.value = true;
      } finally {
        carregando.value = false;
      }
    };

    const carregarVendas = async () => {
      try {
        const data = await listarVendas();
        vendas.value = data.slice(0, 10);
        
        console.log('Vendas carregadas:', vendas.value.length);
        console.log('Pode estornar:', podeEstornar);

        for (const venda of vendas.value) {
          const estornada = await verificarEstorno(venda.id);
          estornosMap.value.set(venda.id, estornada);
        }
      } catch (error) {
        console.error('Erro ao carregar vendas:', error);
      }
    };

    onMounted(() => {
      carregarVendas();
    });

    return {
      vendas,
      vendasComEstorno,
      headers,
      dialogEstorno,
      motivoEstorno,
      carregando,
      snackbar,
      snackbarText,
      snackbarColor,
      podeEstornar,
      formatarMoeda,
      formatarData,
      formatarPagamento,
      getPaymentColor,
      abrirDialogEstorno,
      fecharDialogEstorno,
      confirmarEstorno,
    };
  },
});
</script>
