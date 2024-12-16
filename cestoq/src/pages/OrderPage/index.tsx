import { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import TableProductModal from '../../componentes/TableProductModal';
import axios from 'axios';
import './OrderPage.css';
import FormularioOrder from '../../componentes/FormularioOrder';
import FormularioEditOrder from '../../componentes/FormularioEditOrder';
import TablePaymentModal from '../../componentes/TablePaymentModal';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [orders, setOrders] = useState<Order[]>([]);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [modalProducts, setModalProducts] = useState<Product[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalPayments, setModalPayments] = useState<{ amount: number; paymentDate: string; }[]>([]);
    const [isPaymentModalOpen, SetIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [produtosRes, clientsRes, orderRes] = await Promise.all([                    
                    axios.get('http://localhost:5124/api/Products/VerTodosProdutos'),
                    axios.get('http://localhost:5124/api/Clients/VerTodosOsClientes'),
                    axios.get('http://localhost:5124/api/Order/VerPedidos')
                ]);

                setOrders(orderRes.data);
                setProducts(produtosRes.data);
                setClients(clientsRes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const getEntityNameById = (id: number, entities: Array<{ [key: string]: any }>, key: string): string => {
    //     const entity = entities.find(e => e[key] === id);
    //     return entity ? entity.name : 'Desconhecido';
    // };

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
    const handleDeleteOrder = (id: number) => {
        setMensagemModal('Você deseja realmente excluir este pedido?');
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');
                await axios.delete(`http://localhost:5124/api/Order/DesativarPedido/${id}`, {
                    headers: { 'User-Inclusion': username },
                });
                setOrders(prev => prev.filter(order => order.orderId !== id));
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir pedido:', error);
            }
        });
        setMostrarModal(true);
    };

    const handleEditOrder = async (updatedOrder: Order) => {
        try {
            const username = sessionStorage.getItem('username');
            const response = await axios.put(
                `http://localhost:5124/api/Order/AtualizarPedido/${updatedOrder.orderId}`,
                updatedOrder,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Inclusion': username,
                    },
                }
            );

            if (response.status === 200) {
                setOrders(prev => prev.map(order =>
                    order.orderId === updatedOrder.orderId ? updatedOrder : order
                ));
                
            }
            setEditOrder(null);

        } catch (error) {
            console.error('Erro ao editar pedido:', error);
        }
    };

    const openProductModal = (orderId: number) => {
        const order = orders.find(o => o.orderId === orderId);
        if (order) {
            const productsInOrder = order.orderItems.map(item => {
                const product = products.find(p => p.productId === item.productId);
                return {
                    ...product,
                    quantity: item.quantity,
                };
            });
            setModalProducts(productsInOrder as Product[]);
            setIsProductModalOpen(true);
        }
    };

    const openPaymentModal = (orderId: number) => {
        const order = orders.find(o => o.orderId === orderId);
        if (order) {
            setModalPayments(order.orderPayments);
            SetIsPaymentModalOpen(true);
        }
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setModalProducts([]);
    };


    const closePaymentModal = () => {
        SetIsPaymentModalOpen(false);
        setModalPayments([]);
    };

    const orderFiltrados = orders.filter(order =>
        order.orderId?.toString().includes(query)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const orderPaginados = orderFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(orderFiltrados.length / itemsPerPage);

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
                            <th>N° Pedido</th>
                            <th>Cliente</th>
                            <th>Data do Pedido</th>
                            <th>Produtos do pedido</th>
                            <th>Pagamentos</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderPaginados.map(order => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{clients.find(c => c.clientId === order.clientId)?.name || 'Desconhecido'}</td>
                                <td>{order.orderDate.split('T')[0]}</td>
                                <td>
                                    <Botao className='btn-ver-produtos' onClick={() => openProductModal(order.orderId)}>
                                        Ver Produtos
                                    </Botao>
                                </td>
                                <td>
                                    <Botao className='btn-ver-pagamentos' onClick={() => openPaymentModal(order.orderId)}>
                                        Ver Pagamentos
                                    </Botao>
                                </td>
                                <td>
                                    <Botao
                                        onClick={() => setEditOrder(order)}
                                        className='btn-editar'
                                    >
                                        Editar
                                    </Botao>
                                    <Botao
                                        onClick={() => handleDeleteOrder(order.orderId)}
                                        className='btn-excluir'
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
            {editOrder && (
                <FormularioEditOrder
                order={editOrder}
                products={products}
                clients={clients}
                onSubmit={handleEditOrder}
                onCancel={() => setEditOrder(null)}
                />
            )}
            {isProductModalOpen && (
                <TableProductModal
                    isOpen={isProductModalOpen}
                    onClose={closeProductModal}
                    products={modalProducts}
                />
            )}
            {isPaymentModalOpen && (
                <TablePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={closePaymentModal}
                    payments={modalPayments}
                />
            )}
            

        </section>
    );
};

export default OrderPage;
