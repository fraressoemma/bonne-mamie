import React from 'react';

/**
 * Composant Header luxueux avec navigation
 */
export default function Header({ currentPage, onNavigate }) {
    return (
        <header className="header">
            <div className="header-content">
                <img src="/logo_bibi_header.png" alt="Bibi Cooking" className="header-logo" />
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
