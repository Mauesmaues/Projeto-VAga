<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center pa-4">
      <v-icon class="mr-2" color="primary" size="28">mdi-format-list-bulleted</v-icon>
      <span class="text-h6 font-weight-bold">Usuários Cadastrados</span>
      <v-spacer></v-spacer>
      <v-chip color="primary" variant="flat">
        {{ usuariosFiltrados.length }} usuários
      </v-chip>
    </v-card-title>
    
    <v-divider></v-divider>

    <!-- Barra de Pesquisa e Filtros -->
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="pesquisa"
            density="comfortable"
            placeholder="Pesquisar por nome ou email..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="ordenacao"
            :items="opcoesOrdenacao"
            density="comfortable"
            label="Ordenar por data"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-sort"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <v-data-table
      :headers="headers"
      :items="usuariosFiltrados"
      :items-per-page="10"
      class="elevation-0"
      density="comfortable"
      item-value="id"
    >
      <template v-slot:item.nome="{ item }">
        <div class="d-flex align-center py-2">
          <v-icon class="mr-2" color="primary" size="20">mdi-account</v-icon>
          <span class="font-weight-medium">{{ item.nome }}</span>
        </div>
      </template>
      
      <template v-slot:item.email="{ item }">
        <span class="text-grey-darken-2">{{ item.email }}</span>
      </template>

      <template v-slot:item.tipo="{ item }">
        <v-chip 
          :color="getCorTipo(item.tipo)" 
          variant="flat" 
          size="small"
        >
          {{ formatarTipo(item.tipo) }}
        </v-chip>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span class="text-grey-darken-1">{{ formatarData(item.created_at) }}</span>
      </template>

      <template v-slot:item.acoes="{ item }">
        <div class="d-flex justify-center ga-2">
          <v-btn
            icon
            size="small"
            color="primary"
            variant="text"
            @click="$emit('editar', item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="error"
            variant="text"
            @click="$emit('deletar', item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
      
      <template v-slot:no-data>
        <div class="text-center pa-8">
          <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
          <div class="text-h6 mt-4 text-grey">Nenhum usuário cadastrado</div>
          <div class="text-caption text-grey-lighten-1">Adicione usuários usando o botão acima</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import type { UsuarioResponse } from '../api';

export default defineComponent({
  name: 'UsuarioTabela',
  props: {
    usuarios: {
      type: Array as PropType<UsuarioResponse[]>,
      required: true,
    },
  },
  emits: ['editar', 'deletar'],
  setup(props) {
    const pesquisa = ref('');
    const ordenacao = ref('recente');

    const opcoesOrdenacao = [
      { title: 'Mais Recentes', value: 'recente' },
      { title: 'Mais Antigos', value: 'antigo' },
    ];

    const headers = computed(() => [
      { 
        title: 'Nome', 
        key: 'nome', 
        sortable: true,
        width: '25%'
      },
      { 
        title: 'Email', 
        key: 'email', 
        sortable: true,
        width: '25%'
      },
      { 
        title: 'Tipo', 
        key: 'tipo', 
        sortable: true,
        align: 'center' as const,
        width: '15%'
      },
      { 
        title: 'Data de Cadastro', 
        key: 'created_at', 
        sortable: true,
        align: 'center' as const,
        width: '20%'
      },
      { 
        title: 'Ações', 
        key: 'acoes', 
        sortable: false,
        align: 'center' as const,
        width: '15%'
      },
    ]);

    const usuariosFiltrados = computed(() => {
      let resultado = [...props.usuarios];

      // Filtrar por pesquisa
      if (pesquisa.value) {
        const termo = pesquisa.value.toLowerCase();
        resultado = resultado.filter(u => 
          u.nome.toLowerCase().includes(termo) || 
          u.email.toLowerCase().includes(termo)
        );
      }

      // Ordenar por data
      resultado.sort((a, b) => {
        const dataA = new Date(a.created_at || 0).getTime();
        const dataB = new Date(b.created_at || 0).getTime();
        return ordenacao.value === 'recente' ? dataB - dataA : dataA - dataB;
      });

      return resultado;
    });

    function formatarTipo(tipo: string): string {
      const tipos: Record<string, string> = {
        'admin': 'Administrador',
        'operador': 'Operador',
      };
      return tipos[tipo] || tipo;
    }

    function getCorTipo(tipo: string): string {
      const cores: Record<string, string> = {
        'admin': 'error',
        'operador': 'primary',
      };
      return cores[tipo] || 'grey';
    }

    function formatarData(data: string | undefined): string {
      if (!data) return 'N/A';
      try {
        return new Date(data).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'N/A';
      }
    }
    
    return { 
      headers, 
      pesquisa, 
      ordenacao,
      opcoesOrdenacao,
      usuariosFiltrados,
      formatarTipo,
      getCorTipo,
      formatarData,
    };
  },
});
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}

:deep(.v-data-table-header) {
  background-color: rgba(0, 0, 0, 0.02);
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(25, 118, 210, 0.05) !important;
}
</style>
