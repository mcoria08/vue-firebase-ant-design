import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import router from '../router';

//Importando la otra tienda para acceder al objeto DOCUMENTS
import { useDatabaseStore } from './databaseStore';

export const useUserStore = defineStore('userStore', {

  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),

  actions: {
    async registerUser(email, password){
      this.loadingUser = true;
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        this.userData = { email: user.email, uid: user.uid }
        router.push('/');
      }catch(error){
        console.log(error);
        return error.code;
      }finally{
        this.loadingUser = false;
      }
    },

    async loginUser(email, password){
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        this.userData = { email: user.email, uid: user.uid }
        router.push('/');
      } catch(error) {
        console.log(error);
        return error.code;
      }finally{
        this.loadingUser = false;
      }
    },

    async logoutUser(){
      const databaseStore = useDatabaseStore();

      //Reiniciando el almacen para evitar que se dupliquen los elementos
      databaseStore.$reset();

      try {
        await signOut(auth);
        this.userData = null;
        router.push('/login');
      }catch(error){
        console.log(error);
      }
    },

    currentUser(){
      return new Promise((resolve, reject) => {
          const unsuscribe = onAuthStateChanged(auth, (user) => {
            if(user){
              this.userData = { email: user.email, uid: user.uid };
            }else{
              this.userData = null;
              const databaseStore = useDatabaseStore();
              //Reiniciando el almacen para evitar que se dupliquen los elementos
              databaseStore.$reset();
            }
            //Esto hará un returne del usuario exista o no
            resolve(user)
          }, e => reject(e));

          //Según la documentación, la función onAuthStateChanged() devuelve
          //la función de cancelación de suscripción para el observador
          unsuscribe();
      });
    }
  }

});