import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged,
         updateProfile} from 'firebase/auth';
import { db, auth, storage } from '../firebaseConfig.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import router from '../router';

//Importando la otra tienda para acceder al objeto DOCUMENTS
import { useDatabaseStore } from './databaseStore';
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';

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


    async updateUser(displayName, imagen){
      this.loadingUser = true;
      try {
        if(imagen){
          console.log(imagen);
          const storageRef = ref(storage, `perfiles/${this.userData.uid}`);

          //Uploading the image
          await uploadBytes(storageRef, imagen.originFileObj);

          //Getting the image URL
          const photoURL = await getDownloadURL(storageRef);

          //Updating the record of the user -
          //OJO: ESTO ES EN EL STORE
          await updateProfile(auth.currentUser, { photoURL });
        }

        await updateProfile(auth.currentUser, { displayName });
        this.setUser(auth.currentUser);
      } catch(error){
        console.log(error);
        return error.code;
      }finally{
        this.loadingUser = false;
      }
    },

    async setUser(user){
      //Para obtener la información del usuario
      //Si no existe información previa del usuario se crea un registro
      //Si ya existe un registor se actualiza entonces
      try {
        const docRef = doc(db, 'users', user.uid);

        this.userData = {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        };

        await setDoc(docRef, this.userData);

      } catch(error) {
        return error.code;
      }finally{
      }
    },

    async loginUser(email, password){
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        await this.setUser(user);

        router.push('/');
      } catch(error) {
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
        router.push('/login');
      }catch(error){
        console.log(error);
      }
    },

    currentUser(){
      return new Promise((resolve, reject) => {
          const unsuscribe = onAuthStateChanged(auth, async(user) => {
            if(user){
              console.log(user);
              //await this.setUser(user);
              this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
              };
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