import React, { useEffect, useState } from 'react';
import './ListaMarcasPage.css';

interface Marca {
    brandId: number;
    name: string;
}

const ListaMarcas: React.FC = () => {
    const [marcas, setMarcas] = useState<Marca[]>([]);

    useEffect(() => {
        fetch('http://localhost:5124/api/Brands/api/VerMarcas')
            .then(response => response.json())
            .then(data => setMarcas(data))
            .catch(error => console.error('Erro ao carregar marcas:', error));
    }, []);

    return (
        <div className="lista-marcas">
            <h2>Lista de Marcas</h2>
            <ul>
                {marcas.map(marca => (
                    <li key={marca.brandId}>{marca.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListaMarcas;
