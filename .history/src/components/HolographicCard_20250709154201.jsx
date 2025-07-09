'use client'
import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import Title from './Title'
import Class from './Class'

// Standard trading card aspect ratio (2.5:3.5)
const CARD_ASPECT_RATIO = 2.5 / 3.5

export default function HolographicCard({
	title = 'Card Title',
	description = 'Card description goes here',
	imageUrl = null,
	hologramColor = [0.2, 0.8, 1.0],
	hologramOpacity = 0.6,
	titleColor = 'rgba(0,0,0,0.7)',
	titleTextColor = 'white',
	classText = 'Warrior',
	classColor = 'rgba(0,0,0,0.7)',
	classTextColor = 'white',
	onClick = null,
	onHover = null,
	width = 2.5,
	height = 3.5,
	cornerRadius = 0.15,
	...props
}) {
	const cardRef = useRef()
	const meshRef = useRef()
	const glowRef = useRef()
	const [hovered, setHovered] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [cardTexture, setCardTexture] = useState(null)

	// Handle texture loading in useEffect
	useEffect(() => {
		if (imageUrl) {
			console.log('Loading texture from:', imageUrl)
			const texture = new THREE.TextureLoader().load(
				imageUrl,
				() => {
					console.log('Texture loaded successfully:', imageUrl)
					// Set texture properties for better rendering
					texture.wrapS = THREE.ClampToEdgeWrapping
					texture.wrapT = THREE.ClampToEdgeWrapping
					texture.minFilter = THREE.LinearFilter
					texture.magFilter = THREE.LinearFilter

					// Ensure the texture covers the entire card area
					texture.repeat.set(1, 1)
					texture.offset.set(0, 0)

					setImageLoaded(true)
				},
				undefined,
				(error) => {
					console.error('Failed to load texture:', imageUrl, error)
					setImageLoaded(false)
				}
			)

			setCardTexture(texture)
		} else {
			// Create a procedural texture
			const canvas = document.createElement('canvas')
			canvas.width = 512
			canvas.height = 512
			const ctx = canvas.getContext('2d')

			// Create a gradient background
			const gradient = ctx.createLinearGradient(0, 0, 512, 512)
			gradient.addColorStop(0, '#1a1a2e')
			gradient.addColorStop(0.5, '#16213e')
			gradient.addColorStop(1, '#0f3460')

			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, 512, 512)

			// Add some card-like elements
			ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
			ctx.fillRect(20, 20, 472, 472)

			// Add a subtle pattern
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
			ctx.lineWidth = 1
			for (let i = 0; i < 512; i += 20) {
				ctx.beginPath()
				ctx.moveTo(i, 0)
				ctx.lineTo(i, 512)
				ctx.stroke()
			}

			const texture = new THREE.CanvasTexture(canvas)
			texture.wrapS = THREE.ClampToEdgeWrapping
			texture.wrapT = THREE.ClampToEdgeWrapping
			setCardTexture(texture)
			setImageLoaded(true)
		}

		// Cleanup function
		return () => {
			if (cardTexture) {
				cardTexture.dispose()
			}
		}
	}, [imageUrl])

	// Create rounded rectangle geometry
	const roundedRectGeometry = useMemo(() => {
		const shape = new THREE.Shape()
		const x = -width / 2
		const y = -height / 2
		const w = width
		const h = height
		const r = cornerRadius

		// Create rounded rectangle path
		shape.moveTo(x + r, y)
		shape.lineTo(x + w - r, y)
		shape.quadraticCurveTo(x + w, y, x + w, y + r)
		shape.lineTo(x + w, y + h - r)
		shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
		shape.lineTo(x + r, y + h)
		shape.quadraticCurveTo(x, y + h, x, y + h - r)
		shape.lineTo(x, y + r)
		shape.quadraticCurveTo(x, y, x + r, y)

		const geometry = new THREE.ShapeGeometry(shape)
		return geometry
	}, [width, height, cornerRadius])

	// Create glow geometry (slightly larger rounded rectangle)
	const glowGeometry = useMemo(() => {
		const shape = new THREE.Shape()
		const x = -(width + 0.2) / 2
		const y = -(height + 0.2) / 2
		const w = width + 0.2
		const h = height + 0.2
		const r = cornerRadius + 0.05

		shape.moveTo(x + r, y)
		shape.lineTo(x + w - r, y)
		shape.quadraticCurveTo(x + w, y, x + w, y + r)
		shape.lineTo(x + w, y + h - r)
		shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
		shape.lineTo(x + r, y + h)
		shape.quadraticCurveTo(x, y + h, x, y + h - r)
		shape.lineTo(x, y + r)
		shape.quadraticCurveTo(x, y, x + r, y)

		const geometry = new THREE.ShapeGeometry(shape)
		return geometry
	}, [width, height, cornerRadius])

	// Create holographic material
	const holographicMaterial = useMemo(() => {
		if (!cardTexture) return null

		const material = new THREE.MeshStandardMaterial({
			map: cardTexture,
			transparent: true,
			opacity: 0.9,
			metalness: 0.8,
			roughness: 0.2,
			emissive: new THREE.Color(hologramColor),
			emissiveIntensity: 0,
		})

		return material
	}, [cardTexture, hologramColor])

	// Create glow material
	const glowMaterial = useMemo(() => {
		return new THREE.MeshBasicMaterial({
			color: hologramColor,
			transparent: true,
			opacity: 0.1,
		})
	}, [hologramColor])

	// GSAP animations
	useEffect(() => {
		if (!cardRef.current || !holographicMaterial) return

		const card = cardRef.current
		const glow = glowRef.current

		if (hovered) {
			// Hover animations - animate the individual card
			gsap.to(card.rotation, {
				y: 0.15,
				x: 0.05,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(card.scale, {
				x: 1.08,
				y: 1.08,
				z: 1.08,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(glowMaterial, {
				opacity: 0.4,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(holographicMaterial, {
				emissiveIntensity: 0.3,
				duration: 0.3,
				ease: 'power2.out',
			})
		} else {
			// Reset animations
			gsap.to(card.rotation, {
				y: 0,
				x: 0,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(card.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(glowMaterial, {
				opacity: 0.05,
				duration: 0.3,
				ease: 'power2.out',
			})

			gsap.to(holographicMaterial, {
				emissiveIntensity: 0,
				duration: 0.3,
				ease: 'power2.out',
			})
		}
	}, [hovered, glowMaterial, holographicMaterial])

	// Animation loop for holographic effect
	useFrame((state) => {
		if (hovered && holographicMaterial) {
			const time = state.clock.elapsedTime
			const hologramIntensity =
				(Math.sin(time * 3) * 0.5 + 0.5) * 0.3 + 0.2
			holographicMaterial.emissiveIntensity = hologramIntensity
		}
	})

	// Handle hover effects
	const handlePointerOver = (event) => {
		event.stopPropagation()
		setHovered(true)
		if (onHover) onHover(true)
	}

	const handlePointerOut = (event) => {
		event.stopPropagation()
		setHovered(false)
		if (onHover) onHover(false)
	}

	const handleClick = (event) => {
		event.stopPropagation()
		if (onClick) onClick()
	}

	// Don't render until texture is loaded
	if (!cardTexture || !holographicMaterial) {
		console.log('Waiting for texture to load:', imageUrl)
		return null
	}

	return (
		<group ref={cardRef} {...props}>
			{/* Glow effect behind card */}
			<mesh ref={glowRef} position={[0, 0, -0.01]}>
				<primitive object={glowGeometry} />
				<primitive object={glowMaterial} />
			</mesh>

			{/* Main card mesh with text overlay */}
			<group>
				{/* Invisible interaction plane for better hover detection */}
				<mesh
					position={[0, 0, 0.01]}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					onClick={handleClick}
					onPointerMove={(event) => {
						// Ensure hover state is maintained during pointer movement
						if (!hovered) {
							setHovered(true)
							if (onHover) onHover(true)
						}
					}}
				>
					<planeGeometry args={[width, height]} />
					<meshBasicMaterial transparent opacity={0} />
				</mesh>

				{/* Visual card mesh with text */}
				<group ref={meshRef}>
					{/* Background image plane */}
					<mesh>
						<primitive object={roundedRectGeometry} />
						<primitive object={holographicMaterial} />
					</mesh>

					{/* Title component */}
					<Title
						text={title}
						color={titleTextColor}
						backgroundColor={titleColor}
						position={[0, height * 0.458, 0.02]}
						width={width}
						height={height}
					/>

					{/* Class component */}
					<Class
						text={classText}
						color={classTextColor}
						backgroundColor={classColor}
						position={[0, -0.45, 0.02]}
						width={width}
						height={height}
					/>

					{/* Description background */}
					<mesh position={[0, -height * 0.25, 0.04]}>
						<planeGeometry args={[width, 0.4]} />
						<meshBasicMaterial
							color='white'
							transparent
							opacity={0.9}
						/>
					</mesh>

					{/* Description text */}
					<Text
						position={[0, -height * 0.25, 0.05]}
						fontSize={0.1}
						color='black'
						anchorX='center'
						anchorY='middle'
						maxWidth={width}
						textAlign='center'
						outlineWidth={0.015}
						outlineColor='white'
					>
						{description}
					</Text>
				</group>
			</group>
		</group>
	)
}
