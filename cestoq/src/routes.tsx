import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CadastroMarcaPage from './pages/CadastroMarcaPage';
import ProductTypePage from './pages/ProductTypePage';
import CadastroUsuarioPage from './pages/CadastroUsuarioPage';
import LoginUsuarioPage from './pages/LoginUsuarioPage';
import Sidebar from './componentes/SideBar';
import ProductPage from './pages/ProductPage';
import CadastroClientPage from './pages/ClientPage';
import OrderPage from './pages/OrderPage';

const RoutesConfig: React.FC = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/cadastro-marca" element={<CadastroMarcaPage />} />
        <Route path="/tipo-produtos" element={<ProductTypePage />} />
        <Route path="/produtos" element={<ProductPage />} />
        <Route path="/pedidos" element={<OrderPage />} />
        <Route path="/clientes" element={<CadastroClientPage />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuarioPage />} />
        <Route path="/login" element={<LoginUsuarioPage />} />
        <Route path="/Sidebar" element={<Sidebar />} />
    </Routes>
);

export default RoutesConfig;
