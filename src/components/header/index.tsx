// Importa as classes de estilo do módulo CSS local.
import styles from "./styles.module.css";
// Importa hooks e funções relacionadas à autenticação do Next.js.
import { useSession, signIn, signOut } from "next-auth/react";
// Importa o componente de Link do Next.js para navegação entre páginas.
import Link from "next/link";

// Declaração do componente funcional Header.
const Header = () => {
  // Utiliza o hook useSession para obter informações sobre a sessão do usuário.
  const { data: session, status } = useSession();

  return (
    // Elemento de cabeçalho com a classe de estilo "header".
    <header className={styles.header}>
      {/* Seção principal do cabeçalho com a classe de estilo "content". */}
      <section className={styles.content}>
        {/* Navegação com a classe de estilo "nav". */}
        <nav className={styles.nav}>
          {/* Link para a página inicial com o título e estilo correspondente. */}
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas <span>+</span>
            </h1>
          </Link>

          {/* Condicionalmente renderiza o link para o painel do usuário se a sessão estiver ativa. */}
          {session?.user && (
            <Link href="/dashboards" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>

        {/* Condicionalmente renderiza o botão de login ou o nome do usuário com um botão de logout. */}
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name} sair?
          </button>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn()}>
            Acessar
          </button>
        )}
      </section>
    </header>
  );
};

// Exporta o componente Header.
export default Header;
/* Este componente Header é responsável por exibir o cabeçalho da aplicação. Ele inclui
 um título, links de navegação e um botão de login/logout, dependendo do estado da sessão 
 do usuário. O uso de estilos modulares ajuda a manter o código mais organizado e reutilizável*/
