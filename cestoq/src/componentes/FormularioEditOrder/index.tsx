import { useState } from 'react';
import './FormularioEditOrder.css';

interface Client {
    clientId: number;
    name: string;
}

interface Product {
    productId: number;
    name: string;
}

interface Order {
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

interface FormularioEditOrderProps {
    order: Order;
    clients: Client[];
    products: Product[];
    onSubmit: (updatedOrder: Order) => void;
    onCancel: () => void;
}

const FormularioEditOrder = ({ order, clients, products, onSubmit, onCancel }: FormularioEditOrderProps) => {
    const [orderDate, setOrderDate] = useState(order.orderDate);
    const [clientId, setClientId] = useState(order.clientId);
    const [orderItems, setOrderItems] = useState(order.orderItems);
    const [orderPayments, setOrderPayments] = useState(order.orderPayments);
    //const [orderPaymentsDate, setOrderPaymentDate] = useState(order.orderPayments);




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

    const handleItemChange = (index: number, field: keyof Order['orderItems'][0], value: number | string) => {
        const updatedItems = [...orderItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setOrderItems(updatedItems);
    };

    const handlePaymentChange = (index: number, field: keyof Order['orderPayments'][0], value: number | string) => {
        const updatedPayments = [...orderPayments];
        updatedPayments[index] = { ...updatedPayments[index], [field]: value };
        setOrderPayments(updatedPayments);
    };

    const formattedOrderDate = new Date(orderDate).toISOString().split('T')[0];

    const handleOrderPaymentDate = (paymentDate: string) => {

        if (paymentDate == '' ) {
            return;
        }
        
        const formattedOrderPaymentDate = new Date(paymentDate).toISOString().split('T')[0]
            

        return formattedOrderPaymentDate;
    };
    
    const handleSubmit = () => {
        onSubmit({
            ...order,
            orderDate,
            clientId,
            orderItems,
            orderPayments,
        });
    };
    
    return (
        <div className='edit-order-modal'>
            <form className="modal-content" onSubmit={handleSubmit}>
                <h2>Editar Pedido N°{order.orderId}</h2>

                <div className="campo">
                    <label htmlFor="orderDate">Data do Pedido:</label>
                    <input
                        className='order-date'
                        type="date"
                        id="orderDate"
                        value={formattedOrderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="clientId">Cliente:</label>
                    <select
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(Number(e.target.value))}
                    >
                        {clients.map((client) => (
                            <option key={client.clientId} value={client.clientId}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3>Itens do Pedido</h3>

                    <table className="tabela-dinamica">
                        <thead>
                            <tr>  
                                <th>Produto</th>
                                <th>Preço Unitário</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td >
                                        <select
                                            value={item.productId}
                                            onChange={(e) =>
                                                handleItemChange(index, 'productId', Number(e.target.value))
                                            }
                                        >
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
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(index, 'quantity', Number(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                handleItemChange(index, 'unitPrice', parseFloat(e.target.value))
                                            }
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
                    <button className='button-add' type="button" onClick={handleAddItem}>
                        Adicionar Item
                    </button>
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
                                            value={payment.amount}
                                            onChange={(e) =>
                                                handlePaymentChange(index, 'amount', parseFloat(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={(handleOrderPaymentDate(payment.paymentDate)) }
                                            onChange={(e) =>
                                                handlePaymentChange(index, 'paymentDate', e.target.value)
                                            }
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
                    <button className="button-add" type="button" onClick={handleAddPayment}>
                        Adicionar Pagamento
                    </button>
                </div>
                <div>
                    <button className="button-salvar" type="button" onClick={handleSubmit}>Salvar</button>
                    <button className="button-cancelar" type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditOrder;
