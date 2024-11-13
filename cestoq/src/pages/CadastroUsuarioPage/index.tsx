import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormularioUsuario from '../../componentes/FormularioUsuario';

const CadastroUsuarioPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCadastroUsuario = async (usuario: { Name: string; Email: string; Password: string }) => {
        try {
            const response = await axios.post('http://localhost:5124/api/User/AdicionarUsuario', usuario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert('Usuário cadastrado com sucesso!');
                navigate('/login'); // Redireciona após o sucesso do cadastro
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Erro ao cadastrar usuário.');
                console.log(usuario);
            } else {
                alert('Erro inesperado.');
            }
        }
    };

    return (
        <div>
            <h1>Cadastro de Usuário</h1>
            <FormularioUsuario isLogin={false} onSubmit={handleCadastroUsuario}  />
            <button onClick={() => navigate('/login')}>Já tem uma conta? Login</button>
        </div>
    );
};

export default CadastroUsuarioPage;
