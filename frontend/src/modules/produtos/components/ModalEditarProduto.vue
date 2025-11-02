<template>
  <v-dialog v-model="dialogInterno" max-width="500px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary pa-4">
        <v-icon class="mr-2" color="white">mdi-pencil</v-icon>
        <span class="text-white">Editar Produto</span>
        <v-spacer></v-spacer>
        <v-btn icon size="small" variant="text" @click="fechar">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="salvar">
          <v-text-field
            v-model="produtoEditado.nome"
            label="Nome do Produto"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant"
            required
            class="mb-4"
          />
          
          <v-text-field
            v-model="produtoEditado.preco"
            label="Preço"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-currency-brl"
            required
            type="number"
            step="0.01"
            min="0"
            class="mb-4"
          />

          <v-text-field
            v-model="produtoEditado.quantidade"
            label="Quantidade em Estoque"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant-closed"
            required
            type="number"
            min="0"
            class="mb-4"
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
          prepend-icon="mdi-content-save"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import type { Produto } from '../../../types/produto';

export default defineComponent({
  name: 'ModalEditarProduto',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    produto: {
      type: Object as PropType<Produto | null>,
      default: null
    }
  },
  emits: ['update:modelValue', 'salvar'],
  setup(props, { emit }) {
    const dialogInterno = ref(false);
    const carregando = ref(false);
    const erro = ref('');
    const produtoEditado = ref({
      nome: '',
      preco: 0,
      quantidade: 0
    });

    watch(() => props.modelValue, (val) => {
      dialogInterno.value = val;
      if (val && props.produto) {
        produtoEditado.value = {
          nome: props.produto.nome,
          preco: props.produto.preco,
          quantidade: props.produto.quantidade
        };
        erro.value = '';
      }
    });

    watch(dialogInterno, (val) => {
      emit('update:modelValue', val);
    });

    function salvar() {
      if (!props.produto) return;
      
      if (!produtoEditado.value.nome || produtoEditado.value.preco <= 0 || produtoEditado.value.quantidade < 0) {
        erro.value = 'Preencha todos os campos corretamente';
        return;
      }

      emit('salvar', {
        id: props.produto.id,
        ...produtoEditado.value
      });
    }

    function fechar() {
      dialogInterno.value = false;
      erro.value = '';
    }

    return {
      dialogInterno,
      carregando,
      erro,
      produtoEditado,
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
