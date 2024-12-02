import { useEffect, useState } from 'react';
import Botao from '../Botao';
import CampoTexto from '../CampoTexto';
import './FormularioProduct.css';
import axios from 'axios';

interface ProductType {
    productTypeId: number;
    name: string;
}

interface Brand {
    brandId: number;
    name: string;
}

interface FormularioProductProps {
    identificadorForm: string;
    aProductRegistered: (product: {
        name: string;
        price: number;
        productTypeId: number;
        brandId: number;
    }) => void;
}

const FormularioProduct = ({ identificadorForm, aProductRegistered }: FormularioProductProps) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [productTypeId, setProductTypeId] = useState<string>(''); 
    const [brandId, setBrandId] = useState<string>(''); 
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]); 
    const [cachedProductTypes, setCachedProductTypes] = useState<ProductType[]>([]);
    const [cachedBrands, setCachedBrands] = useState<Brand[]>([]);

    // Função para carregar os tipos de produtos do backend
    const carregarProductTypes = async () => {
        if (cachedProductTypes.length > 0) {
            setProductTypes(cachedProductTypes);
            return;
        }

        try {
            const response = await axios.get<ProductType[]>(
                'http://localhost:5124/api/ProductTypes/VerTodosOsTiposDeProduto'
            );
            setProductTypes(response.data);
            setCachedProductTypes(response.data); // Atualiza o cache
        } catch (error) {
            console.error('Erro ao carregar tipos de produtos:', error);
        }
    };

    // Função para carregar as marcas do backend
    const carregarMarcas = async () => {
        if (cachedBrands.length > 0) {
            setBrands(cachedBrands);
            return;
        }

        try {
            const response = await axios.get<Brand[]>('http://localhost:5124/api/Brands/VerTodasAsMarcas');
            setBrands(response.data);
            setCachedBrands(response.data); // Atualiza o cache
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    };

    // Carregar os tipos de produtos e marcas ao montar o componente
    useEffect(() => {
        carregarProductTypes();
        carregarMarcas();
    }, []);

    const aoSalvar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
    
        // Validação para garantir que os selects não estejam vazios
        if (!productTypeId || !brandId) {
            alert('Por favor, selecione um tipo de produto e uma marca.');
            return;
        }
    
        // Envia os dados do produto
        aProductRegistered({
            name,
            price,
            productTypeId: parseInt(productTypeId, 10), // Converte para número
            brandId: parseInt(brandId, 10), // Converte para número
        });
    
        // Limpa os campos do formulário
        setName('');
        setPrice(0);
        setProductTypeId(''); // Reseta para string vazia
        setBrandId(''); // Reseta para string vazia
    };
    

    return (
        <section className="formularioProduct">
            <form id={identificadorForm} onSubmit={aoSalvar}>
                <h2>Adicione um Produto</h2>
                <CampoTexto
                    identificador="idProductName"
                    obrigatorio={true}
                    label="Nome do Produto"
                    placeholder="Digite o nome do produto"
                    valor={name}
                    aoAlterado={(valor) => setName(valor)}
                />
                <CampoTexto
                    identificador="idProductPrice"
                    obrigatorio={true}
                    label="Preço do Produto"
                    placeholder="Digite o preço do produto"
                    valor={price.toString()}
                    aoAlterado={(valor) => setPrice(Number(valor))}
                />
                <div className="campo-select">
                    <label htmlFor="productTypeSelect">Tipo de Produto</label>
                    <select
                        id="productTypeSelect"
                        value={productTypeId ?? ''}
                        onChange={(e) => setProductTypeId(e.target.value)}
                    >
                        <option value="" disabled>
                            Selecione um tipo de produto
                        </option>
                        {productTypes.map((type) => (
                            <option key={type.productTypeId} value={type.productTypeId}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="campo-select">
                    <label htmlFor="brandSelect">Marca</label>
                    <select
                        id="brandSelect"
                        value={brandId ?? ''}
                        onChange={(e) => setBrandId(e.target.value)}
                    >
                        <option value="" disabled>
                            Selecione uma marca
                        </option>
                        {brands.map((brand) => (
                            <option key={brand.brandId} value={brand.brandId}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Botao>Criar Produto</Botao>
            </form>
        </section>
    );
};

export default FormularioProduct;
