import React, { useState, useMemo } from 'react';

/**
 * Vue détaillée d'une recette avec calculateur de portions - Design Luxe
 */
export default function RecipeDetail({ recipe, onBack }) {
    const [portions, setPortions] = useState(recipe.portions || 4);

    // Ratio pour le calcul des quantités
    const ratio = useMemo(() => {
        return portions / (recipe.portions || 4);
    }, [portions, recipe.portions]);

    // Formater une quantité (éviter les décimales inutiles)
    const formatQuantity = (qty) => {
        const calculated = qty * ratio;
        if (calculated === Math.floor(calculated)) {
            return calculated;
        }
        return calculated.toFixed(1).replace(/\.0$/, '');
    };

    const decreasePortions = () => {
        if (portions > 1) setPortions(p => p - 1);
    };

    const increasePortions = () => {
        if (portions < 50) setPortions(p => p + 1);
    };

    return (
        <div className="container fade-in">
            <button className="back-btn" onClick={onBack}>
                Retour à la collection
            </button>

            <article className="recipe-detail">
                {/* En-tête avec image */}
                <header className="recipe-detail-header">
                    {recipe.photo ? (
                        <img
                            src={recipe.photo}
                            alt={recipe.titre}
                            className="recipe-detail-image"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className="recipe-detail-image-placeholder"
                        style={{ display: recipe.photo ? 'none' : 'flex' }}
                    >
                        ✦
                    </div>
                    <div className="recipe-detail-image-overlay" />
                </header>

                {/* Corps de la recette */}
                <div className="recipe-detail-body">
                    <h1 className="recipe-detail-title">{recipe.titre}</h1>

                    <div className="recipe-detail-meta">
                        <span className="recipe-detail-author">
                            Par {recipe.auteur}
                        </span>

                        {/* Calculateur de portions */}
                        <div className="portion-calculator">
                            <button
                                className="portion-btn"
                                onClick={decreasePortions}
                                disabled={portions <= 1}
                                aria-label="Diminuer les portions"
                            >
                                −
                            </button>
                            <span className="portion-text">
                                {portions} {portions > 1 ? 'personnes' : 'personne'}
                            </span>
                            <button
                                className="portion-btn"
                                onClick={increasePortions}
                                disabled={portions >= 50}
                                aria-label="Augmenter les portions"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Liste des ingrédients */}
                    <section className="ingredients-section">
                        <h3 className="section-title">Ingrédients</h3>
                        <ul className="ingredients-list">
                            {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                                <li key={index} className="ingredient-item">
                                    <span className="ingredient-qty">
                                        {formatQuantity(ing.quantite)} {ing.unite}
                                    </span>
                                    <span className="ingredient-name">{ing.nom}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Étapes de préparation */}
                    <section className="steps-section">
                        <h3>Préparation</h3>
                        <div className="steps-content">
                            {recipe.etapes}
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
