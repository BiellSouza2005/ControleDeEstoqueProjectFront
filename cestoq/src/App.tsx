import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './componentes/SideBar';
import RoutesConfig from './routes';
import LoginPage from './pages/LoginUsuarioPage';
import CadastroUsuarioPage from './pages/CadastroUsuarioPage';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica se o token está salvo no localStorage
        const token = sessionStorage.getItem('authtoken');
        if (token !== null) {
            setIsAuthenticated(true);
        }  else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Rota de Login */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/Sidebar" /> : <LoginPage /> 
                    }
                />

                {/* Rota de Cadastro */}
                <Route
                    path="/cadastro-usuario"
                    element={
                        isAuthenticated ? <Navigate to="/Sidebar" /> : <CadastroUsuarioPage /> 
                    }
                />



                {/* Rotas protegidas com a Sidebar */}
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <div style={{ display: 'flex' }}>
                                <Sidebar />
                                <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
                                    <RoutesConfig />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
