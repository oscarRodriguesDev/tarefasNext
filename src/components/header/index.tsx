import styles from "./styles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas <span>+</span>
            </h1>
          </Link>
          <Link href="/dashboards" className={styles.link}>
            Meu Painel
          </Link>
        </nav>
        {/*  <button className={styles.loginButton}>Acessar</button> */}
        {status === "loading" ? (
          <></>
        ) : session ? (

          <button className={styles.loginButton} onClick={()=>{signOut()}}>Ola {session?.user?.name}</button>
        ):(
            <button className={styles.loginButton} onClick={()=>{signIn()}}>Acessar</button> 
        )
        
        }
      </section>
    </header>
  );
};

export default Header;
