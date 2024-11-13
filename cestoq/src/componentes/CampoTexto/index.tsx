import './CampoTexto.css'

interface CampoTextoPros {
    aoAlterado: (valor: string) => void;
    identificador: string;
    placeholder: string;
    label: string;
    valor: string;
    obrigatorio?: boolean;
}

const CampoTexto = ({identificador, placeholder, aoAlterado, label, valor, obrigatorio = false}: CampoTextoPros) => {

    const placeholderModificada = `${placeholder}...` 

    const aoDigitado = (evento: React.ChangeEvent<HTMLInputElement>) => {
        aoAlterado(evento.target.value)
    }
    
    return (
        <div className="campo-texto">
            <label>
                {label}
            </label>
            <input id={identificador}
                value={valor} 
                onChange={aoDigitado}   
                required={obrigatorio} 
                placeholder={placeholderModificada}
            />
        </div>
    )
}

export default CampoTexto;