<script setup>
  import { reactive } from 'vue';
  import { useUserStore } from '../stores/userStore.js';

  import { message } from 'ant-design-vue';

  const userStore = useUserStore();

  //const email = ref('');
  //const password = ref('');

  const formState = reactive({
    email: '',
    password: ''
  });

  const onFinish = async (values) => {
    console.log("Success:", values);
    const respuesta = await userStore.loginUser(formState.email, formState.password);
    if (!respuesta){
      return message.success('Bienvenido.');
    }

    switch(respuesta){
      case 'auth/user-not-found':
        message.error('No existe ese usuario');
        break;
      case 'auth/wrong-password':
        message.error('Error de contraseña');
        break;
      default:
        message.error('Algo falló desde Firebase');
        break;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmit = async() => {
    //Con 'ref'
    // if (!email.value || !password.value){
    //   return alert('Llena los campos');
    // }

    //Tenemos que hacer una promesa porque estamos esperando
    //que la promesa del "registerUser" se cumpla primero
    //antes de redireccionar a la "raiz"
    //
    //De tra forma no esperaría a que la promesa se cumpla y
    //mandaría a la "raiz"
    //
    //No olvidar que JS es síncrono

    //Con 'ref'
    //await userStore.loginUser(email.value, password.value);

    //Con 'reactive'
    //await userStore.loginUser(formState.email, formState.password);
  }
</script>

<template>
  <a-row>
    <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
      <a-form
        name="basicLogin"
        autocomplete="off"
        layout="vertical"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        :model="formState"
        >
          <a-form-item
            label="Ingresa un correo"
            name="email"
            :rules="[
              {
                required: true,
                type: 'email',
                message: 'Por favor escriba un email válido',
              },
            ]"
          >
            <a-input v-model:value="formState.email"></a-input>
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[
              {
                required: true,
                min: 6,
                message: 'Por favor escriba una contraseña de 6 carácteres',
              },
            ]"
          >
            <a-input-password v-model:value="formState.password"></a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button type="primary"
              html-type="submit"
              :loading="userStore.loadingUser"
            >Acceder</a-button>
          </a-form-item>

      </a-form>
    </a-col>
    <!-- <button @click="userStore.registerUser('Miguel')">Ingresar</button> -->

  </a-row>
</template>


<style lang="scss" scoped>

</style>