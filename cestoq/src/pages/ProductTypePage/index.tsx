import { ICadastroProductType } from '../../cadastro/interfaces/ICadastro';
import React, { useEffect, useState } from 'react';
import BarraDePesquisa from '../../componentes/BarraDePesquisa';
import Botao from '../../componentes/Botao';
import ConfirmacaoModal from '../../componentes/ConfirmacaoModal';
import axios from 'axios'; // Importando axios
import './ProductTypePage.css';
import FormularioProductType from '../../componentes/FormularioProductType';

interface ProductType {
    productTypeId: number;
    name: string;
}

const CadastroMarcaPage: React.FC = () => {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [query, setQuery] = useState<string>(''); 
    const [mostrarModal, setMostrarModal] = useState<boolean>(false); // Controle do modal
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<() => void>(() => {}); // Ação de confirmação
    const [mensagemModal, setMensagemModal] = useState<string>(''); // Mensagem do modal
    const [editandoId, setEditandoId] = useState<number | null>(null); // Controle do modo de edição
    const [novoNome, setNovoNome] = useState<string>(''); // Estado para armazenar o novo nome da marca

    // Função para carregar os tipos de produto do backend
    const carregarProductTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5124/api/ProductTypes/VerTodosOsTiposDeProduto');
            setProductTypes(response.data);
        } catch (error) {
            console.error('Erro ao carregar tipos de produtos:', error);
        }
    };

    useEffect(() => {
        carregarProductTypes();
    }, []);

    // Função para cadastro da marca
    const handleProductTypeRegistred = (productType: ICadastroProductType) => {
        setMensagemModal("Você deseja adicionar este tipo de produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username'); // Obtendo o username do sessionStorage
    
                const response = await axios.post(
                    'http://localhost:5124/api/ProductTypes/AdicionarTipoDeProduto',
                    { name: productType.productType },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Inclusion': username // Adicionando o username no cabeçalho
                        }
                    }
                );
    
                if (response.status === 201) {
                    carregarProductTypes();
                }
                setMostrarModal(false);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response && error.response.data === 'O tipo de produto já existe.');
                } else {
                    console.error('Erro ao cadastrar tipo de produto:', error);
                }
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para deletar uma marca
    const handleDeleteProductType = (id: number) => {
        setMensagemModal("Você deseja realmente excluir este tipo de produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');

                await axios.delete(`http://localhost:5124/api/ProductTypes/DesativarTipoDeProduto/${id}`,
                { headers: {'User-Inclusion': username } }
                )
                carregarProductTypes();
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao excluir tipo de produto:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para alterar uma marca
    const handleAlterarProductType = (id: number) => {
        setMensagemModal("Você deseja alterar este tipo de produto?");
        setAcaoConfirmacao(() => async () => {
            try {
                const username = sessionStorage.getItem('username');

                await axios.put(`http://localhost:5124/api/ProductTypes/AlterarTipoDeProduto/${id}`, 
                    { productTypeId: id, name: novoNome }, 
                    { headers: { 'Content-Type': 'application/json', 'User-Inclusion': username } }
                );
                alert('Tipo de produto alterada com sucesso!');
                carregarProductTypes();
                setEditandoId(null); // Sai do modo de edição
                setMostrarModal(false);
            } catch (error) {
                console.error('Erro ao alterar tipo de produto:', error);
            }
        });
        setMostrarModal(true); // Exibe o modal
    };

    // Função para cancelar a edição
    const handleCancelarEdicao = () => {
        setEditandoId(null); // Sai do modo de edição sem alterar nada
    };

    const productTypeFiltrados = productTypes.filter(productTypes =>
        productTypes.name && productTypes.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section>
            <div>
                <h1>Cadastro de Tipo de Produto</h1>
                <FormularioProductType
                    identificadorForm="formCadastroProductType"
                    aProductTypeRegistred={handleProductTypeRegistred}
                />
            </div>
            <div className="lista-productType">
                <h2>Lista de Marcas</h2>
                <BarraDePesquisa query={query} setQuery={setQuery} />
                <ul>
                    {productTypeFiltrados.map(productType => (
                        <li key={productType.productTypeId} className="productType-item">
                            {editandoId === productType.productTypeId ? (
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
                                        onClick={() => handleAlterarProductType(productType.productTypeId)}
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
                                    <span>{productType.name}</span>
                                    <Botao
                                        onClick={() => {
                                            setEditandoId(productType.productTypeId);
                                            setNovoNome(productType.name); // Preenche o campo de edição com o nome atual
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
                                        onClick={() => handleDeleteProductType(productType.productTypeId)}
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
