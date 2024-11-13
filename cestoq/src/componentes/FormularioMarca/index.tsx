import { useState } from 'react'
import Botao from '../Botao'
import CampoTexto from '../CampoTexto'
import './FormularioMarca.css'
import { ICadastro } from '../../cadastro/interfaces/ICadastro'

interface FormularioMarcaProps {
    identificadorForm: string;
    aMarcaCadastrada: (marca: ICadastro) => void;
    
}

const FormularioMarca = ({identificadorForm, aMarcaCadastrada}: FormularioMarcaProps) => {

    const [marca, setMarca] = useState('')

    const aoSalvar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()
        aMarcaCadastrada({
            marca
        })
        setMarca('')
    }

    return (
        <section className="formularioMarca">
            <form id={identificadorForm} onSubmit={aoSalvar}>
                <h2>Adicione uma marca</h2>
                <CampoTexto 
                    identificador='idMarca'
                    obrigatorio={true}
                    label="Marca"
                    placeholder="Digite uma marca" 
                    valor={marca}
                    aoAlterado={valor => setMarca(valor)}
                />
                <Botao>
                    Criar Marca
                </Botao>
            </form>
        </section>
    )
}

export default FormularioMarca