import FormularioMarca from '../../componentes/FormularioMarca';
import { ICadastro } from '../../cadastro/interfaces/ICadastro';
import React, { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios'; // Importando axios
import './CadastroMarcaPage.css';

interface Marca {
    brandId: number;
    name: string;
}

const CadastroMarcaPage: React.FC = () => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [query, setQuery] = useState<string>(''); 
    const [mostrarModal, setMostrarModal] = useState<boolean>(false); // Controle do modal
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<() => void>(() => {}); // Ação de confirmação
    const [mensagemModal, setMensagemModal] = useState<string>(''); // Mensagem do modal
    const [editandoId, setEditandoId] = useState<number | null>(null); // Controle do modo de edição
    const [novoNome, setNovoNome] = useState<string>(''); // Estado para armazenar o novo nome da marca

    // Função para carregar as marcas do backend
    const carregarMarcas = async () => {
        try {
            const response = await axios.get('http://localhost:5124/api/Brands/api/VerMarcas');
            setMarcas(response.data);
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    };

    useEffect(() => {
        carregarMarcas();
    }, []);

    // Função para cadastro da marca
    const handleMarcaCadastrada = (marca: ICadastro) => {
        setMensagemModal("Você deseja adicionar esta marca?");
        setAcaoConfirmacao(() => async () => {
        
            try {
                const response = await axios.post('http://localhost:5124/api/Brands/AdicionaMarca', 
                    { name: marca.marca  }, 
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.status === 201) {
                    carregarMarcas();
                    
                } 
                setMostrarModal(false);

            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response && error.response.data === 'A marca já existe.');
                } else {
                    console.error('Erro ao cadastrar marca:', error);
                }
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para deletar uma marca
    const handleDeleteMarca = (id: number) => {
        setMensagemModal("Você deseja realmente excluir esta marca?");
        setAcaoConfirmacao(() => async () => {
            try {
                await axios.delete(`http://localhost:5124/api/Brands/DeletaMarca/${id}`);
                carregarMarcas();
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir marca:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para alterar uma marca
    const handleAlterarMarca = (id: number) => {
        setMensagemModal("Você deseja alterar esta marca?");
        setAcaoConfirmacao(() => async () => {
            try {
                await axios.put(`http://localhost:5124/api/Brands/MudaMarca/${id}`, 
                    { name: novoNome }, 
                    { headers: { 'Content-Type': 'application/json' } }
                );
                alert('Marca alterada com sucesso!');
                carregarMarcas();
                setEditandoId(null); // Sai do modo de edição
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao alterar marca:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para cancelar a edição
    const handleCancelarEdicao = () => {
        setEditandoId(null); // Sai do modo de edição sem alterar nada
    };

    const marcasFiltradas = marcas.filter(marca =>
        marca.name && marca.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section>
            <div>
                <h1>Cadastro de Marca</h1>
                <FormularioMarca
                    identificadorForm="formCadastroMarca"
                    aMarcaCadastrada={handleMarcaCadastrada}
                />
            </div>
            <div className="lista-marcas">
                <h2>Lista de Marcas</h2>
                <BarraDePesquisa query={query} setQuery={setQuery} />
                <ul>
                    {marcasFiltradas.map(marca => (
                        <li key={marca.brandId} className="marca-item">
                            {editandoId === marca.brandId ? (
                                <>
                                    <input
                                        type="text"
                                        value={novoNome}
                                        onChange={e => setNovoNome(e.target.value)}
                                        placeholder="Digite o novo nome"
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <Botao 
                                        onClick={() => handleAlterarMarca(marca.brandId)}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 5px',
                                            cursor: 'pointer',
                                        }}
                                    >Salvar</Botao>
                                    <Botao 
                                        onClick={handleCancelarEdicao}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 5px',
                                            cursor: 'pointer',
                                        }}
                                    >Cancelar</Botao>
                                </>
                            ) : (
                                <>
                                    <span>{marca.name}</span>
                                    <Botao
                                        onClick={() => {
                                            setEditandoId(marca.brandId);
                                            setNovoNome(marca.name); // Preenche o campo de edição com o nome atual
                                        }}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 5px',
                                            cursor: 'pointer',
                                            margin: '0px'
                                        }}
                                    >
                                        Editar
                                    </Botao>
                                    <Botao
                                        onClick={() => handleDeleteMarca(marca.brandId)}
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 5px',
                                            cursor: 'pointer',
                                            margin: '0px 0px 0px 10px'
                                        }}
                                    >
                                        Excluir
                                    </Botao>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {mostrarModal && (
                <ConfirmacaoModal 
                    mensagem={mensagemModal} 
                    onConfirmar={acaoConfirmacao} 
                    onCancelar={() => setMostrarModal(false)} 
                />
            )}
        </section>
    );
};

export default CadastroMarcaPage;
