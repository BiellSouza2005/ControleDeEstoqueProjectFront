import React, { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios'; // Importando axios
import './ClientPage.css';
import FormularioClient from '../../componentes/FormularioClient';



interface Client {
    clientId: number;
    name: string;
    email: string;
}

const CadastroClientPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [query, setQuery] = useState<string>(''); 
    const [mostrarModal, setMostrarModal] = useState<boolean>(false); // Controle do modal
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<() => void>(() => {}); // Ação de confirmação
    const [mensagemModal, setMensagemModal] = useState<string>(''); // Mensagem do modal
    const [editandoId, setEditandoId] = useState<number | null>(null); // Controle do modo de edição
    const [novoNome, setNovoNome] = useState<string>(''); // Estado para armazenar o novo nome da marca
    const [novoEmail, setNovoEmail] = useState<string>(''); // Estado para armazenar o novo nome da marca
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Função para carregar os tipos de produto do backend
    const carregarClients = async () => {
        try {
            const response = await axios.get('http://localhost:5124/api/Clients/VerTodosOsClientes');
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    };

    useEffect(() => {
        carregarClients();
    }, []);

    // Função para cadastro da marca
    const handleClientRegistred = (client: Partial<Client>) => {
        setMensagemModal("Você deseja adicionar este cliente?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username'); // Obtendo o username do sessionStorage
    
                const response = await axios.post(
                    'http://localhost:5124/api/Clients/AdicionarCliente',
                    { name: client.name, email:client.email },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Inclusion': username // Adicionando o username no cabeçalho
                        }
                    }
                );
    
                if (response.status === 201) {
                    carregarClients();
                }
                setMostrarModal(false);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response && error.response.data === 'O cliente já existe.');
                } else {
                    console.error('Erro ao cadastrar cliente:', error);
                }
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para deletar uma marca
    const handleDeleteClient = (id: number) => {
        setMensagemModal("Você deseja realmente excluir este cliente?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');

                await axios.delete(`http://localhost:5124/api/Clientes/DesativarCliente/${id}`,
                { headers: {'User-Inclusion': username } }
                )
                carregarClients();
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para alterar uma marca
    const handleAlterarClient = (id: number) => {
        setMensagemModal("Você deseja alterar este cliente?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');

                await axios.put(`http://localhost:5124/api/Clients/AlterarCliente/${id}`, 
                    { clientId: id, name: novoNome, email: novoEmail }, 
                    { headers: { 'Content-Type': 'application/json', 'User-Inclusion': username } }
                );
                alert('Cliente alterado com sucesso!');
                carregarClients();
                setEditandoId(null); // Sai do modo de edição
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao alterar cliente:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para cancelar a edição
    const handleCancelarEdicao = () => {
        setEditandoId(null); // Sai do modo de edição sem alterar nada
    };

    const clientsFiltrados = clients.filter(clients =>
        clients.name && clients.name.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const clientsPaginados = clientsFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(clientsFiltrados.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <section>
            <div>
                <h1>Cadastro de Cliente</h1>
                <FormularioClient
                    identificadorForm="formClient"
                    aClientRegistred={handleClientRegistred}
                />
            </div>
            <div className="lista-clients">
                <h2>Lista de Clientes</h2>
                <BarraDePesquisa query={query} setQuery={setQuery} placeholderprops='Pesquisar clientes...' />
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientsPaginados.map(client => (
                            <tr key={client.clientId}>
                                {editandoId === client.clientId ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                value={novoNome}
                                                onChange={e => setNovoNome(e.target.value)}
                                                placeholder="Digite o novo nome"
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={novoEmail}
                                                onChange={e => setNovoEmail(e.target.value)}
                                                placeholder="Digite o novo email"
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <Botao
                                                onClick={() => handleAlterarClient(client.clientId)}
                                                style={{
                                                    backgroundColor: 'blue',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Salvar
                                            </Botao>
                                            <Botao
                                                onClick={handleCancelarEdicao}
                                                style={{
                                                    backgroundColor: 'blue',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 5px',
                                                    cursor: 'pointer',
                                                    marginLeft: '5px',
                                                }}
                                            >
                                                Cancelar
                                            </Botao>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{client.name}</td>
                                        <td>{client.email}</td>
                                        <td>
                                            <Botao
                                                onClick={() => {
                                                    setEditandoId(client.clientId);
                                                    setNovoNome(client.name); // Preenche o campo de edição com o nome atual
                                                    setNovoEmail(client.email);
                                                }}
                                                style={{
                                                    backgroundColor: 'blue',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Editar
                                            </Botao>
                                            <Botao
                                                onClick={() => handleDeleteClient(client.clientId)}
                                                style={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 5px',
                                                    cursor: 'pointer',
                                                    marginLeft: '5px',
                                                }}
                                            >
                                                Excluir
                                            </Botao>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </button>
                </div>
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

export default CadastroClientPage;
