import React from 'react';

/**
 * Carte de présentation d'une recette - Design Luxe
 */
export default function RecipeCard({ recipe, onClick }) {
    return (
        <article className="recipe-card" onClick={onClick}>
            <div className="recipe-card-image-container">
                {recipe.photo ? (
                    <img
                        src={recipe.photo}
                        alt={recipe.titre}
                        className="recipe-card-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.recipe-card-image-placeholder').style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="recipe-card-image-placeholder"
                    style={{ display: recipe.photo ? 'none' : 'flex' }}
                >
                    ✦
                </div>
            </div>
            <div className="recipe-card-content">
                <h3 className="recipe-card-title">{recipe.titre}</h3>
                <p className="recipe-card-author">{recipe.auteur}</p>
            </div>
        </article>
    );
}
