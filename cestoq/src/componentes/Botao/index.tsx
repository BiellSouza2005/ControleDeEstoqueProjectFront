import { ReactElement, ButtonHTMLAttributes } from 'react';
import './Botao.css';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactElement | string;
}

const Botao = ({ children, ...rest }: BotaoProps) => {
    return (
        <button className='botao' {...rest}>
            {children}
        </button>
    );
}

export default Botao;