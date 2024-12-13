import { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios';
import './OrderPage.css';
import EditProductModal from '../../componentes/EditProductModal';
import FormularioOrder from '../../componentes/FormularioOrder';


interface Order {
    orderId: number;
    orderDate: string;
    clientId: number;
    orderItems: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
    orderPayments: {
        amount: number;
        paymentDate: string;
    }[];
}

interface Product {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    brandId: number;
    productTypeId: number;
}

interface Client {
    clientId: number;
    name: string;
    email: string;
}


const OrderPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [query, setQuery] = useState<string>('');
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<() => void>(() => {});
    const [mensagemModal, setMensagemModal] = useState<string>('');
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [produtosRes, clientsRes] = await Promise.all([
                    axios.get('http://localhost:5124/api/Products/VerTodosProdutos'),
                    axios.get('http://localhost:5124/api/Clients/VerTodosOsClientes'),
                ]);

                setProducts(produtosRes.data);
                setClients(clientsRes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getEntityNameById = (id: number, entities: Array<{ [key: string]: any }>, key: string): string => {
        const entity = entities.find(e => e[key] === id);
        return entity ? entity.name : 'Desconhecido';
    };

    const handleOrderCadastrado = (order: Partial<Order>) => {
        setMensagemModal('Você deseja adicionar este pedido?');
        setAcaoConfirmacao(() => async () => {
            try {
                console.log(order);
                const username = sessionStorage.getItem('username');
                const response = await axios.post(
                    'http://localhost:5124/api/Order/AdicionarPedido',
                        order,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Inclusion': username,
                        },
                    }
                );
    
                if (response.status === 201) {
                    console.log('Pedido criado com sucesso:', response.data);
                }
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao cadastrar pedido:', error);
            }
        });
        setMostrarModal(true);
    };
    const handleDeleteProduto = (id: number) => {
        setMensagemModal('Você deseja realmente excluir este produto?');
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');
                await axios.delete(`http://localhost:5124/api/Products/DesativarProduto/${id}`, {
                    headers: { 'User-Inclusion': username },
                });
                setProducts(prev => prev.filter(product => product.productId !== id));
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        });
        setMostrarModal(true);
    };

    const handleEditProduto = async (updatedProduct: Product) => {
        try {
            const username = sessionStorage.getItem('username');
            const response = await axios.put(
                `http://localhost:5124/api/Products/AlterarProduto/${updatedProduct.productId}`,
                updatedProduct,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Inclusion': username,
                    },
                }
            );

            if (response.status === 200) {
                setProducts(prev => prev.map(product =>
                    product.productId === updatedProduct.productId ? updatedProduct : product
                ));
            }
            setEditProduct(null);
        } catch (error) {
            console.error('Erro ao editar produto:', error);
        }
    };

    const clientFiltrados = clients.filter(client =>
        client.name?.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const clientsPaginados = clientFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(clientFiltrados.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <section>
            <div>
                <h1>Cadastro de Produtos</h1>
                <FormularioOrder
                    identificadorForm="formCadastroProduto"
                    aOrderRegistred={handleOrderCadastrado} 
                    products={products} 
                    clients={clients}/>
            </div>
            <div className="lista-products">
                <h2>Lista de Produtos</h2>
                <BarraDePesquisa
                    query={query}
                    setQuery={setQuery}
                    placeholderprops="Pesquisar produtos..."
                />
                <table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Data do Pedido</th>
                            <th>Produtos do pedido</th>
                            <th>Pagamentos</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientsPaginados.map(client => (
                            <tr key={client.clientId}>
                                <td>{client.name}</td>
                                <td>{getEntityNameById(client.clientId, products, 'productId')}</td>
                                <td>R${client.clientId.toFixed(2)}</td>
                                <td>{getEntityNameById(client.clientId, products, 'brandId')}</td>
                                <td>
                                    <Botao
                                        onClick={() => setEditProduct(client as unknown as Product)}
                                    >
                                        Editar
                                    </Botao>
                                    <Botao
                                        onClick={() => handleDeleteProduto(client.clientId)}
                                    >
                                        Excluir
                                    </Botao>
                                </td>
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
            {editProduct && (
                <EditProductModal
                    product={editProduct}
                    onSave={handleEditProduto}
                    onClose={() => setEditProduct(null)}
                />
            )}

        </section>
    );
};

export default OrderPage;
