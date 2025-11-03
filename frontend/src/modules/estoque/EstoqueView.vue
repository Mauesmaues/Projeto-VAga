<template>
  <div style="width: 100%; max-width: 100%; overflow-y: auto; box-sizing: border-box;">
    <!-- Header -->
    <HistoricoEstoqueHeader 
      :totalItens="historico.length"
    />
    
    <!-- Tabela -->
    <v-row no-gutters>
      <v-col cols="12">
        <HistoricoEstoqueTabela 
          :historico="historico"
        />
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import HistoricoEstoqueHeader from './components/HistoricoEstoqueHeader.vue';
import HistoricoEstoqueTabela from './components/HistoricoEstoqueTabela.vue';
import { listarHistorico } from './api';
import type { HistoricoEstoqueItem } from './api';

export default defineComponent({
  name: 'EstoqueModule',
  components: { 
    HistoricoEstoqueHeader, 
    HistoricoEstoqueTabela
  },
  setup() {
    const historico = ref<HistoricoEstoqueItem[]>([]);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    
    async function carregarHistorico() {
      try {
        const resultado = await listarHistorico();
        historico.value = resultado;
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        mostrarMensagem('Erro ao carregar histórico de estoque', 'error');
      }
    }

    function mostrarMensagem(texto: string, cor: string) {
      snackbarText.value = texto;
      snackbarColor.value = cor;
      snackbar.value = true;
    }
    
    onMounted(() => {
      carregarHistorico();
    });
    
    return {
      historico,
      snackbar,
      snackbarText,
      snackbarColor,
    };
  },
});
</script>

<style scoped>
.estoque-module {
  padding: 24px;
}
</style>
