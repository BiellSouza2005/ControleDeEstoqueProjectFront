import React, { useState } from 'react';
import './FormularioUsuario.css';

type UsuarioCadastro = { Name: string; Email: string; Password: string };
type UsuarioLogin = { Email: string; Password: string };

interface FormularioUsuarioPropsBase<T> {
    isLogin: boolean;
    onSubmit: (usuario: T) => void;
}

interface FormularioUsuarioPropsCadastro extends FormularioUsuarioPropsBase<UsuarioCadastro> {
    isLogin: false;
}

interface FormularioUsuarioPropsLogin extends FormularioUsuarioPropsBase<UsuarioLogin> {
    isLogin: true;
}

type FormularioUsuarioProps = FormularioUsuarioPropsCadastro | FormularioUsuarioPropsLogin;

const FormularioUsuario: React.FC<FormularioUsuarioProps> = (props) => {
    const { isLogin, onSubmit } = props;
    const [Name, setNome] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setSenha] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLogin) {
            onSubmit({ Email, Password }); 
        } else {
            onSubmit({ Name, Email, Password });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <div>
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        value={Name}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
            )}
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="senha">Senha</label>
                <input
                    type="password"
                    id="senha"
                    value={Password}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{isLogin ? 'Login' : 'Cadastrar'}</button>
        </form>
    );
};

export default FormularioUsuario;
