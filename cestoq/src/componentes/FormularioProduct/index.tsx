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
    const [price, setPrice] = useState<number>(0);
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
            productTypeId: parseInt(productTypeId, 10),
            brandId: parseInt(brandId, 10),
        });

        setName('');
        setPrice(0);
        setProductTypeId('');
        setBrandId('');
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