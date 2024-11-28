import { useState } from 'react'
import Botao from '../Botao'
import CampoTexto from '../CampoTexto'
import './FormularioProductType.css'
import { ICadastroProductType } from '../../cadastro/interfaces/ICadastro'

interface FormularioProductTypeProps {
    identificadorForm: string;
    aProductTypeRegistred: (productType: ICadastroProductType) => void;
    
}

const FormularioProductType = ({identificadorForm, aProductTypeRegistred}: FormularioProductTypeProps) => {

    const [productType, setProductType] = useState('')

    const aoSalvar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()
        aProductTypeRegistred({
            productType
        })
        setProductType('')
    }

    return (
        <section className="formularioProductType">
            <form id={identificadorForm} onSubmit={aoSalvar}>
                <h2>Adicione um tipo de produto</h2>
                <CampoTexto 
                    identificador='idProductType'
                    obrigatorio={true}
                    label=""
                    placeholder="Digite uma tipo de produto" 
                    valor={productType}
                    aoAlterado={valor => setProductType(valor)}
                />
                <Botao>
                    Criar Marca
                </Botao>
            </form>
        </section>
    )
}

export default FormularioProductType