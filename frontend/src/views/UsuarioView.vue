<template>
  <div>
    <h2>Usuários</h2>
    <ul>
      <li v-for="usuario in usuarios" :key="usuario.id">
        {{ usuario.nome }} ({{ usuario.tipo }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Usuario } from '../models/Usuario';

export default defineComponent({
  name: 'UsuarioView',
  setup() {
    const usuarios = ref<Usuario[]>([]);
    onMounted(async () => {
      const resp = await fetch('http://localhost:3000/usuarios');
      if (resp.ok) {
        usuarios.value = await resp.json();
      }
    });
    return { usuarios };
  }
});
</script>
