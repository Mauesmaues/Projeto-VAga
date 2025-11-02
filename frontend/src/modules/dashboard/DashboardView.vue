<template>
  <div style="display: flex; height: 100vh; width: 100vw; overflow: hidden; position: relative;">
    <!-- Sidebar fixa -->
    <div style="width: 260px; flex-shrink: 0; height: 100vh; position: relative; z-index: 100;">
      <DashboardSidebar />
    </div>
    
    <!-- Conteúdo principal -->
    <div style="flex: 1; width: calc(100vw - 260px); height: 100vh; overflow-y: auto; background: #181818; box-sizing: border-box;">
      <div style="padding: 24px; width: 100%; box-sizing: border-box;">
        <router-view />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import DashboardSidebar from './components/DashboardSidebar.vue';
export default defineComponent({
  name: 'DashboardModule',
  components: {
    DashboardSidebar
  }
});
</script>

<style scoped>
/* Reset global */
* {
  box-sizing: border-box;
}
</style>
