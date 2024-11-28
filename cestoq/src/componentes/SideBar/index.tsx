import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';
import Botao from '../Botao';

const Sidebar: React.FC = () => {

    const Logout = () => {
        sessionStorage.clear();
        window.location.reload(); 
    }

    return (
        <nav className="sidebar">
            <ul>
                <li><Link to="/cadastro-marca">Marca</Link></li>
                <li><Link to="/tipo-produtos">Tipos de Produto</Link></li>
                {/* Adicione outros links conforme necessário */}
            </ul>
            <Botao 
                onClick={() => Logout()}
                className="botao-logout"
            >Logout</Botao>
        </nav>
    );
};

export default Sidebar;
