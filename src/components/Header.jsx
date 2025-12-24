import React from 'react';

/**
 * Composant Header luxueux avec navigation
 */
export default function Header({ currentPage, onNavigate }) {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">Bibi Cooking</h1>
                <nav className="nav">
                    <button
                        className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        <span className="nav-icon">✦</span>
                        Nos recettes
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'add' ? 'active' : ''}`}
                        onClick={() => onNavigate('add')}
                    >
                        <span className="nav-icon">+</span>
                        Nouvelle Recette
                    </button>
                </nav>
            </div>
        </header>
    );
}
