// Importa o arquivo de estilos do módulo CSS local.
import styles from "./styles.module.css";
// Importa o componente Head do Next.js para gerenciar o conteúdo do cabeçalho HTML.
import Head from "next/head";
// Importa a função GetServerSideProps do Next.js para obter dados durante o tempo de execução do servidor.
import { GetServerSideProps } from "next";
// Importa a função getSession do pacote next-auth/react para obter informações da sessão do usuário.
import { getSession } from "next-auth/react";
// Importa o componente Textarea personalizado.
import Textarea from "../../components/textarea";
// Importa ícones específicos do React para compartilhar e excluir tarefas.
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
// Importa hooks e funções do React para manipulação de estado e efeitos colaterais.
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
// Importa o componente Link do Next.js para criar links internos na aplicação.
import Link from "next/link";
// Importa o banco de dados Firebase e funções de firestore para interagir com a base de dados.
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Interface para configurar a tipagem do usuário.
interface HomeProps {
  user: {
    email: string;
  };
}

// Interface para configurar a tipagem das propriedades de uma tarefa.
interface taskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

// Componente funcional que representa o painel do usuário.
const Dashboards = ({ user }: HomeProps) => {
  // Estado para armazenar o texto da nova tarefa.
  const [input, setInput] = useState("");
  // Estado para armazenar a lista de tarefas.
  const [tasks, setTasks] = useState<taskProps[]>([]);
  // Estado para armazenar se a tarefa será pública ou não.
  const [publicTask, setPublicTask] = useState(false);

  // Função para capturar se o usuário marcou a tarefa como pública ou não.
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.checked);
    setPublicTask(event.target.checked);
  }

  // Efeito colateral que carrega as tarefas do usuário ao montar o componente.
  useEffect(() => {
    async function loadingTarefas() {
      // Referência à coleção "tarefas" no banco de dados.
      const tarefasRef = collection(db, "tarefas");
      // Query que busca as tarefas ordenadas por data de criação, filtrando pelo usuário atual.
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );
      // Adiciona um observador para atualizar a lista de tarefas em tempo real.
      onSnapshot(q, (snapshot) => {
        let lista = [] as taskProps[];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(lista);
      });
    }
    loadingTarefas();
  }, [user?.email]);

  // Função para registrar uma nova tarefa.
  async function handleRegisterTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (input === "") return;
    try {
      // Adiciona uma nova tarefa à coleção "tarefas" no banco de dados.
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });
      setInput("");
    } catch (erro) {
      console.log(erro);
    }
  }

  // Função para compartilhar o link de uma tarefa.
  async function handleShare(id: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/task/${id}`;
    try {
      // Copia o URL para a área de transferência do usuário.
      await navigator.clipboard.writeText(url);
      alert("Link da tarefa copidado para área de transferência");
    } catch (error) {
      console.error('Erro ao copiar para a área de transferência:', error);
      alert('Erro ao copiar para a área de transferência');
    }
  }

  // Função para excluir uma tarefa.
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id);
    const confirmation = window.confirm("Tem certeza que deseja excluir essa tarefa?");
    if (confirmation) {
      // Exclui a tarefa do banco de dados.
      await deleteDoc(docRef);
    } else {
      alert('A tarefa foi mantida');
    }
  }

  return (
    <div className={styles.container}>
      {/* Configura o título da página no cabeçalho HTML. */}
      <Head>
        <title>Meu Painel</title>
      </Head>
      <main className={styles.main}>
        {/* Seção superior da página, onde as tarefas são criadas. */}
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua Tarefa</h1>
            {/* Formulário para registrar novas tarefas. */}
            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite sua Tarefa..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkBoxArea}>
                {/* Checkbox para definir se a tarefa será pública ou não. */}
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa publica</label>
              </div>
              {/* Botão para registrar a tarefa. */}
              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>

        {/* Seção inferior da página, onde as tarefas são exibidas. */}
        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>
          {/* Mapeia a lista de tarefas e renderiza cada uma como um artigo. */}
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {/* Se a tarefa for pública, exibe a tag "Publica" e o botão de compartilhar. */}
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>Publica</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {/* Se a tarefa for pública, cria um link para a página específica da tarefa. */}
                {item.public ? (
                  <Link href={`/task/${item.id}`}>{item.tarefa}</Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}
                {/* Botão para excluir a tarefa. */}
                <button className={styles.trashButton} onClick={() => handleDeleteTask(item.id)}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

// Exporta o componente Dashboards como padrão.
export default Dashboards;

/* Método para obter propriedades do servidor, utilizado para verificar a sessão do usuário. */
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Obtém a sessão do usuário.
  const session = await getSession({ req });

  // Se o usuário não estiver autenticado, redireciona para a página inicial.
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Retorna as propriedades do usuário autenticado.
  return {
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};
