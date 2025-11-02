<template>
  <div style="width: 100%; max-width: 100%; overflow-y: auto; box-sizing: border-box;">
    <!-- Header -->
    <UsuarioHeader 
      @abrirModalCadastro="modalCadastro = true"
    />
    
    <!-- Tabela -->
    <v-row no-gutters>
      <v-col cols="12">
        <UsuarioTabela 
          :usuarios="usuarios"
          @editar="abrirModalEdicao"
          @deletar="confirmarDelecao"
        />
      </v-col>
    </v-row>

    <!-- Modal de Cadastro -->
    <ModalCadastrarUsuario
      v-model="modalCadastro"
      @salvar="adicionarUsuario"
    />

    <!-- Modal de Edição -->
    <ModalEditarUsuario
      v-model="modalEdicao"
      :usuario="usuarioSelecionado"
      @salvar="atualizarUsuario"
    />

    <!-- Dialog de Confirmação de Deleção -->
    <v-dialog v-model="dialogDeletar" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o usuário <strong>{{ usuarioSelecionado?.nome }}</strong>?
          <br>Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogDeletar = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deletarUsuario">
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
import UsuarioHeader from './components/UsuarioHeader.vue';
import UsuarioTabela from './components/UsuarioTabela.vue';
import ModalCadastrarUsuario from './components/ModalCadastrarUsuario.vue';
import ModalEditarUsuario from './components/ModalEditarUsuario.vue';
import { 
  listarUsuarios, 
  criarUsuario, 
  atualizarUsuario as apiAtualizarUsuario, 
  deletarUsuario as apiDeletarUsuario 
} from './api';
import type { UsuarioResponse, UsuarioInput } from './api';

export default defineComponent({
  name: 'UsuarioModule',
  components: { 
    UsuarioHeader, 
    UsuarioTabela,
    ModalCadastrarUsuario,
    ModalEditarUsuario
  },
  setup() {
    const usuarios = ref<UsuarioResponse[]>([]);
    const modalCadastro = ref(false);
    const modalEdicao = ref(false);
    const dialogDeletar = ref(false);
    const usuarioSelecionado = ref<UsuarioResponse | null>(null);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    
    async function carregarUsuarios() {
      try {
        const resultado = await listarUsuarios();
        console.log('Usuários recebidos da API:', resultado);
        usuarios.value = resultado;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        mostrarMensagem('Erro ao carregar usuários', 'error');
      }
    }
    
    async function adicionarUsuario(usuario: UsuarioInput) {
      try {
        const novo = await criarUsuario(usuario);
        usuarios.value.push(novo);
        mostrarMensagem('Usuário criado com sucesso!', 'success');
        modalCadastro.value = false;
      } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        mostrarMensagem('Erro ao criar usuário', 'error');
      }
    }

    function abrirModalEdicao(usuario: UsuarioResponse) {
      usuarioSelecionado.value = usuario;
      modalEdicao.value = true;
    }

    async function atualizarUsuario(usuarioAtualizado: any) {
      try {
        const { id, ...dados } = usuarioAtualizado;
        const atualizado = await apiAtualizarUsuario(id, dados);
        
        const index = usuarios.value.findIndex(u => u.id === id);
        if (index !== -1) {
          usuarios.value[index] = atualizado;
        }
        
        modalEdicao.value = false;
        mostrarMensagem('Usuário atualizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        mostrarMensagem('Erro ao atualizar usuário', 'error');
      }
    }

    function confirmarDelecao(usuario: UsuarioResponse) {
      usuarioSelecionado.value = usuario;
      dialogDeletar.value = true;
    }

    async function deletarUsuario() {
      if (!usuarioSelecionado.value) return;
      
      try {
        await apiDeletarUsuario(usuarioSelecionado.value.id);
        usuarios.value = usuarios.value.filter(u => u.id !== usuarioSelecionado.value?.id);
        dialogDeletar.value = false;
        mostrarMensagem('Usuário excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        mostrarMensagem('Erro ao excluir usuário', 'error');
      }
    }

    function mostrarMensagem(texto: string, cor: string) {
      snackbarText.value = texto;
      snackbarColor.value = cor;
      snackbar.value = true;
    }
    
    onMounted(() => {
      carregarUsuarios();
    });
    
    return {
      usuarios,
      modalCadastro,
      modalEdicao,
      dialogDeletar,
      usuarioSelecionado,
      snackbar,
      snackbarText,
      snackbarColor,
      adicionarUsuario,
      abrirModalEdicao,
      atualizarUsuario,
      confirmarDelecao,
      deletarUsuario,
    };
  },
});
</script>

<style scoped>
.usuario-module {
  padding: 24px;
}
</style>
