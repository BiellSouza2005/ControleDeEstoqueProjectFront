import './TablePaymentModal.css';


interface TablePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    payments: { amount: number; paymentDate: string; }[];
}

const TablePaymentModal: React.FC<TablePaymentModalProps> = ({ isOpen, onClose, payments }) => {



    if (!isOpen) {
        return null;
    }

    const handleOrderPaymentDate = (paymentDate: string) => {

        if (paymentDate == '' ) {
            return;
        }
        
        const formattedOrderPaymentDate = new Date(paymentDate).toISOString().split('T')[0]
            

        return formattedOrderPaymentDate;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Pagamentos do pedido</h2>
                <table className="payment-table">
                        <thead>
                            <tr>
                                <th>Valor</th>
                                <th>Data do Pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>
                                        R${payment.amount}
                                    </td>
                                    <td>
                                           {(handleOrderPaymentDate(payment.paymentDate))}
                                    </td>
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

export default TablePaymentModal;