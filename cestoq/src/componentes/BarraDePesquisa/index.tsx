import React from 'react';
import './BarraDePesquisa.css'

interface BarraDePesquisaProps {
    query: string;     
    placeholderprops: string;                 //representa o que o usuário digita
    setQuery: (query: string) => void;  //atualiza a query toda vez que o usuário digita algo novo
}

const BarraDePesquisa: React.FC<BarraDePesquisaProps> = ({ query, setQuery, placeholderprops }) => {
    return (
        <input
            className="BarraDePesquisa"
            type="text"
            placeholder={placeholderprops}
            value={query}
            onChange={e => setQuery(e.target.value)}

        />
    );
};

export default BarraDePesquisa;
