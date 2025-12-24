import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import { getRecipes } from './services/sheetApi';

/**
 * Application Bibi Cooking - Design Luxe & Élégant
 */
export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les recettes au démarrage
    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRecipes();
            setRecipes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Navigation
    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSelectedRecipe(null);
    };

    // Voir une recette
    const handleViewRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setCurrentPage('detail');
    };

    // Retour à la liste
    const handleBack = () => {
        setSelectedRecipe(null);
        setCurrentPage('home');
    };

    // Après ajout d'une recette
    const handleRecipeAdded = () => {
        loadRecipes();
        setCurrentPage('home');
    };

    // Hero Section Component
    const HeroSection = () => (
        <section className="hero-section">
            <div className="hero-background" />
            <div className="hero-overlay" />
            <div className="hero-content">
                <p className="hero-subtitle">Recettes de Famille</p>
                <h1 className="hero-title">Bibi Cooking</h1>
                <p className="hero-description">
                    Un précieux héritage culinaire transmis de génération en génération.
                    Découvrez les recettes qui ont bercé notre famille.
                </p>
            </div>
        </section>
    );

    // Rendu conditionnel des pages
    const renderPage = () => {
        // Page détail d'une recette
        if (currentPage === 'detail' && selectedRecipe) {
            return (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onBack={handleBack}
                />
            );
        }

        // Page d'ajout de recette
        if (currentPage === 'add') {
            return (
                <div className="container fade-in">
                    <RecipeForm onSuccess={handleRecipeAdded} />
                </div>
            );
        }

        // Page d'accueil - Liste des recettes
        return (
            <>
                <HeroSection />
                <div className="container">
                    <h2 className="page-title">Notre Collection</h2>

                    {loading && (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <span className="loading-text">Chargement des recettes...</span>
                        </div>
                    )}

                    {error && (
                        <div className="message message-error">
                            Erreur: {error}
                            <button
                                className="btn btn-secondary"
                                onClick={loadRecipes}
                                style={{ marginLeft: '1rem' }}
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {!loading && !error && recipes.length === 0 && (
                        <div className="empty-state fade-in">
                            <div className="empty-state-icon">✦</div>
                            <h3 className="empty-state-title">La collection est vide</h3>
                            <p className="empty-state-text">
                                Commencez par ajouter la première recette de famille.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleNavigate('add')}
                            >
                                Ajouter une recette
                            </button>
                        </div>
                    )}

                    {!loading && !error && recipes.length > 0 && (
                        <div className="recipes-grid fade-in">
                            {recipes.map(recipe => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onClick={() => handleViewRecipe(recipe)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="main">
                {renderPage()}
            </main>
            <footer className="footer">
                <p className="footer-text">
                    Bibi Cooking — Recettes de famille avec amour
                </p>
            </footer>
        </>
    );
}
