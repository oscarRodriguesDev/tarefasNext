import styles from "./styles.module.css";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Textarea from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Link from "next/link";
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

//interface para configuração da tipagem do user
interface HomeProps {
  user: {
    email: string;
  };
}

interface taskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

const Dashboards = ({ user }: HomeProps) => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<taskProps[]>([]);
  const [publicTask, setPublicTask] = useState(false);

  //função para capturar se o usuario colocou a tarefa como publica ou não
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.checked);
    setPublicTask(event.target.checked);
  }

  useEffect(() => {
    async function loadingTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );
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

  //função para registrar as tarefas
  async function handleRegisterTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (input === "") return;
    try {
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

  async function handleShare(id: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/task/${id}`;
  
    try {
      await navigator.clipboard.writeText(url);
     alert("Link da tarefa copidado para area de tranferência");
    } catch (error) {
      console.error('Erro ao copiar para a área de transferência:', error);
      alert('Erro ao copiar para a área de transferência');
    }
  }


  async function handleDeleteTask(id:string){
    const docRef = doc(db,'tarefas',id)
    const confirmation = window.confirm("Tem certeza que deseja excluir essa tarefa?")
    if(confirmation){
    await deleteDoc(docRef)
    }else{
      alert('A tarefa foi mantida')
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title> Meu Painel</title>
      </Head>
      <main className={styles.main}>
        {/* essa section é parte superior da minha pagina, onde crio cada uma das tarefas */}
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua Tarefa</h1>

            {/* formulario para gravar tarefas */}
            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite sua Tarefa..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkBoxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa publica</label>
              </div>
              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>

        {/* já essa section vai ficar na parte inferior onde vai ficar... */}
        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
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
                {item.public ? (
                  <Link href={`/task/${item.id}`}>{item.tarefa}</Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}
                <button className={styles.trashButton} onClick={()=>handleDeleteTask(item.id)}>
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

export default Dashboards;

/* o metodo abaixo permite que seja possivel privar rotas */
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

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
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};
