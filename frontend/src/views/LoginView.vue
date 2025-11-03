<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <v-icon color="primary" size="48">mdi-pill</v-icon>
          <h2>ANB Farma</h2>
          <p class="subtitle">Sistema PDV</p>
        </div>
        <form @submit.prevent="entrar">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" required placeholder="seu@email.com" />
          </div>
          <div class="form-group">
            <label for="senha">Senha</label>
            <input id="senha" type="password" v-model="senha" required placeholder="••••••••" />
          </div>
          <button type="submit" :disabled="carregando" class="btn-login">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <Modal :visivel="erroVisivel" @fechar="erroVisivel = false">
          <p>{{ mensagemErro }}</p>
        </Modal>
      </div>
    </div>
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
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(25, 118, 210, 0.85), rgba(33, 150, 243, 0.85)),
              url('/login-bg.jpg') center/cover no-repeat;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 1rem 0 0.5rem;
  color: #1976D2;
  font-size: 28px;
  font-weight: 600;
}

.login-header .subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #E3F2FD;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1976D2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.btn-login {
  width: 100%;
  padding: 0.875rem;
  background: #1976D2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background: #1565C0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
