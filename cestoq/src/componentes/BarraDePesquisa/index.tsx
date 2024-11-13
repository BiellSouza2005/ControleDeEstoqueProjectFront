import React from 'react';
import './BarraDePesquisa.css'

interface BarraDePesquisaProps {
    query: string;                      //representa o que o usuário digita
    setQuery: (query: string) => void;  //atualiza a query toda vez que o usuário digita algo novo
}

const BarraDePesquisa: React.FC<BarraDePesquisaProps> = ({ query, setQuery }) => {
    return (
        <input
            className="BarraDePesquisa"
            type="text"
            placeholder="Pesquisar marca..."
            value={query}
            onChange={e => setQuery(e.target.value)}

        />
    );
};

export default BarraDePesquisa;
