import { useState } from 'react'
import Botao from '../Botao'
import CampoTexto from '../CampoTexto'
import './FormularioMarca.css'
import { ICadastroMarca } from '../../cadastro/interfaces/ICadastro'

interface FormularioMarcaProps {
    identificadorForm: string;
    aMarcaCadastrada: (marca: ICadastroMarca) => void;
    
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
                    label=""
                    placeholder="Digite uma marca" 
                    valor={marca}
                    aoAlterado={valor => setMarca(valor)}
                    tipo='text'
                />
                <Botao>
                    Criar Marca
                </Botao>
            </form>
        </section>
    )
}

export default FormularioMarca