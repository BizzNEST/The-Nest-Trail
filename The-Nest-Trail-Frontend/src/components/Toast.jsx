import { useState, useEffect } from 'react';

const Toast = ({ toast, onRemove, index = 0 }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Stagger removal times for multiple toasts (base 3 seconds + 200ms per toast index)
        const staggeredDelay = 3000 + (index * 200);
        const timer = setTimeout(() => {
            setShow(false);
            // Give a brief moment for any exit animation, then remove
            setTimeout(() => onRemove(toast.id), 100);
        }, staggeredDelay);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove, index]);

    const handleClick = () => {
        setShow(false);
        setTimeout(() => onRemove(toast.id), 100);
    };

    const getToastIcon = (tool) => {
        switch (tool) {
            case 'addItem':
                return '📦';
            case 'removeItem':
                return '📤';
            case 'addMoney':
                return '💰';
            case 'removeMoney':
                return '💸';
            case 'rollDice':
                return '🎲';
            case 'updateStats':
                return '📍';
            default:
                return '⚡';
        }
    };

    const getToastColor = (tool) => {
        switch (tool) {
            case 'addItem':
            case 'addMoney':
                return '#10b981'; // green
            case 'removeItem':
            case 'removeMoney':
                return '#ef4444'; // red
            case 'rollDice':
                return '#3b82f6'; // blue
            case 'updateStats':
                return '#8b5cf6'; // purple
            default:
                return '#6b7280'; // gray
        }
    };

    if (!show || !toast.userReturn) {
        return null;
    }

    return (
        <div
            onClick={handleClick}
            style={{
                backgroundColor: getToastColor(toast.userReturn.tool),
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '200px',
                maxWidth: '320px',
                margin: '8px 0',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto'
            }}
        >
            <div style={{ fontSize: '20px', flexShrink: 0 }}>
                {getToastIcon(toast.userReturn.tool)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>
                    {toast.userReturn.title}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    {toast.userReturn.message}
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, flexShrink: 0 }}>
                ✕
            </div>
        </div>
    );
};

const ToastContainer = ({ toasts, onRemoveToast }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 50000,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}
        >
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onRemove={onRemoveToast}
                    index={index}
                />
            ))}
        </div>
    );
};

export default ToastContainer;