import { useEffect, useState } from 'react';
import Botao from '../Botao';
import CampoTexto from '../CampoTexto';
import './EditProductModal.css';
import axios from 'axios';

interface ProductType {
    productTypeId: number;
    name: string;
}

interface Brand {
    brandId: number;
    name: string;
}

interface EditarProdutoModalProps {
    product: {
        productId: number;
        name: string;
        price: number;
        productTypeId: number;
        brandId: number;
    };
    onClose: () => void;
    onSave: (updatedProduct: {
        productId: number;
        name: string;
        price: number;
        productTypeId: number;
        brandId: number;
    }) => void;
  
}

const EditProductModal = ({ product, onClose, onSave,}: EditarProdutoModalProps) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [productTypeId, setProductTypeId] = useState(product.productTypeId.toString());
    const [brandId, setBrandId] = useState(product.brandId.toString());
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const carregarProductTypes = async () => {
            try {
                const response = await axios.get<ProductType[]>(
                    'http://localhost:5124/api/ProductTypes/VerTodosOsTiposDeProduto'
                );
                setProductTypes(response.data);
            } catch (error) {
                console.error('Erro ao carregar tipos de produtos:', error);
            }
        };

        const carregarMarcas = async () => {
            try {
                const response = await axios.get<Brand[]>('http://localhost:5124/api/Brands/VerTodasAsMarcas');
                setBrands(response.data);
            } catch (error) {
                console.error('Erro ao carregar marcas:', error);
            }
        };

        carregarProductTypes();
        carregarMarcas();
    }, []);

    const handleSave = () => {
        onSave({
            productId: product.productId,
            name,
            price,
            productTypeId: parseInt(productTypeId, 10),
            brandId: parseInt(brandId, 10),
        });
    };

    return (
        <div className="editar-produto-modal">
            <div className="modal-content">
                <h2>Editar Produto</h2>
                <CampoTexto
                    label="Nome"
                    identificador="nomeProduto"
                    placeholder="Edite o nome do produto"
                    valor={name}
                    aoAlterado={setName}
                />
                <CampoTexto
                    label="Preço"
                    identificador="precoProduto"
                    placeholder="Edite o nome do produto"
                    valor={price.toString()}
                    aoAlterado={(valor) => setPrice(Number(valor))}
                />
                <select value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
                    <option value="" disabled>
                        Selecione o tipo de produto
                    </option>
                    {productTypes.map((type) => (
                        <option key={type.productTypeId} value={type.productTypeId}>
                            {type.name}
                        </option>
                    ))}
                </select>
                <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                    <option value="" disabled>
                        Selecione a marca
                    </option>
                    {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandId}>
                            {brand.name}
                        </option>
                    ))}
                </select>
                <div className="modal-actions">
                    <Botao 
                        onClick={handleSave}
                        style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            padding: '5px 5px',
                            cursor: 'pointer',
                            margin: '0px'
                        }}
                    >Salvar</Botao>
                    <Botao 
                        onClick={onClose}
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            padding: '5px 5px',
                            cursor: 'pointer',
                            margin: '0px 0px 0px 10px'
                        }} 
                    >Cancelar</Botao>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
