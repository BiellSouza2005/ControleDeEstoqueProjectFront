import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormularioUsuario from '../../componentes/FormularioUsuario';
import './LoginUsuarioPage.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = async (usuario: { Email: string; Password: string }) => {
        try {
            const response = await axios.post('http://localhost:5124/api/User/LoginUsuario', usuario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 && response.data.token) {
                sessionStorage.setItem('authtoken', JSON.stringify(response.data.token));
                sessionStorage.setItem('username', JSON.stringify(response.data.user.email));
               // navigate('/Sidebar');  // Redireciona para a página com a sidebar
               location.reload(); //Redireciona para a página com a sidebar
            } else {
                throw new Error('Token não encontrado.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Erro ao fazer login.');
            } else {
                alert('Erro inesperado.');
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <FormularioUsuario onSubmit={handleLogin} isLogin={true} />
            <button onClick={() => navigate('/cadastro-usuario')}>Não tem uma conta? Cadastre-se</button>
        </div>
    );
};

export default LoginPage;
