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
    quantity: number;
    brandId: number;
    productTypeId: number;
}

interface Brand {
    brandId: number;
    name: string;
}

interface ProductType {
    productTypeId: number;
    name: string;
}

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
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
                const [produtosRes, marcasRes, tiposRes] = await Promise.all([
                    axios.get('http://localhost:5124/api/Products/VerTodosProdutos'),
                    axios.get('http://localhost:5124/api/Brands/VerTodasAsMarcas'),
                    axios.get('http://localhost:5124/api/ProductTypes/VerTodosOsTiposDeProduto'),
                ]);

                setProducts(produtosRes.data);
                setBrands(marcasRes.data);
                setProductTypes(tiposRes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getEntityNameById = (id: number, entities: Array<{ [entity: string]: any }>, key: string): string => {
        const entity = entities.find(e => e[key] === id);
        return entity ? entity.name : 'Desconhecido';
    };

    const handleProdutoCadastrado = (product: Partial<Product>) => {
        setMensagemModal('Você deseja adicionar este produto?');
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
                    setProducts(prev => [...prev, response.data]);
                }
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
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

    const produtosFiltrados = products.filter(product =>
        product.name?.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const produtosPaginados = produtosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(produtosFiltrados.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <section>
            <div>
                <h1>Cadastro de Produtos</h1>
                <FormularioProduct
                    identificadorForm="formCadastroProduto"
                    aProductRegistered={handleProdutoCadastrado} 
                    productTypes={productTypes} 
                    brands={brands}/>
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
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Marca</th>
                            <th>Tipo de Produto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosPaginados.map(product => (
                            <tr key={product.productId}>
                                <td>{product.name}</td>
                                <td>R${product.price.toFixed(2)}</td>
                                <td>{product.quantity}</td>
                                <td>{getEntityNameById(product.brandId, brands, 'brandId')}</td>
                                <td>{getEntityNameById(product.productTypeId, productTypes, 'productTypeId')}</td>
                                <td>
                                    <Botao
                                        onClick={() => setEditProduct(product)}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
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
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                        }}
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

export default ProductPage;
