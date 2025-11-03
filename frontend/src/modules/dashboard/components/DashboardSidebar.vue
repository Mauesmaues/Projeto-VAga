

<template>
  <div style="height: 100%; display: flex; flex-direction: column;">

    <div style="padding: 16px; display: flex; align-items: center; flex-shrink: 0;">
      <v-icon color="white" size="32">mdi-cash-register</v-icon>
      <div style="margin-left: 12px;">
        <div style="font-weight: bold; font-size: 18px; color: white;">ANB Farma</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">{{ nomeUsuario }}</div>
      </div>
    </div>
    
    <v-divider style="border-color: rgba(255,255,255,0.2); flex-shrink: 0;"></v-divider>
    

    <div style="flex: 1; overflow-y: auto;">
      <v-list nav density="comfortable" style="background: transparent;" class="text-white">
        <v-list-item 
          to="/dashboard" 
          exact
          prepend-icon="mdi-view-dashboard" 
          title="Dashboard"
          @click="fecharDrawer"
          color="white"
        />
        <v-list-item 
          to="/dashboard/produtos" 
          prepend-icon="mdi-package-variant" 
          title="Produtos"
          @click="fecharDrawer"
          color="white"
        />
        <v-list-item 
          to="/dashboard/historico-estoque" 
          prepend-icon="mdi-history" 
          title="Histórico de Estoque"
          @click="fecharDrawer"
          color="white"
        />
        <v-list-item 
          v-if="canManageUsers"
          to="/dashboard/usuarios" 
          prepend-icon="mdi-account" 
          title="Usuários"
          @click="fecharDrawer"
          color="white"
        />
      </v-list>
    </div>
    

    <div style="flex-shrink: 0;">
      <v-divider style="border-color: rgba(255,255,255,0.2);"></v-divider>
      
      <v-list nav density="comfortable" style="background: transparent;" class="text-white">
        <v-list-item 
          @click="dialogSair = true" 
          prepend-icon="mdi-logout" 
          title="Sair"
          color="white"
        />
      </v-list>
    </div>


    <v-dialog v-model="dialogSair" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 d-flex align-center pa-4">
          <v-icon class="mr-2" color="warning">mdi-logout</v-icon>
          Confirmar Saída
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          Deseja realmente sair do sistema?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogSair = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="elevated" @click="confirmarLogout">
            Sair
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { AuthService } from '../../../services/authService';
import { PermissionService } from '../../../services/permissionService';

export default defineComponent({
  name: 'DashboardSidebar',
  emits: ['close-drawer'],
  setup(props, { emit }) {
    const dialogSair = ref(false);
    const { mdAndUp } = useDisplay();

    const nomeUsuario = computed(() => {
      const user = AuthService.getUser();
      return user?.nome || 'Usuário';
    });

    const canManageUsers = computed(() => PermissionService.canManageUsers());

    const confirmarLogout = () => {
      AuthService.logout();
      dialogSair.value = false;
    };

    const fecharDrawer = () => {

      if (!mdAndUp.value) {
        emit('close-drawer');
      }
    };

    return { nomeUsuario, dialogSair, confirmarLogout, fecharDrawer, canManageUsers };
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
