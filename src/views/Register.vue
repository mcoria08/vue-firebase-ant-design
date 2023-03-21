<script setup>
  import { reactive } from 'vue';
  import { useUserStore } from '../stores/userStore.js';

  import { message } from 'ant-design-vue';

  const userStore = useUserStore();

  // const email = ref('');
  // const password = ref('');

  const formState = reactive({
      password: "",
      repassword: "",
      email: "",
  });

  const validateRePass = async (_rule, value) => {
      if (value === "") {
          return Promise.reject("Por favor repita contraseña");
      }
      if (value !== formState.password) {
          return Promise.reject("No coinciden las contraseñas");
      }
      Promise.resolve();
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    const respuesta = await userStore.registerUser(values.email, values.password);
    if (!respuesta){
      return message.success('Revisa tu correo y verifícalo.');
    }

    switch(respuesta){
      case 'auth/email-already-in-use':
        message.error('Ese usuario ya está registrado.');
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
    // console.log(email.value);
    // console.log(password.value);
    // if (!email.value || !password.value){
    //   return alert('Llena los campos');
    // }
    // console.log('procesando formulario');

    //Tenemos que hacer una promesa porque estamos esperando
    //que la promesa del "registerUser" se cumpla primero
    //antes de redireccionar a la "raiz"
    //
    //De tra forma no esperaría a que la promesa se cumpla y
    //mandaría a la "raiz"
    //
    //No olvidar que JS es síncrono
    //Con 'ref'
    //await userStore.registerUser(email.value, password.value);

    //Con 'reactive'
    //await userStore.registerUser(formState.email, formState.password);

  }
</script>

<template>
  <a-row>
    <a-col
      :xs="{ span: 24 }"
      :sm="{ span: 18, offset: 3 }"
      :lg="{ span: 12, offset: 6 }"
    >
    <!-- <button @click="userStore.registerUser('Miguel')">Ingresar</button> -->
      <!-- <form @submit.prevent="handleSubmit">
        <input type="email" placeholder="Correo" v-model.trim="email">
        <input type="password" placeholder="Password" v-model.trim="password">
        <button type="submit" :disabled="userStore.loadingUser">Crear</button>
      </form> -->
      <a-form
                :model="formState"
                @finishFailed="onFinishFailed"
                @finish="onFinish"
                name="basicTwo"
                layout="vertical"
                autocomplete="off"
            >
                <a-form-item
                    label="Email"
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
                            message:
                                'Por favor escriba una contraseña de 6 carácteres',
                        },
                    ]"
                >
                    <a-input-password
                        v-model:value="formState.password"
                    ></a-input-password>
                </a-form-item>
                <a-form-item
                    label="Repita Password"
                    name="repassword"
                    :rules="{ validator: validateRePass }"
                >
                    <a-input-password
                        v-model:value="formState.repassword"
                    ></a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-button
                      type="primary"
                      html-type="submit"
                      :loading="userStore.loadingUser"
                    >Acceder</a-button
                    >
                </a-form-item>
            </a-form>
    </a-col>
  </a-row>
</template>


<style lang="scss" scoped>

</style>