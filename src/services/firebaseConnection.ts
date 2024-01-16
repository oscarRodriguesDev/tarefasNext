
/* Apos criar um projeto no firebase e associar um aplicativo a ele, instalar o firebase para 
que ele seja reconhecido */
import {initializeApp} from 'firebase/app'
//no caso vamos utilizar o firebase/filestore
/* importa as funcionalidades que iremos usar do firebase*/
import{getFirestore }from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBwR2GB_O-xFtNgK2zJwbNTfx0Dt-HW68Y",
  authDomain: "teste-c9074.firebaseapp.com",
  databaseURL: "https://teste-c9074-default-rtdb.firebaseio.com",
  projectId: "teste-c9074",
  storageBucket: "teste-c9074.appspot.com",
  messagingSenderId: "672779893435",
  appId: "1:672779893435:web:0e9b009f691dfd1f2e479e"
};

// Initialize Firebase e o banco de dados firestore
const firebaseApp = initializeApp(firebaseConfig);
const db =  getFirestore()
export {db}
