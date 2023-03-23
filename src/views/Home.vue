<script setup>
  import { useUserStore } from '../stores/userStore.js';
  import { useDatabaseStore } from '../stores/databaseStore.js';
  import { useRouter } from 'vue-router';

  import { message } from 'ant-design-vue';

  const router = useRouter();
  const userStore = useUserStore();
  const databaseStore = useDatabaseStore();

  databaseStore.getUrls();

  const confirm = async(id) => {
    const respuesta = await databaseStore.deleteUrl(id);
    if (!respuesta){
      message.success('Se eliminó con éxito!');
    }
    return respuesta.error(respuesta);

  }
  const cancel = () => {
    message.success('No se eliminó');
  }

  const copiarPortapapeles = async(id) => {
    if (!navigator.clipboard){
      return message.error("No se pudo copiar al portapapeles.");
    }

    const path = `${window.location.origin}/${id}`;

    const respuesta = await navigator.clipboard.writeText(path);
    if(respuesta){
      message.error('Hubo un error!');
    }else{
      message.success('Se copió con éxito!');
    }
  }

</script>

<template>
  <div>
    <h2 class="mt-2">{{ userStore.userData?.email }}</h2>

    <!--
      Como se puede ver no se está haciendo la importación del componente
      porque el plugin UNPLIGIN-VUE-COMPONENTS lo está haciendo por default
      VER vite/config.js
    -->
    <add-form>
    </add-form>

    <p v-if="databaseStore.loadingDoc">Loading docs...</p>

    <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width:100%; text-align:left">
      <a-card
        v-for="item of databaseStore.documents"
        :key="item.id"
        :title="item.short"
      >
        <template #extra>

          <a-space>
            <a-button @click="copiarPortapapeles(item.id)">Copiar</a-button>
            <a-popconfirm
              title="Eliminar?"
              ok-text="Sí"
              cancel-text="No"
              @confirm="confirm(item.id)"
              @cancel="cancel">
              <a-button
                danger
                :loading="databaseStore.loading"
                :disabled="databaseStore.loading"
              >Eliminar</a-button>
            </a-popconfirm>

            <a-button type="primary" @click="router.push(`/editar/${item.id}`)">Editar</a-button>
          </a-space>
        </template>
        <p>{{ item.name}} </p>
        <p>{{ item.user}} </p>
      </a-card>
    </a-space>

  </div>
</template>



<style scoped>
  .mb-2{
    margin-bottom: 2.1rem;
  }
  .mt-2{
    margin-top: 1rem;
  }
</style>