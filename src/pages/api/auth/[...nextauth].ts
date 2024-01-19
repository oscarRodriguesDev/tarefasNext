// Importa o módulo NextAuth para lidar com autenticação no Next.js.
import NextAuth from "next-auth";
// Importa o provedor de autenticação do Google para NextAuth.
import GoogleProvider from "next-auth/providers/google";

// Define as opções de autenticação, incluindo os provedores e a chave secreta JWT.
export const authOptions = {
  providers: [
    // Configura o provedor de autenticação do Google com as chaves do ambiente.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Define a chave secreta JWT a ser usada na geração e verificação de tokens.
  secret: process.env.JWT_SECRET as string,
};

// Exporta o middleware NextAuth configurado com as opções definidas.
export default NextAuth(authOptions);

/*
  Este arquivo está localizado na pasta "api/auth" e possui o nome "[...nextauth].ts".
  Ele configura o NextAuth para lidar com autenticação na aplicação Next.js.
  Utiliza o provedor de autenticação do Google e inclui as chaves de cliente e segredo do ambiente.
  Também define uma chave secreta JWT para a geração e verificação de tokens de autenticação.
*/
