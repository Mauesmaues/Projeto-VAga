<template>
  <v-dialog v-model="modelValue" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4 bg-primary text-white">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        Cadastrar Novo Usuário
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="salvar">
          <v-text-field
            v-model="usuario.nome"
            label="Nome Completo"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio]"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio, regras.email]"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.senha"
            label="Senha"
            :type="mostrarSenha ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="mostrarSenha = !mostrarSenha"
            variant="outlined"
            density="comfortable"
            :rules="[regras.obrigatorio, regras.senhaMinima]"
            required
          ></v-text-field>

          <v-select
            v-model="usuario.tipo"
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
import { defineComponent, ref, watch } from 'vue';
import type { UsuarioInput } from '../api';

export default defineComponent({
  name: 'ModalCadastrarUsuario',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'salvar'],
  setup(props, { emit }) {
    const form = ref<any>(null);
    const mostrarSenha = ref(false);
    const usuario = ref<UsuarioInput>({
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
      senhaMinima: (v: string) => (v && v.length >= 6) || 'Senha deve ter no mínimo 6 caracteres',
    };

    function limparFormulario() {
      usuario.value = {
        nome: '',
        email: '',
        senha: '',
        tipo: '',
      };
      mostrarSenha.value = false;
      if (form.value) {
        form.value.resetValidation();
      }
    }

    async function salvar() {
      const { valid } = await form.value.validate();
      if (valid) {
        emit('salvar', { ...usuario.value });
        fechar();
      }
    }

    function fechar() {
      emit('update:modelValue', false);
      limparFormulario();
    }

    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        limparFormulario();
      }
    });

    return {
      form,
      usuario,
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
