import React, { useState } from 'react';
import Botao from '../../componentes/Botao';
import './PaymentModal.css';

interface PaymentModalProps {
    orderId: number;
    onClose: () => void;
    onSave: (payment: Payment) => void;
}

interface Payment {
    paymentId?: number;
    orderId: number;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ orderId, onClose, onSave }) => {
    const [amount, setAmount] = useState<number>(0);
    const [paymentDate, setPaymentDate] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    const handleSave = () => {
        const payment: Payment = {
            orderId,
            amount,
            paymentDate: new Date(paymentDate),
            paymentMethod,
        };
        onSave(payment);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Registrar Pagamento</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="amount">Valor:</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            placeholder="Digite o valor"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentDate">Data do Pagamento:</label>
                        <input
                            id="paymentDate"
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Método de Pagamento:</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">Selecione um método</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Boleto">Boleto</option>
                            <option value="Transferência Bancária">Transferência Bancária</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <Botao onClick={onClose} style={{ backgroundColor: 'gray' }}>
                            Cancelar
                        </Botao>
                        <Botao onClick={handleSave} style={{ backgroundColor: 'green' }}>
                            Salvar
                        </Botao>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;