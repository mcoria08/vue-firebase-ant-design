import { defineStore } from 'pinia';
import { db, auth } from '../firebaseConfig';
import { setDoc, doc, deleteDoc, query, collection, where, getDoc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
import { nanoid } from 'nanoid'
import router from '../router/index';

export const useDatabaseStore = defineStore('databaseStore', {
  state: () => {
    return {
      documents: [],
      loadingDoc: false,
      loading: false
    }
  },

  actions: {
    async getUrls(){
      if(this.documents.length !== 0){
        return
      }
      this.loadingDoc = true;
      try{
        const q = query(collection(db, "urls"),
                    where("user", "==", auth.currentUser.uid)
                    );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.documents.push({
            id: doc.id,
            ...doc.data()
          });
        });

      }catch(error){
        console.log(error);
      }finally{
        this.loadingDoc = false;
      }
    },

    async addUrl(name){
      this.loading = true;
      try {
        const objetoDoc = {
          name: name,
          short: nanoid(6),
          user: auth.currentUser.uid
        };
        await setDoc(doc(db, 'urls', objetoDoc.short), objetoDoc);
        this.documents.push({
            id: objetoDoc.short,
            ...objetoDoc
          });
      }catch(error){
        console.log(error);
        return error.code;
      }finally{
        this.loading = false;
      }
    },

    async getUrl(id){
      try {
          const docRef = doc(db, 'urls', id);
          const docSnap = await getDoc(docRef);

          if(!docSnap.exists()){
            //throw new Error('No existe el documento');
            return false;
          }

          /*if(docSnap.data().user !== auth.currentUser.uid){
            throw new Error('No puedes eliminar un documento que no te pertenece');
          }*/

          return docSnap.data().name;

      }catch(error){
        console.log(error);
        return false;
      }finally{
      }
    },

    async deleteUrl(id){
      this.loading = true;
      try{
          const docRef = doc(db, 'urls', id);

          //Para validar que el usuario solo pueda eliminar sus propios documentos
          const docSnap = await getDoc(docRef);
          if(!docSnap.exists()){
            throw new Error('No existe el documento');
          }

          if(docSnap.data().user !== auth.currentUser.uid){
            throw new Error('No puedes eliminar un documento que no te pertenece');
          }
          await deleteDoc(docRef);
          this.documents = this.documents.filter(item => item.id !== id)
      }catch(error){
        //console.log(error);
        return error.message;
      }finally{
        this.loading = false;
      }
    },

    async updateUrl(id, name){
     this.loading = true;
      try{
        const docRef = doc(db, 'urls', id);

        //Para validar que el usuario solo pueda eliminar sus propios documentos
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()){
          throw new Error('No existe el documento');
        }

        if(docSnap.data().user !== auth.currentUser.uid){
          throw new Error('No puedes eliminar un documento que no te pertenece');
        }

        await updateDoc(docRef, {
          name: name
        });

        this.documents = this.documents.map(item => item.id === id ? ({...item, name: name}) : item);

        router.push('/')

      }catch(error){
        //console.log(error);
        return error.message;
      }finally{
        this.loading = false;
      }
    }
  }
});