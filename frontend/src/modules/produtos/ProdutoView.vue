
<template>
  <div style="width: 100%; max-width: 100%; overflow-y: auto; box-sizing: border-box;">
    <!-- Header -->
    <ProdutoHeader 
      @abrirModalCadastro="modalCadastro = true"
      @abrirModalEstoque="modalEstoque = true"
    />
    
    <!-- Tabela -->
    <v-row no-gutters>
      <v-col cols="12">
        <ProdutoTabela 
          :produtos="produtos"
          @editar="abrirModalEdicao"
          @deletar="confirmarDelecao"
        />
      </v-col>
    </v-row>

    <!-- Modal de Cadastro -->
    <ModalCadastrarProduto
      v-model="modalCadastro"
      @salvar="adicionarProduto"
    />

    <!-- Modal de Adicionar ao Estoque -->
    <ModalAdicionarEstoque
      v-model="modalEstoque"
      :produtos="produtos"
      @atualizar="atualizarEstoque"
    />

    <!-- Modal de Edição -->
    <ModalEditarProduto
      v-model="modalEdicao"
      :produto="produtoSelecionado"
      @salvar="atualizarProduto"
    />

    <!-- Dialog de Confirmação de Deleção -->
    <v-dialog v-model="dialogDeletar" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o produto <strong>{{ produtoSelecionado?.nome }}</strong>?
          <br>Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogDeletar = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deletarProduto">
            Excluir
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

import { defineComponent, ref, onMounted } from 'vue';
import ProdutoHeader from './components/ProdutoHeader.vue';
import ProdutoTabela from './components/ProdutoTabela.vue';
import ModalCadastrarProduto from './components/ModalCadastrarProduto.vue';
import ModalAdicionarEstoque from './components/ModalAdicionarEstoque.vue';
import ModalEditarProduto from './components/ModalEditarProduto.vue';
import { listarProdutos, criarProduto, atualizarProduto as apiAtualizarProduto, deletarProduto as apiDeletarProduto } from './api';
import type { Produto, ProdutoInput } from '../../types/produto';

export default defineComponent({
  name: 'ProdutoModule',
  components: { 
    ProdutoHeader, 
    ProdutoTabela,
    ModalCadastrarProduto,
    ModalAdicionarEstoque,
    ModalEditarProduto
  },
  setup() {
    const produtos = ref<Produto[]>([]);
    const modalCadastro = ref(false);
    const modalEstoque = ref(false);
    const modalEdicao = ref(false);
    const dialogDeletar = ref(false);
    const produtoSelecionado = ref<Produto | null>(null);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    
    async function carregarProdutos() {
      try {
        const resultado = await listarProdutos();
        console.log('Produtos recebidos da API:', resultado);
        produtos.value = resultado;
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarMensagem('Erro ao carregar produtos', 'error');
      }
    }
    
    async function adicionarProduto(produto: ProdutoInput) {
      try {
        const novo = await criarProduto(produto);
        produtos.value.push(novo);
        mostrarMensagem('Produto criado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        mostrarMensagem('Erro ao criar produto', 'error');
      }
    }

    function abrirModalEdicao(produto: Produto) {
      produtoSelecionado.value = produto;
      modalEdicao.value = true;
    }

    async function atualizarProduto(produtoAtualizado: any) {
      try {
        const { id, ...dados } = produtoAtualizado;
        const atualizado = await apiAtualizarProduto(id, dados);
        
        const index = produtos.value.findIndex(p => p.id === id);
        if (index !== -1) {
          produtos.value[index] = atualizado;
        }
        
        modalEdicao.value = false;
        mostrarMensagem('Produto atualizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        mostrarMensagem('Erro ao atualizar produto', 'error');
      }
    }

    async function atualizarEstoque(itens: any[]) {
      try {
        // Atualizar cada produto
        const promises = itens.map(item => 
          apiAtualizarProduto(item.produto_id, {
            quantidade: item.estoque_atual + item.quantidade
          })
        );

        const atualizados = await Promise.all(promises);
        
        // Atualizar lista local
        atualizados.forEach(produtoAtualizado => {
          const index = produtos.value.findIndex(p => p.id === produtoAtualizado.id);
          if (index !== -1) {
            produtos.value[index] = produtoAtualizado;
          }
        });

        mostrarMensagem(`${itens.length} produto(s) atualizado(s) com sucesso!`, 'success');
      } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        mostrarMensagem('Erro ao atualizar estoque', 'error');
      }
    }

    function confirmarDelecao(produto: Produto) {
      produtoSelecionado.value = produto;
      dialogDeletar.value = true;
    }

    async function deletarProduto() {
      if (!produtoSelecionado.value) return;
      
      try {
        await apiDeletarProduto(produtoSelecionado.value.id);
        produtos.value = produtos.value.filter(p => p.id !== produtoSelecionado.value?.id);
        dialogDeletar.value = false;
        mostrarMensagem('Produto excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        mostrarMensagem('Erro ao excluir produto', 'error');
      }
    }

    function mostrarMensagem(texto: string, cor: string) {
      snackbarText.value = texto;
      snackbarColor.value = cor;
      snackbar.value = true;
    }
    
    onMounted(carregarProdutos);
    
    return { 
      produtos,
      modalCadastro,
      modalEstoque,
      modalEdicao,
      dialogDeletar,
      produtoSelecionado,
      snackbar,
      snackbarText,
      snackbarColor,
      adicionarProduto,
      abrirModalEdicao,
      atualizarProduto,
      atualizarEstoque,
      confirmarDelecao,
      deletarProduto
    };
  },
});
</script>

<style scoped>
.v-row {
  margin: 0 !important;
}
</style>
