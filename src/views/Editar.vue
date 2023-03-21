<script setup>
  import { onMounted, reactive } from 'vue';
  import { regExpUrl } from "../utils/regExpUrl";

  import { useDatabaseStore } from '../stores/databaseStore.js';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';

  const router = useRoute();
  const databaseStore = useDatabaseStore();

  const formState = reactive({
    url: ''
  });

  const onFinish = async(values) => {
    const respuesta = await databaseStore.updateUrl(router.params.id, formState.url);
    if (!respuesta){
      formState.url = '';
      return message.success('URL editada.');
    }

    switch(respuesta){
      //buscar errores de firebase
      default:
        message.error('Algo falló desde Firebase');
        break;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  onMounted(async() => {
    formState.url = await databaseStore.getUrl(router.params.id);
  });
</script>

<template>
  <h1>Editar id: {{ router.params.id }}</h1>
  <a-form
      name="editForm"
      autocomplete="off"
      layout="vertical"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :model="formState"
  >
    <a-form-item
      label="Ingresa una URL"
      name="url"
      :rules="[
        {
          required: true,
          whitespace: true,
          pattern: regExpUrl,
          message: 'Por favor escriba una URL válida.',
        },
      ]"
    >
      <a-input v-model:value="formState.url"></a-input>
    </a-form-item>

    <a-form-item>
      <a-button
          type="primary"
          html-type="submit"
          :loading="databaseStore.loading"
          :disabled="databaseStore.loading"
      >Editar</a-button>
    </a-form-item>

  </a-form>
</template>


<style lang="scss" scoped>

</style>