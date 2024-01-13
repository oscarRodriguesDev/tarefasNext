import styles from "./styles.module.css";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Textarea from '../../components/textarea'

const Dashboards = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title> Meu Painel</title>
      </Head>
     <main className={styles.main}>
        <section className={styles.content}>
            <div className={styles.contentForm}>
                <h1 className="styles.title">Qual sua Tarefa</h1>
                <Textarea
                placeholder="Digite sua Tarefa..."
                />
                <div className={styles.checkBoxArea}>

                    <input type="checkbox"  className={styles.checkbox}/>
                    <label>Deixar tarefa publica</label>
                </div>
                <button className={styles.button} type='submit'>Registrar</button>
            </div>
        </section>

     </main>
    </div>
  );
};

export default Dashboards;

/* o metodo abaixo permite que seja possivel privar rotas */
export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const session = await getSession( {req} );

  if (!session?.user) {
    //redireciona para a pagina home
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
