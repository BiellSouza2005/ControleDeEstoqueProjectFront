import React, { useState } from 'react';
import Botao from './../Botao';
import './ProductModal.css';

interface Product {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    brandId: number;
    productTypeId: number;
}

interface ProductModalProps {
    product: Product;
    onSave: (updatedProduct: Product) => void;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
    const [updatedProduct, setUpdatedProduct] = useState<Product>({ ...product });

    const handleChange = (field: keyof Product, value: unknown) => {
        setUpdatedProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(updatedProduct);
    };

    return (
        <div className="edit-product-modal">
            <div className="modal-content">
                <h2>Editar Produto</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                        Nome:
                        <input
                            type="text"
                            value={updatedProduct.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </label>
                    <label>
                        Preço:
                        <input
                            type="number"
                            value={updatedProduct.price}
                            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                        />
                    </label>
                    <label>
                        Quantidade:
                        <input
                            type="number"
                            value={updatedProduct.quantity}
                            onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
                        />
                    </label>
                    <label>
                        ID da Marca:
                        <input
                            type="number"
                            value={updatedProduct.brandId}
                            onChange={(e) => handleChange('brandId', parseInt(e.target.value, 10))}
                        />
                    </label>
                    <label>
                        Tipo de Produto:
                        <input
                            type="number"
                            value={updatedProduct.productTypeId}
                            onChange={(e) => handleChange('productTypeId', parseInt(e.target.value, 10))}
                        />
                    </label>
                </form>
                <div className="modal-actions">
                    <Botao onClick={handleSave}>Salvar</Botao>
                    <Botao onClick={onClose}>Cancelar</Botao>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
