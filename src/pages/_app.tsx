
// Importa o arquivo de estilos globais para a aplicação.
import '@/styles/globals.css';

// Importa o tipo AppProps e o componente App do pacote 'next/app'.
import type { AppProps } from 'next/app';

// Importa o componente Header de um caminho relativo definido pelo alias '@'.
import Header from '@/components/header';

// Importa o SessionProvider do pacote 'next-auth/react'.
import { SessionProvider } from 'next-auth/react';

// Define a função padrão (componente) App, que recebe as props do aplicativo.
export default function App({ Component, pageProps }: AppProps) {
  // Retorna o JSX que compõe a estrutura do aplicativo.
  return (
    // Inicia o SessionProvider com a sessão fornecida pelas props.
    <SessionProvider session={pageProps.session}>
      {/* Renderiza o componente Header. */}
      <Header />

      {/* Renderiza o componente principal passando as props da página. */}
      <Component {...pageProps} />

    </SessionProvider>
  );
}


