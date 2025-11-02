
<template>
  <v-card elevation="2">
    <v-card-title>Últimas Vendas</v-card-title>
    <v-data-table :items="vendas" :headers="headers" class="elevation-1" hide-default-footer>
      <template #item.total="{ item }">
        <span>{{ item.total }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardVendasTabela',
  setup() {
    const vendas = [
      { data: '31/10/2025', operador: 'Marcos', itens: 5, total: 'R$ 250,00', pagamento: 'Cartão' },
      { data: '31/10/2025', operador: 'João', itens: 2, total: 'R$ 80,00', pagamento: 'Pix' },
      { data: '30/10/2025', operador: 'Marcos', itens: 3, total: 'R$ 120,00', pagamento: 'Dinheiro' },
    ];
    const headers = [
      { text: 'Data', value: 'data' },
      { text: 'Operador', value: 'operador' },
      { text: 'Itens', value: 'itens' },
      { text: 'Total', value: 'total' },
      { text: 'Pagamento', value: 'pagamento' }
    ];
    return { vendas, headers };
  }
});
</script>
