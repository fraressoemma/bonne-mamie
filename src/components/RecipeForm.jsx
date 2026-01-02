import React, { useState } from 'react';
import { addRecipe } from '../services/sheetApi';
import { uploadImage } from '../services/imgbbApi';

const UNITS = [
    'g', 'kg', 'ml', 'L', 'cl',
    'c. à soupe', 'c. à café',
    'pièces', 'tranches',
    'pincée', 'sachet', 'bouquet'
];

/**
 * Formulaire pour déposer une nouvelle recette - Design Luxe
 */
export default function RecipeForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        titre: '',
        auteur: '',
        photo: '', // URL finale de la photo
        etapes: '',
        portions: 4
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [ingredients, setIngredients] = useState([
        { quantite: '', unite: 'g', nom: '' }
    ]);

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState(null);

    // Gestion des champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Gestion du fichier image
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Créer une URL locale pour la prévisualisation
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Gestion des ingrédients
    const handleIngredientChange = (index, field, value) => {
        setIngredients(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addIngredient = () => {
        setIngredients(prev => [...prev, { quantite: '', unite: 'g', nom: '' }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Filtrer les ingrédients vides et convertir les quantités en nombres
            const validIngredients = ingredients
                .filter(ing => ing.nom.trim() !== '')
                .map(ing => ({
                    ...ing,
                    quantite: parseFloat(ing.quantite) || 0
                }));

            if (validIngredients.length === 0) {
                throw new Error('Ajoutez au moins un ingrédient');
            }

            let finalPhotoUrl = formData.photo;

            // Upload de l'image si un fichier est sélectionné
            if (selectedFile) {
                setUploadingImage(true);
                try {
                    finalPhotoUrl = await uploadImage(selectedFile);
                } catch (uploadError) {
                    throw new Error(`Erreur upload photo: ${uploadError.message}`);
                } finally {
                    setUploadingImage(false);
                }
            }

            const recipeData = {
                ...formData,
                photo: finalPhotoUrl,
                ingredients: validIngredients,
                portions: parseInt(formData.portions) || 4
            };

            await addRecipe(recipeData);

            setMessage({ type: 'success', text: 'Recette ajoutée avec succès !' });

            // Reset du formulaire
            setFormData({
                titre: '',
                auteur: '',
                photo: '',
                etapes: '',
                portions: 4
            });
            setIngredients([{ quantite: '', unite: 'g', nom: '' }]);
            setSelectedFile(null);
            setPreviewUrl(null);

            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Erreur: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Nouvelle Recette</h2>

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Titre */}
                <div className="form-group">
                    <label className="form-label" htmlFor="titre">
                        Nom de la recette
                    </label>
                    <input
                        type="text"
                        id="titre"
                        name="titre"
                        className="form-input"
                        value={formData.titre}
                        onChange={handleChange}
                        placeholder="Ex: Tarte aux pommes de Mamie"
                        required
                    />
                </div>

                {/* Auteur */}
                <div className="form-group">
                    <label className="form-label" htmlFor="auteur">
                        Votre nom
                    </label>
                    <input
                        type="text"
                        id="auteur"
                        name="auteur"
                        className="form-input"
                        value={formData.auteur}
                        onChange={handleChange}
                        placeholder="Ex: Mamie Jeanne"
                        required
                    />
                </div>

                {/* Photo Upload */}
                <div className="form-group">
                    <label className="form-label" htmlFor="photo-upload">
                        Photo de la recette
                    </label>

                    {previewUrl && (
                        <div className="image-preview" style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                            <img
                                src={previewUrl}
                                alt="Prévisualisation"
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <div className="file-upload-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label
                            htmlFor="photo-upload"
                            className="btn btn-secondary"
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            {selectedFile ? `📷 Changer la photo (${selectedFile.name.substring(0, 15)}...)` : '📷 Choisir une belle photo'}
                        </label>
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-input"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                        Image hébergée gratuitement par ImgBB (max 32Mo)
                    </small>
                </div>

                {/* Portions */}
                <div className="form-group">
                    <label className="form-label" htmlFor="portions">
                        Nombre de portions
                    </label>
                    <input
                        type="number"
                        id="portions"
                        name="portions"
                        className="form-input"
                        value={formData.portions}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        style={{ width: '120px' }}
                    />
                </div>

                {/* Module Ingrédients */}
                <div className="form-group">
                    <label className="form-label">Ingrédients</label>
                    <div className="ingredients-module">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-row">
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Qté"
                                    value={ingredient.quantite}
                                    onChange={(e) => handleIngredientChange(index, 'quantite', e.target.value)}
                                    min="0"
                                    step="0.1"
                                />
                                <select
                                    className="form-select"
                                    value={ingredient.unite}
                                    onChange={(e) => handleIngredientChange(index, 'unite', e.target.value)}
                                >
                                    {UNITS.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nom de l'ingrédient"
                                    value={ingredient.nom}
                                    onChange={(e) => handleIngredientChange(index, 'nom', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="remove-ingredient-btn"
                                    onClick={() => removeIngredient(index)}
                                    disabled={ingredients.length === 1}
                                    title="Supprimer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-ingredient-btn"
                            onClick={addIngredient}
                        >
                            + Ajouter un ingrédient
                        </button>
                    </div>
                </div>

                {/* Étapes */}
                <div className="form-group">
                    <label className="form-label" htmlFor="etapes">
                        Préparation
                    </label>
                    <textarea
                        id="etapes"
                        name="etapes"
                        className="form-textarea"
                        value={formData.etapes}
                        onChange={handleChange}
                        placeholder="1. Préchauffez le four à 180°C...&#10;2. Mélangez les ingrédients secs...&#10;3. ..."
                        required
                    />
                </div>

                {/* Bouton Submit */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                >
                    {loading ? (
                        <>
                            <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                            {uploadingImage ? 'Envoi de la photo...' : 'Enregistrement...'}
                        </>
                    ) : (
                        <>Enregistrer la recette</>
                    )}
                </button>
            </form>
        </div>
    );
}
