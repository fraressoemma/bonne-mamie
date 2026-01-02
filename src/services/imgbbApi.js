/**
 * Service pour gérer l'upload vers ImgBB
 */

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const UPLOAD_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload une image vers ImgBB
 * @param {File} imageFile - Le fichier image à uploader
 * @returns {Promise<string>} L'URL de l'image uploadée
 */
export async function uploadImage(imageFile) {
    if (!API_KEY) {
        throw new Error('Clé API ImgBB manquante');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        // La clé est passée dans l'URL comme dans l'exemple de la doc
        const response = await fetch(`${UPLOAD_URL}?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur upload: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error?.message || 'Erreur inconnue lors de l\'upload');
        }
    } catch (error) {
        console.error('Erreur Service ImgBB:', error);
        throw error;
    }
}
