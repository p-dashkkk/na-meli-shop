import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Filter from './components/Filter';
import AuthForm from './components/AuthForm';
import './App.css';
import AdminPanel from './components/AdminPanel';
import {
    getProducts,
    login,
    register,
    updateProductStock,
    getUsers,
    deleteUser
} from './api';

function App() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [filters, setFilters] = useState({ category: 'all', material: 'all', purpose: 'all' });
    const [users, setUsers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const loadProducts = async () => {
        try {
            const res = await getProducts();
            const data =
            Array.isArray(res.data)
                ? res.data
                : res.data?.products || res.data?.data || [];
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров', error);
        }
    };

    useEffect(() => {
        let filtered = [...products];
        
        if (filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category);
        }
        
        if (filters.category === 'Корабли' && filters.material !== 'all') {
            filtered = filtered.filter(p => p.material === filters.material);
        }
        
        if (filters.category === 'Снаряжение' && filters.purpose !== 'all') {
            filtered = filtered.filter(p => p.purpose === filters.purpose);
        }
        
        setFilteredProducts(filtered);
    }, [filters, products]);

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
    };

    const checkout = () => {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        alert('Спасибо за покупку!');
        setCart([]);
    };

    const handleLogin = async (email, password) => {
    try {
        const res = await login({ email, password });

        console.log('LOGIN RESPONSE:', res.data);

        const user = res.data?.user;

        if (!user) {
            alert('Ошибка: сервер не вернул пользователя');
            return;
        }

        setUser(user);

        if (user.role === 'admin') loadUsers();

        alert('Вход выполнен успешно');
    } catch (error) {
        alert('Ошибка входа: ' + (error.response?.data?.error || 'Неверные данные'));
    }
};

    const handleRegister = async (name, email, password, age) => {
        try {
            await register({ name, email, password, age });
            alert('Регистрация успешна! Теперь войдите');
        } catch (error) {
            alert('Ошибка регистрации: ' + (error.response?.data?.error || 'Попробуйте другие данные'));
        }
    };

    const handleToggleStock = async (id, newStatus) => {
        try {
            await updateProductStock(id, newStatus);
            loadProducts();
        } catch (error) {
            alert('Ошибка обновления статуса');
        }
    };

    const getUniqueValues = (field) => {
        return [...new Set(products.map(p => p[field]).filter(v => v))];
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Удалить пользователя?')) return;
        try {
            await deleteUser(id);
            loadUsers();
        } catch (error) {
            alert(error.response?.data?.error || 'Ошибка удаления');
        }
    };

    const categories = ['Корабли', 'Снаряжение'];
    const materials = getUniqueValues('material');
    const purposes = getUniqueValues('purpose');
    const currentCategory = filters.category !== 'all' ? filters.category : null;

    const loadUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
    
    if (selectedProduct) {
        return (
            <div className="app">
                <header>
                    <h1>🏴‍☠️ Магазин «На мели»</h1>
                    <button onClick={() => setSelectedProduct(null)}> ← Вернуться в каталог</button>
                </header>
                <div className="product-page">
                    <img
                        className="product-page-image"
                        src={`http://localhost/БИВТ-24-8_Петрова_Д.С._19_Корабль/pictures/${selectedProduct.image}`}
                        alt={selectedProduct.name}
                    />
                    <div className="product-info">
                        <h2>{selectedProduct.name}</h2>
                        <p className="product-description-full">
                            {selectedProduct.description}
                        </p>
                        <div className="big-price">
                            {selectedProduct.price} ₽
                        </div>
                        <p>
                            <strong>Материал:</strong>{" "}
                            {selectedProduct.material || "—"}
                        </p>
                        <p>
                            <strong>Категория:</strong>{" "}
                            {selectedProduct.category}
                        </p>
                        <p>
                            <strong>Статус:</strong>{" "}
                            {selectedProduct.inStock
                                ? "В наличии"
                                : "Нет в наличии"}
                        </p>
                        {selectedProduct.inStock && user.role !== 'admin' && (
                                <button onClick={() => addToCart(selectedProduct)}>Добавить в корзину</button>
                            )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header>
                <h1>🏴‍☠️ Магазин «На мели»</h1>
                <div className="user-info">
                    <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-role">
                            {user.role === 'admin'
                                ? '⚓ Администратор'
                                : '🛶 Покупатель'}
                        </div>
                    </div>
                </div>
                <button onClick={() => setUser(null)}>Выйти</button>
            </header>

            <div className="main">
                <div className="sidebar">
                    <Filter
                        categories={categories}
                        materials={materials}
                        purposes={purposes}
                        onFilterChange={handleFilterChange}
                        type={currentCategory}
                    />
                    <Cart
                        cart={cart}
                        onRemoveFromCart={removeFromCart}
                        onClearCart={clearCart}
                        onCheckout={checkout}
                    />
                    {user?.role === 'admin' && (<AdminPanel
                        users={users}
                        currentUser={user}
                        onDeleteUser={handleDeleteUser}/>
                    )}
                </div>

                <div className="catalog">
                    <h2>Каталог товаров</h2>
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                isAdmin={user?.role === 'admin'}
                                onToggleStock={handleToggleStock}
                                onViewDetails={setSelectedProduct}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;