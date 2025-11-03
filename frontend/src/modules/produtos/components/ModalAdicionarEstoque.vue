<template>
  <v-dialog v-model="dialogInterno" max-width="800px" persistent>
    <v-card>
      <v-card-title class="bg-success d-flex align-center pa-4">
        <v-icon class="mr-2" color="white">mdi-package-variant-plus</v-icon>
        <span class="text-white text-h6">Adicionar ao Estoque</span>
        <v-spacer></v-spacer>
        <v-btn icon size="small" variant="text" @click="fechar">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <!-- Seleção de Produto -->
        <v-row>
          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1 pa-3 bg-grey-lighten-4">
                <v-icon class="mr-2" size="small">mdi-package-variant</v-icon>
                Selecionar Produto
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="8">
                    <v-select
                      v-model="produtoSelecionado"
                      :items="produtosDisponiveis"
                      item-title="nome"
                      item-value="id"
                      label="Produto"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-package-variant"
                      :return-object="true"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:append>
                            <v-chip color="primary" size="small">
                              Estoque: {{ item.raw.quantidade }}
                            </v-chip>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model.number="quantidadeAdicionar"
                      label="Quantidade"
                      type="number"
                      min="1"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-numeric"
                    />
                  </v-col>
                  <v-col cols="12" md="2" class="d-flex align-center">
                    <v-btn
                      color="success"
                      block
                      @click="adicionarItem"
                      :disabled="!produtoSelecionado || quantidadeAdicionar <= 0"
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

        <!-- Lista de Itens a Atualizar -->
        <v-row v-if="itens.length > 0">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1 pa-3 bg-grey-lighten-4 d-flex align-center">
                <v-icon class="mr-2" size="small">mdi-cart-plus</v-icon>
                Produtos a Atualizar
                <v-spacer></v-spacer>
                <v-chip color="success" size="small">
                  {{ itens.length }} {{ itens.length === 1 ? 'produto' : 'produtos' }}
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
                      <v-avatar color="success" size="40">
                        <v-icon color="white">mdi-package-variant</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ item.produto_nome }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Estoque atual: {{ item.estoque_atual }} → Novo: {{ item.estoque_atual + item.quantidade }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <v-chip color="success" class="mr-2">
                          +{{ item.quantidade }} un
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

        <!-- Mensagem de erro -->
        <v-alert v-if="erro" type="error" variant="tonal" class="mt-4">
          {{ erro }}
        </v-alert>

        <!-- Mensagem de lista vazia -->
        <v-alert v-if="itens.length === 0" type="info" variant="tonal" class="mt-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-information</v-icon>
            Selecione produtos para adicionar ao estoque
          </div>
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="fechar" :disabled="carregando">
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          variant="elevated"
          @click="confirmar"
          :loading="carregando"
          :disabled="itens.length === 0"
          prepend-icon="mdi-check"
        >
          Atualizar Estoque
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import type { Produto } from '../../../types/produto';

interface ItemEstoque {
  produto_id: string;
  produto_nome: string;
  estoque_atual: number;
  quantidade: number;
}

export default defineComponent({
  name: 'ModalAdicionarEstoque',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    produtos: {
      type: Array as PropType<Produto[]>,
      required: true
    }
  },
  emits: ['update:modelValue', 'atualizar'],
  setup(props, { emit }) {
    const dialogInterno = ref(false);
    const produtoSelecionado = ref<Produto | null>(null);
    const quantidadeAdicionar = ref(1);
    const itens = ref<ItemEstoque[]>([]);
    const carregando = ref(false);
    const erro = ref('');

    const produtosDisponiveis = computed(() => {
      const idsNaLista = itens.value.map(i => i.produto_id);
      return props.produtos.filter(p => !idsNaLista.includes(p.id));
    });

    watch(() => props.modelValue, (val) => {
      dialogInterno.value = val;
      if (val) {

        itens.value = [];
        produtoSelecionado.value = null;
        quantidadeAdicionar.value = 1;
        erro.value = '';
      }
    });

    watch(dialogInterno, (val) => {
      emit('update:modelValue', val);
    });

    function adicionarItem() {
      if (!produtoSelecionado.value || quantidadeAdicionar.value <= 0) return;

      const jaExiste = itens.value.find(i => i.produto_id === produtoSelecionado.value!.id);
      if (jaExiste) {
        erro.value = 'Este produto já está na lista';
        return;
      }

      itens.value.push({
        produto_id: produtoSelecionado.value.id,
        produto_nome: produtoSelecionado.value.nome,
        estoque_atual: produtoSelecionado.value.quantidade,
        quantidade: quantidadeAdicionar.value
      });

      produtoSelecionado.value = null;
      quantidadeAdicionar.value = 1;
      erro.value = '';
    }

    function removerItem(index: number) {
      itens.value.splice(index, 1);
    }

    function confirmar() {
      if (itens.value.length === 0) return;

      emit('atualizar', itens.value);
      fechar();
    }

    function fechar() {
      dialogInterno.value = false;
      erro.value = '';
    }

    return {
      dialogInterno,
      produtoSelecionado,
      quantidadeAdicionar,
      itens,
      carregando,
      erro,
      produtosDisponiveis,
      adicionarItem,
      removerItem,
      confirmar,
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
