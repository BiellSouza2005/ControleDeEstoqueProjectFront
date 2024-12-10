// FormularioProduct.tsx
import { useState } from 'react';
import Botao from '../Botao';
import CampoTexto from '../CampoTexto';
import './FormularioProduct.css';

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
        quantity: number;
        productTypeId: number;
        brandId: number;
    }) => void;
    productTypes: ProductType[];
    brands: Brand[];
}

const FormularioProduct = ({
    identificadorForm,
    aProductRegistered,
    productTypes,
    brands,
}: FormularioProductProps) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0.0);
    const [quantity, setQuantity] = useState<number>(0);
    const [productTypeId, setProductTypeId] = useState<string>('');
    const [brandId, setBrandId] = useState<string>('');

    const aoSalvar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (!productTypeId || !brandId) {
            alert('Por favor, selecione um tipo de produto e uma marca.');
            return;
        }

        aProductRegistered({
            name,
            price,
            quantity,
            productTypeId: parseInt(productTypeId, 10),
            brandId: parseInt(brandId, 10),
        });

        setName('');
        setPrice(0.0);
        setProductTypeId('');
        setBrandId('');
    };

    const handlePriceChange = (valor: string) => {
        // Permitir apenas números, pontos e vírgulas
        const formattedValue = valor.replace(/[^0-9.,]/g, '').replace(',', '.');
        const decimalValue = parseFloat(formattedValue);
        if (!isNaN(decimalValue)) {
            setPrice(decimalValue);
        } else {
            setPrice(0); // ou qualquer valor padrão que você queira
        }
    };

    const handleQuantityChange = (valor: string) => {
        const formattedValue = valor.replace(/[^0-9.,]/g, '').replace('.', '');
        const intValue = parseInt(formattedValue);
        if (!isNaN(intValue)) {
            setQuantity(intValue);
        } else {
            setQuantity(0); // ou qualquer valor padrão que você queira
        }
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
                    tipo='text'
                />
                <CampoTexto
                    identificador="idProductPrice"
                    obrigatorio={true}
                    label="Preço do Produto"
                    placeholder="Digite o preço do produto"
                    valor={price.toString()}
                    aoAlterado={handlePriceChange}
                    tipo='number'
                />
                <CampoTexto
                    identificador="idProductQuantity"
                    obrigatorio={true}
                    label="Quantidade do Produto"
                    placeholder="Digite a quantidade do produto"
                    valor={quantity.toString()}
                    aoAlterado={handleQuantityChange}
                    tipo='text'
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