// Importa o tipo HTMLProps do React para tipar as propriedades do componente.
import { HTMLProps } from 'react'
// Importa as classes de estilo do módulo CSS local.
import styles from './styles.module.css'

// Declaração do componente funcional Textarea, que recebe todas as propriedades HTML de um elemento textarea.
function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>) {
    // Renderiza um elemento textarea com a classe de estilo "textarea" e repassa todas as propriedades recebidas.
    return <textarea className={styles.textarea} {...rest}></textarea>
}

// Exporta o componente Textarea para que possa ser utilizado em outros módulos.
export default Textarea;
