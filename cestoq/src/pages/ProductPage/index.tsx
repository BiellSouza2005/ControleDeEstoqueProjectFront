import { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios';
import './ProductPage.css';
import FormularioProduct from '../../componentes/FormularioProduct';

interface Product {
    productId: number;
    name: string;
    price: number;
    brandId: number;
    productTypeId: number;
}

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState<string>('');
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<() => void>(() => {});
    const [mensagemModal, setMensagemModal] = useState<string>('');
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [novoNome, setNovoNome] = useState<string>('');
    const [novoPreco, setNovoPreco] = useState<number>(0);

    const carregarProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5124/api/Products/VerTodosOsProdutos');
            setProducts(response.data);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const handleProdutoCadastrado = (product: Partial<Product>) => {
        setMensagemModal("Você deseja adicionar este produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');
                const response = await axios.post(
                    'http://localhost:5124/api/Products/AdicionarProduto',
                    product,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Inclusion': username,
                        },
                    }
                );

                if (response.status === 201) {
                    carregarProdutos();
                }
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
            }
        });
        setMostrarModal(true);
    };

    const handleDeleteProduto = (id: number) => {
        setMensagemModal("Você deseja realmente excluir este produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');
                await axios.delete(`http://localhost:5124/api/Products/DesativarProduto/${id}`, {
                    headers: { 'User-Inclusion': username },
                });
                carregarProdutos();
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        });
        setMostrarModal(true);
    };

    const handleAlterarProduto = (id: number) => {
        setMensagemModal("Você deseja alterar este produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');
                await axios.put(
                    `http://localhost:5124/api/Products/AlterarProduto/${id}`,
                    { productId: id, name: novoNome, price: novoPreco },
                    { headers: { 'Content-Type': 'application/json', 'User-Inclusion': username } }
                );
                carregarProdutos();
                setEditandoId(null);
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao alterar produto:', error);
            }
        });
        setMostrarModal(true);
    };

    const handleCancelarEdicao = () => {
        setEditandoId(null);
    };

    const produtosFiltrados = products.filter(product =>
        product.name && product.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section>
            <div>
                <h1>Cadastro de Produtos</h1>
                <FormularioProduct
                    identificadorForm="formCadastroProduto"
                    aProductRegistered={handleProdutoCadastrado}
                />
            </div>
            <div className="lista-produtos">
                <h2>Lista de Produtos</h2>
                <BarraDePesquisa query={query} setQuery={setQuery} />
                <ul>
                    {produtosFiltrados.map(product => (
                        <li key={product.productId} className="produto-item">
                            {editandoId === product.productId ? (
                                <>
                                    <input
                                        type="text"
                                        value={novoNome}
                                        onChange={e => setNovoNome(e.target.value)}
                                        placeholder="Novo nome"
                                    />
                                    <input
                                        type="number"
                                        value={novoPreco}
                                        onChange={e => setNovoPreco(Number(e.target.value))}
                                        placeholder="Novo preço"
                                    />
                                    <Botao onClick={() => handleAlterarProduto(product.productId)}>Salvar</Botao>
                                    <Botao onClick={handleCancelarEdicao}>Cancelar</Botao>
                                </>
                            ) : (
                                <>
                                    <span>{product.name} - R${product.price}</span>
                                    <Botao
                                        onClick={() => {
                                            setEditandoId(product.productId);
                                            setNovoNome(product.name);
                                            setNovoPreco(product.price);
                                        }}
                                    >
                                        Editar
                                    </Botao>
                                    <Botao onClick={() => handleDeleteProduto(product.productId)}>Excluir</Botao>
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

export default ProductPage;