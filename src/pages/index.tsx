import {db}from '../services/firebaseConnection'
import {
  collection,
  getDocs
} from 'firebase/firestore'
import {GetStaticProps} from 'next'
import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.css'
import Image from 'next/image'
//vamos importar a imagem
import Hero from '../../public/assets/hero.png'

const inter = Inter({ subsets: ['latin'] })

interface HomeProps{
  posts: number,
  comments:number,

}

export default function Home({posts,comments}:HomeProps) {
  return (
    <>
    <div className= {styles.Container}>
    <main className={styles.main}>
      <div className={styles.logoContent}>
        <Image
        className={styles.hero}
        alt='logo tarefas'
        src={Hero}
        priority
        />
      </div>
      <h1 className={styles.title}>Sistema feito para você organizar<br/>
       seus estudos e tarefas</h1>

       <div className={styles.infoContent}>
          <section className={styles.box}>
          <span>{posts} Posts</span>
          </section>

          <section className={styles.box}>
          <span>{comments} Comentarios</span>
          </section>
       </div>
    </main>
    </div>
    </>
  )
}export const getStaticProps: GetStaticProps = async () => {
  const commentsRef = collection(db, 'comments');
  const commentsSnapshot = await getDocs(commentsRef);

  const postsRef = collection(db, 'tarefas');
  const postsSnapshot = await getDocs(postsRef);

  return {
    props: {
      posts: postsSnapshot.size,
      comments: commentsSnapshot.size,
    },
    revalidate:60,
  };
};

