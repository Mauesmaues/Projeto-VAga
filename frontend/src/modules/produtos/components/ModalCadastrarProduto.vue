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
        <v-form ref="formRef" @submit.prevent="salvar">
          <v-text-field
            v-model="produto.nome"
            label="Nome do Produto"
            placeholder="Ex: Dipirona 500mg"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant"
            required
            class="mb-4"
            :error-messages="erros.nome"
            @input="erros.nome = ''"
          />
          
          <v-text-field
            v-model="precoFormatado"
            label="Preço (R$)"
            placeholder="0,00"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-currency-brl"
            required
            class="mb-4"
            :error-messages="erros.preco"
            @input="erros.preco = ''"
            hint="Use vírgula para separar centavos"
          />

          <v-text-field
            v-model.number="produto.quantidade"
            label="Quantidade em Estoque"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-package-variant-closed"
            required
            type="number"
            min="0"
            class="mb-4"
            :error-messages="erros.quantidade"
            @input="erros.quantidade = ''"
          />

          <v-alert v-if="erro" type="error" variant="tonal" closable @click:close="erro = ''">
            <strong>Erro:</strong> {{ erro }}
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
          Salvar Produto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

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
    const formRef = ref<any>(null);
    const carregando = ref(false);
    const erro = ref('');
    const erros = ref({
      nome: '',
      preco: '',
      quantidade: ''
    });
    const produto = ref({
      nome: '',
      preco: null as number | null,
      quantidade: 0 as number | null
    });
    const precoInput = ref('');

    const precoFormatado = computed({
      get: () => {
        if (!precoInput.value) return '';
        return precoInput.value;
      },
      set: (value: string) => {

        let valorLimpo = value.replace(/[^\d,]/g, '');

        const partes = valorLimpo.split(',');
        if (partes.length > 2) {
          valorLimpo = partes[0] + ',' + partes.slice(1).join('');
        }

        if (partes.length === 2 && partes[1].length > 2) {
          valorLimpo = partes[0] + ',' + partes[1].substring(0, 2);
        }
        
        precoInput.value = valorLimpo;

        if (valorLimpo) {
          const numeroConvertido = parseFloat(valorLimpo.replace(',', '.'));
          produto.value.preco = isNaN(numeroConvertido) ? null : numeroConvertido;
        } else {
          produto.value.preco = null;
        }
      }
    });

    watch(() => props.modelValue, (val) => {
      dialogInterno.value = val;
      if (val) {
        limparFormulario();
      }
    });

    watch(dialogInterno, (val) => {
      emit('update:modelValue', val);
    });

    function limparFormulario() {
      produto.value = {
        nome: '',
        preco: null,
        quantidade: 0
      };
      precoInput.value = '';
      erro.value = '';
      erros.value = {
        nome: '',
        preco: '',
        quantidade: ''
      };
    }

    function validarCampos(): boolean {
      let valido = true;
      erros.value = {
        nome: '',
        preco: '',
        quantidade: ''
      };

      if (!produto.value.nome || !produto.value.nome.trim()) {
        erros.value.nome = 'Nome é obrigatório';
        valido = false;
      } else if (produto.value.nome.trim().length < 3) {
        erros.value.nome = 'Nome deve ter no mínimo 3 caracteres';
        valido = false;
      }

      if (produto.value.preco === null || produto.value.preco === undefined) {
        erros.value.preco = 'Preço é obrigatório';
        valido = false;
      } else if (produto.value.preco <= 0) {
        erros.value.preco = 'Preço deve ser maior que zero';
        valido = false;
      }

      if (produto.value.quantidade === null || produto.value.quantidade === undefined) {
        erros.value.quantidade = 'Quantidade é obrigatória';
        valido = false;
      } else if (produto.value.quantidade < 0) {
        erros.value.quantidade = 'Quantidade não pode ser negativa';
        valido = false;
      }

      return valido;
    }

    function salvar() {
      erro.value = '';
      
      if (!validarCampos()) {
        erro.value = 'Por favor, corrija os campos destacados em vermelho';
        return;
      }

      emit('salvar', {
        nome: produto.value.nome.trim(),
        preco: Number(produto.value.preco),
        quantidade: Number(produto.value.quantidade)
      });
      
      fechar();
    }

    function fechar() {
      dialogInterno.value = false;
      limparFormulario();
    }

    return {
      dialogInterno,
      formRef,
      carregando,
      erro,
      erros,
      produto,
      precoFormatado,
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
