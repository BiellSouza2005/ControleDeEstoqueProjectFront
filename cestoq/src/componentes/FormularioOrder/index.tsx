import React, { useState, useEffect } from 'react';
import './FormularioOrder.css';

interface Client {
    clientId: number;
    name: string;
}

interface Product {
    productId: number;
    name: string;
}

export interface Order {
    orderId: number;
    orderDate: string;
    clientId: number;
    orderItems: {
      productId: number;
      quantity: number;
      unitPrice: number;
    }[];
    orderPayments: {
      amount: number;
      paymentDate: string;
    }[];
  }

interface FormularioPedidoProps {
    clients: Client[];
    products: Product[];
    aOrderRegistred: (pedido: Order) => void; 
    identificadorForm: string;
}

const FormularioOrder = ({ clients, products, identificadorForm, aOrderRegistred: onSubmit }: FormularioPedidoProps) => {
    const [orderDate, setOrderDate] = useState('');
    const [clientId, setClientId] = useState(0);
    const [orderItems, setOrderItems] = useState([
        { productId: 0, quantity: 0, unitPrice: 0 },
    ]);
    const [orderPayments, setOrderPayments] = useState([
        { amount: 0, paymentDate: '' },
    ]);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);

    useEffect(() => {
        // Calcula o total dos itens
        const total = orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        setTotalItems(total);
    }, [orderItems]);

    useEffect(() => {
        // Calcula o total dos pagamentos
        const total = orderPayments.reduce((acc, payment) => acc + payment.amount, 0);
        setTotalPayments(total);
    }, [orderPayments]);

    const handleAddItem = () => {
        setOrderItems([...orderItems, { productId: 0, quantity: 0, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleAddPayment = () => {
        setOrderPayments([...orderPayments, { amount: 0, paymentDate: '' }]);
    };

    const handleRemovePayment = (index: number) => {
        setOrderPayments(orderPayments.filter((_, i) => i !== index));
    };

    const handlePriceChange = (valor: string, index: number, type: 'orderItems' | 'orderPayments') => {
        const formattedValue = valor.replace(/[^0-9.,]/g, '').replace(',', '.');
        const decimalValue = parseFloat(formattedValue);
        if (!isNaN(decimalValue)) {
            if (type === 'orderItems') {
                const updatedItems = [...orderItems];
                updatedItems[index].unitPrice = decimalValue;
                setOrderItems(updatedItems);
            } else if (type === 'orderPayments') {
                const updatedPayments = [...orderPayments];
                updatedPayments[index].amount = decimalValue;
                setOrderPayments(updatedPayments);
            }
        } else {
            if (type === 'orderItems') {
                const updatedItems = [...orderItems];
                updatedItems[index].unitPrice = 0;
                setOrderItems(updatedItems);
            } else if (type === 'orderPayments') {
                const updatedPayments = [...orderPayments];
                updatedPayments[index].amount = 0; 
                setOrderPayments(updatedPayments);
            }
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const valor = e.target.value;
        const formattedValue = valor.replace(/[^0-9.,]/g, '').replace('.', '');
        const intValue = parseInt(formattedValue);
        const updatedItems = [...orderItems];
    
        if (!isNaN(intValue)) {
            updatedItems[index].quantity = intValue;
        } else {
            updatedItems[index].quantity = 0;
        }
    
        setOrderItems(updatedItems);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({
            orderId: 0,
            orderDate,
            clientId,
            orderItems: orderItems,
            orderPayments: orderPayments,
        });
    };

    const isSubmitDisabled = totalItems === 0 || totalPayments === 0 || totalItems !== totalPayments;

    return (
        <section className="formulario-pedido">
            <h2>Cadastrar Pedido</h2>

            <form id={identificadorForm} onSubmit={handleSubmit}>
                <div className="secao-formulario">
                    <div className="campo">
                        <label htmlFor="orderDate">Data do Pedido</label>
                        <input
                            type="date"
                            id="orderDate"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="clientId">Cliente</label>
                        <select
                            id="clientId"
                            value={clientId}
                            onChange={(e) => setClientId(Number(e.target.value))}
                        >
                        <option value="" disabled>
                            Selecione um cliente
                        </option>
                        {clients.map((client) => (
                            <option key={client.clientId} value={client.clientId}>
                                {client.name}
                            </option>
                        ))}
                             
                        </select>
                    </div>
                </div>

                <div>
                    <h3>Itens do Pedido</h3>
                    <table className="tabela-dinamica">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td >
                                        <select className='select-item'
                                            value={item.productId}
                                            onChange={(e) => {
                                                const updatedItems = [...orderItems];
                                                updatedItems[index].productId = Number(e.target.value);
                                                setOrderItems(updatedItems);
                                            }}
                                        >
                                        <option value="" disabled>
                                            Selecione um cliente
                                        </option>
                                        {products.map((product) => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.name}
                                            </option>
                                        ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className='item-input'
                                            value={item.quantity.toString()}
                                            onChange={(e) => handleQuantityChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className='item-input'
                                            value={item.unitPrice.toString()}
                                            onChange={(e) => handlePriceChange(e.target.value, index, 'orderItems')}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => handleRemoveItem(index)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='add-button' type="button" onClick={handleAddItem}>
                        Adicionar Item
                    </button>
                    <p>Total dos Itens: R$ {totalItems.toFixed(2)}</p>
                </div>

                <div>
                    <h3>Pagamentos</h3>
                    <table className="tabela-dinamica">
                        <thead>
                            <tr>
                                <th>Valor</th>
                                <th>Data do Pagamento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderPayments.map((payment, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="number"
                                            value={payment.amount.toString()}
                                            onChange={(e) => handlePriceChange(e.target.value, index, 'orderPayments')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={payment.paymentDate}
                                            onChange={(e) => {
                                                const updatedPayments = [...orderPayments];
                                                updatedPayments[index].paymentDate = e.target.value;
                                                setOrderPayments(updatedPayments);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => handleRemovePayment(index)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='add-button' type="button" onClick={handleAddPayment}>
                        Adicionar Pagamento
                    </button>
                    <p>Total dos Pagamentos: R$ {totalPayments.toFixed(2)}</p>
                </div>

                <div className="botoes-formulario">
                    <button type="submit" className="botao-enviar" disabled={isSubmitDisabled}>
                        Salvar Pedido
                    </button>
                </div>
            </form>
        </section>
    );
};

export default FormularioOrder;
