const Modal = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                    {title}
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--fg)', fontSize: '0.875rem', lineHeight: '1.6' }}>{message}</p>
                </div>
                <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1.5rem' }}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
