/**
 * Service API pour Google Sheets via Sheet.best
 */

const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

/**
 * Récupère toutes les recettes depuis Google Sheets
 * @returns {Promise<Array>} Liste des recettes
 */
export async function getRecipes() {
    if (!SHEET_URL) {
        console.warn('VITE_GOOGLE_SHEET_URL non configurée. Utilisation des données de démonstration.');
        return getDemoRecipes();
    }

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Parse les ingrédients JSON pour chaque recette
        return data.map(recipe => ({
            ...recipe,
            ingredients: parseIngredients(recipe.ingredients),
            portions: parseInt(recipe.portions) || 4
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error);
        throw error;
    }
}

/**
 * Ajoute une nouvelle recette dans Google Sheets
 * @param {Object} recipe - La recette à ajouter
 * @returns {Promise<Object>} La recette créée
 */
export async function addRecipe(recipe) {
    if (!SHEET_URL) {
        console.warn('VITE_GOOGLE_SHEET_URL non configurée. Simulation d\'ajout.');
        return { ...recipe, id: Date.now().toString() };
    }

    try {
        const recipeData = {
            id: Date.now().toString(),
            titre: recipe.titre,
            auteur: recipe.auteur,
            photo: recipe.photo || '',
            ingredients: JSON.stringify(recipe.ingredients),
            etapes: recipe.etapes,
            portions: recipe.portions.toString(),
            createdAt: new Date().toISOString()
        };

        const response = await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la recette:', error);
        throw error;
    }
}

/**
 * Parse une chaîne JSON d'ingrédients en tableau
 * @param {string} ingredientsStr - La chaîne JSON
 * @returns {Array} Le tableau d'ingrédients
 */
function parseIngredients(ingredientsStr) {
    if (!ingredientsStr) return [];

    try {
        const parsed = JSON.parse(ingredientsStr);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Erreur parsing ingrédients:', error);
        return [];
    }
}

/**
 * Données de démonstration quand l'API n'est pas configurée
 */
function getDemoRecipes() {
    return [
        {
            id: '1',
            titre: 'Tarte aux Pommes de Mamie',
            auteur: 'Mamie Jeanne',
            photo: '',
            ingredients: [
                { quantite: 6, unite: 'pièces', nom: 'Pommes Golden' },
                { quantite: 250, unite: 'g', nom: 'Farine' },
                { quantite: 125, unite: 'g', nom: 'Beurre' },
                { quantite: 100, unite: 'g', nom: 'Sucre' },
                { quantite: 1, unite: 'pincée', nom: 'Sel' },
                { quantite: 1, unite: 'sachet', nom: 'Sucre vanillé' }
            ],
            etapes: `1. Préparez la pâte : mélangez la farine, le beurre mou, le sucre et le sel jusqu'à obtenir une texture sableuse.

2. Ajoutez un peu d'eau froide et formez une boule. Laissez reposer 30 minutes au frais.

3. Préchauffez le four à 180°C.

4. Étalez la pâte et garnissez un moule à tarte beurré.

5. Épluchez et coupez les pommes en fines tranches.

6. Disposez les pommes en rosace sur la pâte.

7. Saupoudrez de sucre vanillé et enfournez 35-40 minutes.

8. Servez tiède avec une boule de glace vanille !`,
            portions: 8,
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            titre: 'Blanquette de Veau Traditionnelle',
            auteur: 'Papi Maurice',
            photo: '',
            ingredients: [
                { quantite: 1.2, unite: 'kg', nom: 'Épaule de veau' },
                { quantite: 2, unite: 'pièces', nom: 'Carottes' },
                { quantite: 1, unite: 'pièce', nom: 'Poireau' },
                { quantite: 200, unite: 'g', nom: 'Champignons de Paris' },
                { quantite: 200, unite: 'ml', nom: 'Crème fraîche' },
                { quantite: 2, unite: 'pièces', nom: 'Jaunes d\'œufs' },
                { quantite: 1, unite: 'bouquet', nom: 'Bouquet garni' }
            ],
            etapes: `1. Découpez le veau en gros cubes et faites-le blanchir 5 minutes dans l'eau bouillante.

2. Égouttez et rincez la viande. Remettez-la dans une cocotte avec de l'eau froide.

3. Ajoutez les carottes, le poireau, le bouquet garni. Salez légèrement.

4. Laissez mijoter à feu doux pendant 1h30.

5. Faites sauter les champignons à part.

6. Préparez la sauce : mélangez les jaunes d'œufs avec la crème.

7. Retirez la viande, filtrez le bouillon et incorporez la liaison crème-œufs hors du feu.

8. Servez la viande nappée de sauce avec du riz basmati.`,
            portions: 6,
            createdAt: '2024-02-20'
        },
        {
            id: '3',
            titre: 'Clafoutis aux Cerises',
            auteur: 'Tante Marie',
            photo: '',
            ingredients: [
                { quantite: 500, unite: 'g', nom: 'Cerises fraîches' },
                { quantite: 100, unite: 'g', nom: 'Farine' },
                { quantite: 100, unite: 'g', nom: 'Sucre' },
                { quantite: 3, unite: 'pièces', nom: 'Œufs' },
                { quantite: 250, unite: 'ml', nom: 'Lait entier' },
                { quantite: 1, unite: 'c. à soupe', nom: 'Extrait de vanille' }
            ],
            etapes: `1. Préchauffez le four à 180°C.

2. Lavez et équeutez les cerises (gardez les noyaux pour plus de saveur).

3. Battez les œufs avec le sucre jusqu'à blanchiment.

4. Incorporez la farine tamisée, puis le lait progressivement.

5. Ajoutez l'extrait de vanille.

6. Beurrez un plat à gratin et disposez les cerises.

7. Versez l'appareil par-dessus.

8. Enfournez 40-45 minutes jusqu'à ce que le dessus soit doré.

9. Saupoudrez de sucre glace avant de servir.`,
            portions: 6,
            createdAt: '2024-03-10'
        }
    ];
}
