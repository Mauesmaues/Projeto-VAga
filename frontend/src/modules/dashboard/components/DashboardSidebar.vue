


<template>
  <div style="width: 260px; height: 100vh; background: #212121; border-right: 1px solid #222; display: flex; flex-direction: column; overflow-y: auto;">
    <!-- Header -->
    <div style="padding: 16px; display: flex; align-items: center;">
      <v-icon color="primary" size="32">mdi-cash-register</v-icon>
      <div style="margin-left: 12px;">
        <div style="font-weight: bold; font-size: 18px; color: white;">ANB Farma</div>
        <div style="font-size: 12px; color: #aaa;">{{ nomeUsuario }}</div>
      </div>
    </div>
    
    <v-divider style="border-color: #333;"></v-divider>
    
    <!-- Menu -->
    <v-list nav density="comfortable" style="flex: 1; background: transparent;">
      <v-list-item 
        to="/dashboard" 
        prepend-icon="mdi-view-dashboard" 
        title="Dashboard"
      />
      <v-list-item 
        to="/dashboard/produtos" 
        prepend-icon="mdi-package-variant" 
        title="Produtos"
      />
      <v-list-item 
        to="/dashboard/historico-estoque" 
        prepend-icon="mdi-history" 
        title="Histórico de Estoque"
      />
      <v-list-item 
        to="/dashboard/usuarios" 
        prepend-icon="mdi-account" 
        title="Usuários"
      />
    </v-list>
    
    <v-divider style="border-color: #333;"></v-divider>
    
    <!-- Logout -->
    <v-list nav density="comfortable" style="background: transparent;">
      <v-list-item 
        @click="logout" 
        prepend-icon="mdi-logout" 
        title="Sair"
      />
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { AuthService } from '../../../services/authService';

export default defineComponent({
  name: 'DashboardSidebar',
  setup() {
    const nomeUsuario = computed(() => {
      const user = AuthService.getUser();
      return user?.nome || 'Usuário';
    });

    const logout = () => {
      if (confirm('Deseja realmente sair?')) {
        AuthService.logout();
      }
    };

    return { nomeUsuario, logout };
  }
});
</script>

<style scoped>
:deep(.v-list-item) {
  color: white !important;
}

:deep(.v-list-item--active) {
  background-color: rgba(25, 118, 210, 0.15) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
