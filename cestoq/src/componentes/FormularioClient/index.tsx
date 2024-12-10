import { useState } from 'react'
import Botao from '../Botao'
import CampoTexto from '../CampoTexto'
import './FormularioClient.css'

interface FormularioClientProps {
    identificadorForm: string;
    aClientRegistred: (client: {name: string; email:string;}) => void;
    
}

const FormularioClient = ({identificadorForm, aClientRegistred}: FormularioClientProps) => {

    const [Name, setName] = useState('')
    const [Email, setEmail] = useState('')
    

    const aoSalvar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()
        aClientRegistred({
            name: Name,
            email: Email
        })
        setName('')
        setEmail('')
    }

    return (
        <section className="formularioClient">
            <form id={identificadorForm} onSubmit={aoSalvar}>
                <h2>Adicione um cliente</h2>
                <CampoTexto 
                    identificador='idClient'
                    obrigatorio={true}
                    label=""
                    placeholder="Digite o nome do cliente" 
                    valor={Name}
                    aoAlterado={valor => setName(valor)}
                    tipo='text'
                />
                <CampoTexto 
                    identificador='idClient'
                    obrigatorio={true}
                    label=""
                    placeholder="Digite o email do cliente" 
                    valor={Email}
                    aoAlterado={valor => setEmail(valor)}
                    tipo='email'
                />
                <Botao>
                    Criar Cliente
                </Botao>
            </form>
        </section>
    )
}

export default FormularioClient