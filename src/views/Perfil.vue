<script setup>
  import { ref } from 'vue';
  import { useUserStore } from '../stores/userStore.js';
  import { message } from 'ant-design-vue';

  const userStore = useUserStore();

  const fileList = ref([]);

  const beforeUpload = () => {
    fileList.value = [...fileList.value, file];
    return false;
  }

  const handleRemove = file => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const handleChange = (info) => {
    //validarlos tipos de imagenes
    if (info.file.status !== 'uploading') {
      const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Solo puedes subir imágenes JPG o PNG!');
        handleRemove(info.file);
        return;
      }
      const isLt2M = info.file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Máximo 2MB!');
        handleRemove(info.file);
        return;
      }
    }

    let resFileList = [...info.fileList];
    resFileList = resFileList.slice(-1);
    resFileList = resFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    fileList.value = resFileList;
  }

  const onFinish = async() => {
    const error = await userStore.updateUser(userStore.userData.displayName, fileList.value[0]);

    if(!error){
      return message.success('Se actualizó información del perfil.');
    }
    message.error('Ocurrió un error al actualizar la información del perfil.');
  }
</script>

<template>
  <h2 class="mt-2">Perfil del Usuario</h2>
  <div class="mb-2">
    <a-avatar :src="userStore.userData.photoURL" size="large"></a-avatar>
  </div>
  <a-row>

      <a-form
        name="basicPerfil"
        autocomplete="off"
        layout="vertical"
        @finish="onFinish"
        :model="userStore.userData"
        >
          <a-form-item
            label="Tu correo"
            name="email"
            :rules="[
              {
                required: true,
                type: 'email',
                message: 'Por favor escriba un email válido',
              },
            ]"
          >
            <a-input disabled v-model:value="userStore.userData.email"></a-input>
          </a-form-item>

          <a-form-item
            label="Ingresa un nickname"
            name="displayName"
            :rules="[
              {
                required: true,
                whitespace: true,
                message: 'Por favor ingresa un nick name',
              },
            ]"
          >
            <a-input v-model:value="userStore.userData.displayName"></a-input>
          </a-form-item>


          <a-form-item>
            <a-upload
              v-model:file-list="fileList"
              list-type="picture"
              :before-upload="beforeUpload"
              :max-count="1"
              @change="handleChange"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Subir Foto Perfil
              </a-button>
            </a-upload>
          </a-form-item>

          <a-form-item>
            <a-button type="primary"
              html-type="submit"
              :dsabled="userStore.loadingUser"
              :loading="userStore.loadingUser"
            >Actualizar Información</a-button>
          </a-form-item>

      </a-form>

    <!-- <button @click="userStore.registerUser('Miguel')">Ingresar</button> -->

  </a-row>
</template>


<style scoped>
  .mb-2{
    margin-bottom: 2.1rem;
  }
  .mt-2{
    margin-top: 1rem;
  }
</style>