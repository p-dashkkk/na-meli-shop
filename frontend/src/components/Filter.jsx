import React from 'react';

function Filter({ categories, materials, purposes, onFilterChange, type }) {
    return (
        <div className="filter">
            <h3>Фильтр по категории</h3>
            <select onChange={(e) => onFilterChange('category', e.target.value)}>
                <option value="all">Все</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {type === 'Корабли' && materials.length > 0 && (
                <>
                    <h3>Фильтр по материалу</h3>
                    <select onChange={(e) => onFilterChange('material', e.target.value)}>
                        <option value="all">Все</option>
                        {materials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                    </select>
                </>
            )}

            {type === 'Снаряжение' && purposes.length > 0 && (
                <>
                    <h3>Фильтр по назначению</h3>
                    <select onChange={(e) => onFilterChange('purpose', e.target.value)}>
                        <option value="all">Все</option>
                        {purposes.map(pur => <option key={pur} value={pur}>{pur}</option>)}
                    </select>
                </>
            )}
        </div>
    );
}

export default Filter;