import { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios';
import './ProductPage.css';
import FormularioProduct from '../../componentes/FormularioProduct';
import EditProductModal from '../../componentes/EditProductModal';

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

    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const carregarProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5124/api/Products/VerTodosProdutos');
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

    const handleEditProduto = async (updatedProduct: Product) => {
        try {
            const username = sessionStorage.getItem('username');
            await axios.put(
                `http://localhost:5124/api/Products/AlterarProduto/${updatedProduct.productId}`,
                updatedProduct,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Inclusion': username,
                    },
                }
            );
            carregarProdutos();
            setEditProduct(null);
        } catch (error) {
            console.error('Erro ao editar produto:', error);
        }
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
            <div className="lista-products">
                <h2>Lista de Produtos</h2>
                <BarraDePesquisa query={query} setQuery={setQuery} placeholderprops="Pesquisar produtos..." />
                <ul>
                    {produtosFiltrados.map(product => (
                        <li key={product.productId} className="product-item">
                            <span>{product.name} - R${product.price}</span>
                            <Botao
                                onClick={() => setEditProduct(product)}
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
                                onClick={() => handleDeleteProduto(product.productId)}
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

export default ProductPage;
