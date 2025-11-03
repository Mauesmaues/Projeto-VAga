<template>
  <v-row align="center" class="mb-8" no-gutters>
    <v-col cols="12" md="6" class="d-flex align-center">
      <v-avatar color="primary" size="48">
        <v-icon>mdi-history</v-icon>
      </v-avatar>
      <div class="ml-4">
        <div class="text-h5 font-weight-bold">Histórico de Estoque</div>
        <div class="text-caption text-grey-lighten-1">Saídas detalhadas por produto</div>
      </div>
    </v-col>
    <v-col cols="12" md="6" class="d-flex justify-end">
      <v-chip color="primary" variant="flat" prepend-icon="mdi-package-variant-closed">
        {{ totalItens }} movimentações
      </v-chip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HistoricoEstoqueHeader',
  props: {
    totalItens: {
      type: Number,
      required: true
    }
  }
});
</script>
