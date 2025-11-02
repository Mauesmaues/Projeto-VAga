<template>
  <v-dialog v-model="dialogInterno" max-width="600px" persistent>
    <v-card>
      <v-card-title class="bg-primary d-flex align-center pa-4">
        <v-icon class="mr-2" color="white">mdi-plus-circle</v-icon>
        <span class="text-white text-h6">Cadastrar Novo Produto</span>
        <v-spacer></v-spacer>
        <v-btn icon size="small" variant="text" @click="fechar">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="salvar">
          <v-text-field
            v-model="produto.nome"
            label="Nome do Produto"
            placeholder="Ex: Dipirona 500mg"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant"
            required
            class="mb-4"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
          
          <v-text-field
            v-model="produto.preco"
            label="Preço"
            placeholder="0,00"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-currency-brl"
            required
            type="number"
            step="0.01"
            min="0"
            class="mb-4"
            :rules="[v => !!v || 'Preço é obrigatório', v => v > 0 || 'Preço deve ser maior que zero']"
          />

          <v-text-field
            v-model="produto.quantidade"
            label="Quantidade em Estoque"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant-closed"
            required
            type="number"
            min="0"
            class="mb-4"
            :rules="[v => v !== null && v !== '' || 'Quantidade é obrigatória', v => v >= 0 || 'Quantidade não pode ser negativa']"
          />

          <v-alert v-if="erro" type="error" variant="tonal" class="mb-4">
            {{ erro }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="fechar" :disabled="carregando">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="salvar"
          :loading="carregando"
          :disabled="!produto.nome || !produto.preco || produto.preco <= 0 || produto.quantidade === null || produto.quantidade < 0"
          prepend-icon="mdi-content-save"
        >
          Salvar Produto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ModalCadastrarProduto',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'salvar'],
  setup(props, { emit }) {
    const dialogInterno = ref(false);
    const carregando = ref(false);
    const erro = ref('');
    const produto = ref({
      nome: '',
      preco: null as number | null,
      quantidade: 0 as number | null
    });

    watch(() => props.modelValue, (val) => {
      dialogInterno.value = val;
      if (val) {
        // Resetar formulário ao abrir
        produto.value = {
          nome: '',
          preco: null,
          quantidade: 0
        };
        erro.value = '';
      }
    });

    watch(dialogInterno, (val) => {
      emit('update:modelValue', val);
    });

    function salvar() {
      if (!produto.value.nome || !produto.value.preco || produto.value.preco <= 0 || produto.value.quantidade === null || produto.value.quantidade < 0) {
        erro.value = 'Preencha todos os campos corretamente';
        return;
      }

      emit('salvar', {
        nome: produto.value.nome,
        preco: Number(produto.value.preco),
        quantidade: Number(produto.value.quantidade)
      });
      
      fechar();
    }

    function fechar() {
      dialogInterno.value = false;
      erro.value = '';
    }

    return {
      dialogInterno,
      carregando,
      erro,
      produto,
      salvar,
      fechar
    };
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}
</style>
