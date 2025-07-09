// Utility functions for handling image aspect ratios and card dimensions

// Standard trading card aspect ratio (2.5:3.5)
export const CARD_ASPECT_RATIO = 2.5 / 3.5

// Standard card dimensions
export const CARD_WIDTH = 2.5
export const CARD_HEIGHT = 3.5

/**
 * Calculate proper card dimensions while maintaining aspect ratio
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {number} maxWidth - Maximum card width
 * @param {number} maxHeight - Maximum card height
 * @returns {Object} - { width, height } in 3D units
 */
export function calculateCardDimensions(
	imageWidth,
	imageHeight,
	maxWidth = CARD_WIDTH,
	maxHeight = CARD_HEIGHT
) {
	const imageAspectRatio = imageWidth / imageHeight
	const cardAspectRatio = maxWidth / maxHeight

	let width, height

	if (imageAspectRatio > cardAspectRatio) {
		// Image is wider than card aspect ratio
		width = maxWidth
		height = maxWidth / imageAspectRatio
	} else {
		// Image is taller than card aspect ratio
		height = maxHeight
		width = maxHeight * imageAspectRatio
	}

	return { width, height }
}

/**
 * Create a texture with proper aspect ratio handling
 * @param {string} imageUrl - URL of the image
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails to load
 * @returns {THREE.Texture} - Three.js texture
 */
export function createTextureWithAspectRatio(
	imageUrl,
	onLoad = null,
	onError = null
) {
	const texture = new THREE.TextureLoader().load(
		imageUrl,
		onLoad,
		undefined,
		onError
	)

	// Set texture properties for better rendering
	texture.wrapS = THREE.ClampToEdgeWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping
	texture.minFilter = THREE.LinearFilter
	texture.magFilter = THREE.LinearFilter

	return texture
}

/**
 * Get standardized card dimensions
 * @param {string} cardType - Type of card ('standard', 'wide', 'tall')
 * @returns {Object} - { width, height } in 3D units
 */
export function getStandardCardDimensions(cardType = 'standard') {
	switch (cardType) {
		case 'wide':
			return { width: 3.0, height: 2.1 }
		case 'tall':
			return { width: 2.1, height: 3.0 }
		case 'standard':
		default:
			return { width: CARD_WIDTH, height: CARD_HEIGHT }
	}
}
