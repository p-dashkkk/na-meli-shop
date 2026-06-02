import React from 'react';

function Cart({ cart, onRemoveFromCart, onClearCart, onCheckout }) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cart.length === 0) {
        return <p>Корзина пуста</p>;
    }

    return (
        <div className="cart">
            <h2>Корзина</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.price} ₽
                        <button onClick={() => onRemoveFromCart(index)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <div className="cart-total">
                    Итого: {total} ₽
                </div>

                <div className="cart-actions">
                    <button
                        className="cart-clear-btn"
                        onClick={onClearCart}
                    >
                        Очистить
                    </button>

                    <button
                        className="cart-pay-btn"
                        onClick={onCheckout}
                    >
                        Оплатить
                    </button>
                </div>
        </div>
    );
}

export default Cart;