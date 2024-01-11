
import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.css'
import Image from 'next/image'
//vamos importar a imagem
import Hero from '../../public/assets/hero.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <span>12posts</span>
          </section>

          <section className={styles.box}>
          <span>90 comentarios</span>
          </section>
       </div>
    </main>
    </div>
    </>
  )
}
