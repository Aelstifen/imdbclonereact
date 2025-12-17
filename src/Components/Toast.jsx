import React from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="toast-close-btn">&times;</button>
        </div>
    );
};

export default Toast;