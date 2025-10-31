<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="entrar">
      <div>
        <label for="nome">Usuário</label>
        <input id="nome" v-model="nome" required />
      </div>
      <div>
        <label for="senha">Senha</label>
        <input id="senha" type="password" v-model="senha" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
    <Modal :visivel="erroVisivel" @fechar="erroVisivel = false">
      <p>Usuário ou senha inválidos.</p>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '../components/Modal.vue';

export default defineComponent({
  name: 'LoginView',
  components: { Modal },
  setup() {
    const nome = ref('');
    const senha = ref('');
    const erroVisivel = ref(false);

    const entrar = async () => {
      // Substitua a URL pelo endpoint real do backend
      const resp = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.value, senha: senha.value })
      });
      if (resp.ok) {
        // Redirecionar ou salvar usuário logado
      } else {
        erroVisivel.value = true;
      }
    };

    return { nome, senha, erroVisivel, entrar };
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
