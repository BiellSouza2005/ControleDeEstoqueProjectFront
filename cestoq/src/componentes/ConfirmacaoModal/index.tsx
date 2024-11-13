import React from 'react';
import './ConfirmacaoModal.css';

interface ConfirmacaoModalProps {
    mensagem: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

const ConfirmacaoModal: React.FC<ConfirmacaoModalProps> = ({ mensagem, onConfirmar, onCancelar }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <p>{mensagem}</p>
                <div className="modal-actions">
                    <button onClick={onConfirmar} className="confirmar-btn">Confirmar</button>
                    <button onClick={onCancelar} className="cancelar-btn">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacaoModal;
