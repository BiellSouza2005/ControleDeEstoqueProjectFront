import React from 'react';
import './TableProductModal.css';

interface Product {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    brandId: number;
    productTypeId: number;
}

interface TableProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
}

const TableProductModal: React.FC<TableProductModalProps> = ({ isOpen, onClose, products }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Produtos do pedido</h2>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.productId}>
                                <td>{product.productId}</td>
                                <td>{product.name}</td>
                                <td>{product.price.toFixed(2)}</td>
                                <td>{product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default TableProductModal;