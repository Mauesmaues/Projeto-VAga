<template>
  <v-dialog v-model="dialogInterno" max-width="800px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="bg-primary d-flex align-center pa-4">
        <v-icon class="mr-2" color="white">mdi-cart-plus</v-icon>
        <span class="text-white text-h6">Nova Venda</span>
        <v-spacer></v-spacer>
        <v-btn icon size="small" variant="text" @click="fechar">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Conteúdo -->
      <v-card-text class="pa-6">
        <!-- Seleção de Produto -->
        <v-row>
          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1 pa-3 bg-grey-lighten-4">
                <v-icon class="mr-2" size="small">mdi-package-variant</v-icon>
                Adicionar Produto
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="produtoSelecionado"
                      :items="produtos"
                      item-title="nome"
                      item-value="id"
                      label="Produto"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-package-variant"
                      :return-object="true"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item 
                          v-bind="props"
                          :disabled="item.raw.quantidade === 0"
                          :class="{ 'text-grey': item.raw.quantidade === 0 }"
                        >
                          <template v-slot:title>
                            {{ item.raw.nome }}
                            <v-chip 
                              v-if="item.raw.quantidade === 0" 
                              color="error" 
                              size="x-small" 
                              class="ml-2"
                            >
                              SEM ESTOQUE
                            </v-chip>
                          </template>
                          <template v-slot:append>
                            <v-chip color="success" size="small">
                              {{ formatarPreco(item.raw.preco) }}
                            </v-chip>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model.number="quantidade"
                      label="Quantidade"
                      type="number"
                      min="1"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-numeric"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex align-center">
                    <v-btn
                      color="primary"
                      block
                      @click="adicionarItem"
                      :disabled="!produtoSelecionado || quantidade <= 0"
                      prepend-icon="mdi-plus"
                    >
                      Adicionar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Lista de Itens -->
        <v-row v-if="itens.length > 0">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1 pa-3 bg-grey-lighten-4 d-flex align-center">
                <v-icon class="mr-2" size="small">mdi-cart</v-icon>
                Itens da Venda
                <v-spacer></v-spacer>
                <v-chip color="primary" size="small">
                  {{ itens.length }} {{ itens.length === 1 ? 'item' : 'itens' }}
                </v-chip>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="(item, index) in itens"
                    :key="index"
                    class="px-4"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon color="white">mdi-package-variant</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ item.produto_nome }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.quantidade }}x {{ formatarPreco(item.preco_unitario) }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <v-chip color="success" class="mr-2">
                          {{ formatarPreco(item.subtotal) }}
                        </v-chip>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          variant="text"
                          @click="removerItem(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Forma de Pagamento -->
        <v-row v-if="itens.length > 0" class="mt-4">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1 pa-3 bg-grey-lighten-4">
                <v-icon class="mr-2" size="small">mdi-cash</v-icon>
                Forma de Pagamento
              </v-card-title>
              <v-card-text class="pa-4">
                <v-radio-group v-model="formaPagamento" inline>
                  <v-radio label="Dinheiro" value="dinheiro" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-cash</v-icon>
                        Dinheiro
                      </div>
                    </template>
                  </v-radio>
                  <v-radio label="Cartão" value="cartao" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-credit-card</v-icon>
                        Cartão
                      </div>
                    </template>
                  </v-radio>
                  <v-radio label="Pix" value="pix" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-qrcode</v-icon>
                        Pix
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Total -->
        <v-row v-if="itens.length > 0" class="mt-4">
          <v-col cols="12">
            <v-card color="primary" variant="flat">
              <v-card-text class="pa-4 d-flex align-center justify-space-between">
                <div class="text-white text-h6">Total da Venda:</div>
                <div class="text-white text-h4 font-weight-bold">
                  {{ formatarPreco(total) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Mensagem de erro -->
        <v-alert v-if="erro" type="error" variant="tonal" class="mt-4">
          {{ erro }}
        </v-alert>

        <!-- Mensagem de carrinho vazio -->
        <v-alert v-if="itens.length === 0" type="info" variant="tonal" class="mt-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-information</v-icon>
            Adicione produtos para iniciar a venda
          </div>
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Footer -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="fechar"
          :disabled="carregando"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="finalizarVenda(true)"
          :loading="carregando"
          :disabled="itens.length === 0 || !formaPagamento"
          prepend-icon="mdi-cart-plus"
        >
          Continuar Vendendo
        </v-btn>
        <v-btn
          color="success"
          variant="elevated"
          @click="finalizarVenda(false)"
          :loading="carregando"
          :disabled="itens.length === 0 || !formaPagamento"
          prepend-icon="mdi-check"
        >
          Finalizar Venda
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" color="success" timeout="3000" location="bottom">
      {{ snackbarText }}
    </v-snackbar>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { listarProdutos } from '../../produtos/api';
import { criarVenda } from '../api';
import type { Produto } from '../../../types/produto';
import type { ItemVenda } from '../../../types/venda';
import { AuthService } from '../../../services/authService';

export default defineComponent({
  name: 'ModalNovaVenda',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'vendaCriada'],
  setup(props, { emit }) {
    const dialogInterno = ref(false);
    const produtos = ref<Produto[]>([]);
    const produtoSelecionado = ref<Produto | null>(null);
    const quantidade = ref(1);
    const itens = ref<ItemVenda[]>([]);
    const formaPagamento = ref<string>('');
    const carregando = ref(false);
    const erro = ref('');
    const snackbar = ref(false);
    const snackbarText = ref('');

    // Watch para sincronizar com v-model
    watch(() => props.modelValue, (val) => {
      dialogInterno.value = val;
      if (val) {
        carregarProdutos();
      }
    });

    watch(dialogInterno, (val) => {
      emit('update:modelValue', val);
    });

    const total = computed(() => {
      return itens.value.reduce((sum, item) => sum + item.subtotal, 0);
    });

    async function carregarProdutos() {
      try {
        produtos.value = await listarProdutos();
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        erro.value = 'Erro ao carregar produtos';
      }
    }

    function adicionarItem() {
      if (!produtoSelecionado.value || quantidade.value <= 0) return;

      const subtotal = produtoSelecionado.value.preco * quantidade.value;

      itens.value.push({
        produto_id: produtoSelecionado.value.id,
        produto_nome: produtoSelecionado.value.nome,
        quantidade: quantidade.value,
        preco_unitario: produtoSelecionado.value.preco,
        subtotal
      });

      // Reset
      produtoSelecionado.value = null;
      quantidade.value = 1;
      erro.value = '';
    }

    function removerItem(index: number) {
      itens.value.splice(index, 1);
    }

    async function finalizarVenda(continuarVendendo: boolean = false) {
      if (itens.value.length === 0 || !formaPagamento.value) return;

      carregando.value = true;
      erro.value = '';

      try {
        const vendaInput = {
          valor_total: total.value,
          forma_pagamento: formaPagamento.value as 'dinheiro' | 'cartao' | 'pix',
          itens: itens.value
        };

        const vendaCriada = await criarVenda(vendaInput);
        
        emit('vendaCriada', vendaCriada);
        
        // Exibir mensagem de sucesso
        snackbarText.value = 'Venda realizada com sucesso!';
        snackbar.value = true;
        
        // Reset dos itens e forma de pagamento
        itens.value = [];
        formaPagamento.value = '';
        
        // Se não for continuar vendendo, fecha o modal
        if (!continuarVendendo) {
          // Aguarda um pouco para o usuário ver a mensagem antes de fechar
          setTimeout(() => {
            fechar();
          }, 500);
        }
      } catch (error: any) {
        console.error('Erro ao finalizar venda:', error);
        erro.value = error.message || 'Erro ao finalizar venda';
      } finally {
        carregando.value = false;
      }
    }

    function fechar() {
      dialogInterno.value = false;
      erro.value = '';
    }

    function formatarPreco(valor: number): string {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    onMounted(() => {
      if (props.modelValue) {
        carregarProdutos();
      }
    });

    return {
      dialogInterno,
      produtos,
      produtoSelecionado,
      quantidade,
      itens,
      formaPagamento,
      carregando,
      erro,
      snackbar,
      snackbarText,
      total,
      adicionarItem,
      removerItem,
      finalizarVenda,
      fechar,
      formatarPreco
    };
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}

:deep(.v-radio .v-label) {
  font-weight: 500;
}
</style>
