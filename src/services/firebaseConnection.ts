
/* Apos criar um projeto no firebase e associar um aplicativo a ele, instalar o firebase para 
que ele seja reconhecido */
import {initializeApp} from 'firebase/app'
//no caso vamos utilizar o firebase/filestore
/* importa as funcionalidades que iremos usar do firebase*/
// Importa a função getFirestore do módulo 'firebase/firestore'.
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase com as credenciais necessárias para acesso ao Firestore.
const firebaseConfig = {
  apiKey: "AIzaSyBwR2GB_O-xFtNgK2zJwbNTfx0Dt-HW68Y",
  authDomain: "teste-c9074.firebaseapp.com",
  databaseURL: "https://teste-c9074-default-rtdb.firebaseio.com",
  projectId: "teste-c9074",
  storageBucket: "teste-c9074.appspot.com",
  messagingSenderId: "672779893435",
  appId: "1:672779893435:web:0e9b009f691dfd1f2e479e"
};

// Inicializa o Firebase com as configurações fornecidas.
const firebaseApp = initializeApp(firebaseConfig);

// Obtém a instância do Firestore utilizando a função getFirestore.
const db = getFirestore();

// Exporta a instância do Firestore para ser utilizada em outros arquivos.
export { db };

/*
  Este arquivo chamado "services" é responsável por configurar e inicializar o Firebase,
  estabelecendo a conexão com o Firestore (banco de dados NoSQL em tempo real).
  Através da exportação da instância do Firestore (db), outros módulos e componentes
  da aplicação podem utilizá-lo para interagir com o banco de dados, realizando operações
  como leitura, escrita e consulta de dados.
*/
