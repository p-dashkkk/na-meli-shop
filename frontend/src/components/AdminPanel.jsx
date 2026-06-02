import React from 'react';

function AdminPanel({
    users,
    currentUser,
    onDeleteUser
}) {
    return (
        <div className="admin-panel">
            <h2>⚓ Пользователи</h2>

            {users.map(user => (
                <div key={user.id} className="admin-user-card">
                    <div>
                        <div className="admin-user-name">
                            {user.name}
                        </div>
                        <div className="admin-user-email">
                            {user.email}
                        </div>
                        <div className="admin-user-role">
                            {user.role}
                        </div>
                    </div>

                    {user.id !== currentUser.id && (
                        <button onClick={() => onDeleteUser(user.id)}>Удалить</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AdminPanel;