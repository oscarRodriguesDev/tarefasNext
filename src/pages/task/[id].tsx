// Este arquivo se chama [id].tsx, o que indica que é uma página dinâmica que aceita um parâmetro chamado "id".
// O uso de colchetes no nome do arquivo é uma convenção do Next.js para criar rotas dinâmicas, onde o valor do "id"
// pode variar dinamicamente e é acessado como um parâmetro na página.

// Importação de módulos e componentes necessários para a página.
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "./styles.module.css";
import { FaTrash } from "react-icons/fa";

// Importação de funções do Firebase para interação com o banco de dados.
import { db } from "../../services/firebaseConnection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Importação de um componente de textarea customizado.
import Textarea from "@/components/textarea";

// Definição de interfaces para as propriedades das tarefas e dos comentários.
interface TaskProps {
  item: {
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

// Componente principal da página que exibe detalhes de uma tarefa específica.
export default function Task({ item, allComments }: TaskProps) {
  // Hooks do React para obter a sessão do usuário e gerenciar o estado do input e dos comentários.
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  // Função assíncrona para lidar com o envio de comentários.
  async function handleComment(event: FormEvent) {
    event.preventDefault();

    // Verifica se o input de comentário está vazio e se o usuário está autenticado.
    if (input === "") return;
    if (!session?.user?.email || !session?.user?.name) return;

    try {
      // Adiciona um novo documento à coleção "comments" no Firebase.
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      // Atualiza o estado dos comentários localmente.
      const data = {
        id: docRef.id,
        user: session?.user?.email,
        comment: input,
        name: session?.user?.name,
        taskId: item?.taskId,
      };
      setComments((oldItems) => [...oldItems, data]);

      // Limpa o input.
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  // Função assíncrona para lidar com a exclusão de comentários.
  async function handleDeleteComment(id: string) {
    try {
      // Deleta o documento correspondente ao comentário no Firebase.
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      // Atualiza o estado dos comentários localmente, removendo o comentário deletado.
      const filteredItems = comments.filter((item) => item.id !== id);
      setComments(filteredItems);

      // Exibe um alerta informando que o comentário foi deletado com sucesso.
      alert("Comentário deletado com sucesso!");
    } catch (err) {
      console.log(err);
    }
  }

  // Renderização da página com detalhes da tarefa e a seção de comentários.
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefa - Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>

      {/* Seção para deixar comentários na tarefa. */}
      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>

        <form onSubmit={handleComment}>
          {/* Componente de textarea customizado para a entrada de comentários. */}
          <Textarea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            placeholder="Digite seu comentário..."
          />
          {/* Botão para enviar o comentário, desabilitado se o usuário não estiver autenticado. */}
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentário
          </button>
        </form>
      </section>

      {/* Seção que exibe todos os comentários associados à tarefa. */}
      <section className={styles.commentsContainer}>
        <h2>Todos comentários</h2>
        {/* Exibe uma mensagem se não houver nenhum comentário. */}
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {/* Mapeia e exibe todos os comentários existentes. */}
        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComments}>
              {/* Exibe o nome do usuário que fez o comentário. */}
              <label className={styles.commentsLabel}>{item.name}</label>
              {/* Botão para excluir o comentário, visível apenas se o usuário for o autor do comentário. */}
              <button className={styles.buttonTrash}>
                {item.user === session?.user?.email && (
                  <FaTrash
                    size={18}
                    color="#ea3140"
                    onClick={() => handleDeleteComment(item.id)}
                  />
                )}
              </button>
            </div>
            {/* Exibe o conteúdo do comentário. */}
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

// Função assíncrona que é executada no servidor para obter os dados da tarefa e seus comentários.
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Obtém o parâmetro "id" da URL.
  const id = params?.id as string;
  // Referência ao documento da tarefa no Firebase.
  const docRef = doc(db, "tarefas", id);

  // Query para obter todos os comentários associados à tarefa.
  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  // Transforma os dados dos comentários em um array de objetos.
  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  // Obtém um snapshot dos dados da tarefa.
  const snapshot = await getDoc(docRef);

  // Redireciona para a página inicial se a tarefa não existir ou não for pública.
  if (snapshot.data() === undefined || !snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Calcula a data de criação da tarefa em milissegundos.
  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  // Formata os dados da tarefa.
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  // Retorna as propriedades da página com os dados da tarefa e dos comentários.
  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
