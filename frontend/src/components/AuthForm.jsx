import React, { useState } from 'react';

function AuthForm({ onLogin, onRegister }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email, password);
        } else {
            onRegister(name, email, password, age ? parseInt(age) : null);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {!isLogin && (
                    <input
                        type="number"
                        placeholder="Возраст (необязательно)"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                )}
                <button
                    className="main-auth-btn"
                    type="submit"
                >{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
            </form>
            <button
                className="switch-auth-btn"
                onClick={() => setIsLogin(!isLogin)}
            >{isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</button>
        </div>
    );
}

export default AuthForm;