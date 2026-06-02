import React from 'react';

function ProductCard({ product, onAddToCart, isAdmin, onToggleStock }) {
    return (
        <div className="product-card" style={{ opacity: product.inStock ? 1 : 0.6 }}>
            <img
                src={`http://localhost/БИВТ-24-8_Петрова_Д.С._19_Корабль/pictures/${product.image}`} 
                alt={product.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <h3>{product.name}</h3>
            <p className="product-description">
                {product.description}
            </p>
            <p className="product-price">
                {product.price} ₽
            </p>
            <p>{product.inStock ? 'В наличии' : 'Нет в наличии'}</p>
            
            {!isAdmin && product.inStock && (
                <button onClick={() => onAddToCart(product)}>В корзину</button>
            )}
            
            {isAdmin && (
                <button 
                    onClick={() => onToggleStock(product.id, !product.inStock)}
                    style={{ backgroundColor: product.inStock ? 'orange' : 'green' }}
                >
                    {product.inStock ? 'Отметить "Нет в наличии"' : 'Восстановить'}
                </button>
            )}
        </div>
    );
}

export default ProductCard;