<template>
  <v-dialog v-model="modelValue" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4 bg-primary text-white">
        <v-icon class="mr-2">mdi-account-edit</v-icon>
        Editar Usuário
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="salvar">
          <v-text-field
            v-model="usuarioEdit.nome"
            label="Nome Completo"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio]"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuarioEdit.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio, regras.email]"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuarioEdit.senha"
            label="Nova Senha (deixe em branco para não alterar)"
            :type="mostrarSenha ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="mostrarSenha = !mostrarSenha"
            variant="outlined"
            density="comfortable"
            :rules="[regras.senhaOpcional]"
            hint="Deixe em branco para não alterar a senha"
            persistent-hint
          ></v-text-field>

          <v-select
            v-model="usuarioEdit.tipo"
            :items="tiposUsuario"
            label="Tipo de Usuário"
            prepend-inner-icon="mdi-shield-account"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio]"
            required
          ></v-select>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="fechar">
          Cancelar
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="salvar">
          <v-icon class="mr-1">mdi-content-save</v-icon>
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import type { UsuarioResponse } from '../api';

export default defineComponent({
  name: 'ModalEditarUsuario',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    usuario: {
      type: Object as PropType<UsuarioResponse | null>,
      default: null,
    },
  },
  emits: ['update:modelValue', 'salvar'],
  setup(props, { emit }) {
    const form = ref<any>(null);
    const mostrarSenha = ref(false);
    const usuarioEdit = ref({
      id: '',
      nome: '',
      email: '',
      senha: '',
      tipo: '',
    });

    const tiposUsuario = [
      { title: 'Administrador', value: 'admin' },
      { title: 'Operador', value: 'operador' },
    ];

    const regras = {
      obrigatorio: (v: string) => !!v || 'Campo obrigatório',
      email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
      senhaOpcional: (v: string) => !v || v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
    };

    function carregarDados() {
      if (props.usuario) {
        usuarioEdit.value = {
          id: props.usuario.id,
          nome: props.usuario.nome,
          email: props.usuario.email,
          senha: '',
          tipo: props.usuario.tipo,
        };
      }
    }

    async function salvar() {
      const { valid } = await form.value.validate();
      if (valid) {
        const dados: any = {
          id: usuarioEdit.value.id,
          nome: usuarioEdit.value.nome,
          email: usuarioEdit.value.email,
          tipo: usuarioEdit.value.tipo,
        };
        
        // Só inclui a senha se foi preenchida
        if (usuarioEdit.value.senha) {
          dados.senha = usuarioEdit.value.senha;
        }
        
        emit('salvar', dados);
        fechar();
      }
    }

    function fechar() {
      emit('update:modelValue', false);
      mostrarSenha.value = false;
    }

    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        carregarDados();
      }
    });

    watch(() => props.usuario, () => {
      if (props.modelValue) {
        carregarDados();
      }
    });

    return {
      form,
      usuarioEdit,
      tiposUsuario,
      regras,
      mostrarSenha,
      salvar,
      fechar,
    };
  },
});
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}
</style>
