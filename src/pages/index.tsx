// Importa a instância do banco de dados 'db' do arquivo de conexão com o Firebase
import { db } from '../services/firebaseConnection';

// Importa funções específicas do Firestore do pacote 'firebase/firestore'
import {
  collection,
  getDocs
} from 'firebase/firestore';

// Importa o tipo 'GetStaticProps' do Next.js, usado para gerar props estáticas para páginas estáticas
import { GetStaticProps } from 'next';

// Importa o tipo 'Inter' do Next.js para carregar fontes do Google
import { Inter } from 'next/font/google';

// Importa os estilos CSS do módulo 'home.module.css'
//alteraççao do nome do arquivo de estilos
import styles from '@/styles/home.module.css';

// Importa o componente de imagem do Next.js
import Image from 'next/image';

// Importa a imagem 'hero.png' localizada em '../../public/assets/'
import Hero from '../../public/assets/hero.png';


// Criação de uma constante 'inter' que recebe o resultado da chamada à função 'Inter'
// A função 'Inter' é chamada com um objeto de configuração que possui um array 'subsets' contendo a string 'latin'
const inter = Inter({ subsets: ['latin'] })

// Definição de uma interface chamada 'HomeProps'
// Esta interface possui duas propriedades: 'posts' do tipo number e 'comments' do tipo number
interface HomeProps {
  posts: number,
  comments: number,
}
// Este é um componente funcional React que representa a página inicial da aplicação.
// Ele recebe as propriedades "posts" e "comments" através do objeto "HomeProps".
export default function Home({ posts, comments }: HomeProps) {
  return (
    <>
      {/* O conteúdo principal da página é envolto por um div com a classe "Container". */}
      <div className={styles.Container}>
        <main className={styles.main}>
          {/* Uma div contendo a logo da aplicação, utilizando a classe "logoContent". */}
          <div className={styles.logoContent}>
            {/* Componente de imagem do Next.js, exibindo a imagem com a classe "hero". */}
            <Image
              className={styles.hero}
              alt='logo tarefas'
              src={Hero}
              priority
            />
          </div>
          {/* Título da página informando que o sistema é feito para organizar estudos e tarefas. */}
          <h1 className={styles.title}>Sistema feito para você organizar<br/>seus estudos e tarefas</h1>

          {/* Seção que exibe informações sobre o número de posts e comentários usando as classes de estilo. */}
          <div className={styles.infoContent}>
            {/* Seção para exibir o número de posts. */}
            <section className={styles.box}>
              <span>{posts} Posts</span>
            </section>

            {/* Seção para exibir o número de comentários. */}
            <section className={styles.box}>
              <span>{comments} Comentarios</span>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

// Função assíncrona que é executada no momento da construção estática da página.
export const getStaticProps: GetStaticProps = async () => {
  // Referência à coleção "comments" no banco de dados.
  const commentsRef = collection(db, 'comments');
  // Obtém um snapshot da coleção de comentários.
  const commentsSnapshot = await getDocs(commentsRef);

  // Referência à coleção "tarefas" no banco de dados.
  const postsRef = collection(db, 'tarefas');
  // Obtém um snapshot da coleção de tarefas.
  const postsSnapshot = await getDocs(postsRef);

  // Retorna um objeto contendo as propriedades "posts" e "comments" para serem utilizadas no componente.
  return {
    props: {
      posts: postsSnapshot.size,
      comments: commentsSnapshot.size,
    },
    // Período de revalidação em segundos, define quanto tempo a página pode ser servida a partir do cache.
    revalidate: 60,
  };
};
