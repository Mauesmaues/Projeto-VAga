<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="entrar">
      <div>
        <label for="email">E-mail</label>
        <input id="email" v-model="email" required />
      </div>
      <div>
        <label for="senha">Senha</label>
        <input id="senha" type="password" v-model="senha" required />
      </div>
      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
    <Modal :visivel="erroVisivel" @fechar="erroVisivel = false">
      <p>{{ mensagemErro }}</p>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';
import { AuthService } from '../services/authService';
import type { LoginResponse, ErrorResponse } from '../types/api';

export default defineComponent({
  name: 'LoginView',
  components: { Modal },
  setup() {
    const router = useRouter();
    const email = ref('');
    const senha = ref('');
    const erroVisivel = ref(false);
    const mensagemErro = ref('E-mail ou senha inválidos.');
    const carregando = ref(false);

    const entrar = async () => {
      carregando.value = true;
      
      try {
        const resp = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, senha: senha.value })
        });
        
        if (resp.ok) {
          const data: LoginResponse = await resp.json();
          
          // Salva token e usuário usando AuthService
          AuthService.setToken(data.token);
          AuthService.setUser(data.usuario);
          
          // Redireciona usando router
          router.push('/dashboard');
        } else {
          const erro: ErrorResponse = await resp.json();
          mensagemErro.value = erro.mensagem || 'E-mail ou senha inválidos.';
          erroVisivel.value = true;
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        mensagemErro.value = 'Erro ao conectar com o servidor.';
        erroVisivel.value = true;
      } finally {
        carregando.value = false;
      }
    };

    return { email, senha, erroVisivel, mensagemErro, carregando, entrar };
  }
});
</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 4rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.login-container label {
  display: block;
  margin-bottom: 0.5rem;
}
.login-container input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  width: 100%;
  padding: 0.75rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
