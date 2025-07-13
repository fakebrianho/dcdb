import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import HolographicCard from './components/HolographicCard'
import { Environment } from '@react-three/drei'
import { useGameEngine } from './hooks/useGameEngine'
import HeroSelection from './components/HeroSelection'
import DebugOverlay from './components/DebugOverlay'

// Helper function to get player display name (same as in useGameEngine)
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

function App() {
	const { playerTurn, players, phase, selectedHeroes } = useGameEngine()

	const handleCardClick = (cardId) => {
		console.log(`Card ${cardId} clicked!`)
	}

	const handleCardHover = (isHovered, cardId) => {
		console.log(`Card ${cardId} hover: ${isHovered}`)
	}

	// Get current player info
	const currentPlayer =
		players.length > 0 && playerTurn < players.length
			? players[playerTurn]
			: null

	return (
		<>
			{/* Debug Overlay */}
			<DebugOverlay />

			{/* Hero Selection Overlay */}
			<HeroSelection />

			{/* Turn indicator overlay - only show during gameplay */}
			{phase === 'gameplay' && currentPlayer && (
				<div
					style={{
						position: 'fixed',
						top: '20px',
						left: '50%',
						transform: 'translateX(-50%)',
						background: 'rgba(0, 0, 0, 0.8)',
						color: 'white',
						padding: '10px 20px',
						borderRadius: '20px',
						zIndex: 1000,
						fontFamily: 'Arial, sans-serif',
						fontSize: '16px',
						fontWeight: 'bold',
					}}
				>
					🎮 {getPlayerName(currentPlayer)}'s Turn
				</div>
			)}

			{/* Selected Heroes Display - during gameplay */}
			{phase === 'gameplay' && selectedHeroes.length > 0 && (
				<div
					style={{
						position: 'fixed',
						top: '20px',
						right: '20px',
						background: 'rgba(0, 0, 0, 0.8)',
						color: 'white',
						padding: '15px',
						borderRadius: '15px',
						zIndex: 1000,
						fontFamily: 'Arial, sans-serif',
						fontSize: '14px',
						maxWidth: '300px',
					}}
				>
					<h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
						Selected Heroes:
					</h3>
					{selectedHeroes.map((selection, index) => (
						<div
							key={index}
							style={{
								background: selection.heroColor,
								color: 'white',
								padding: '5px 10px',
								borderRadius: '10px',
								marginBottom: '5px',
								fontSize: '12px',
								fontWeight: 'bold',
							}}
						>
							{selection.playerName}: {selection.heroName}
						</div>
					))}
				</div>
			)}

			<Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
				<ambientLight intensity={0.3} />
				<directionalLight
					position={[5, 5, 5]}
					intensity={0.8}
					color='#ffffff'
				/>
				<directionalLight
					position={[-5, -5, -5]}
					intensity={0.4}
					color='#4a90e2'
				/>
				<Environment preset='city' />
				<pointLight
					position={[0, 3, 2]}
					intensity={0.6}
					color='#00ffff'
				/>
				<color attach='background' args={['#ececec']} />
				<Experience />

				{/* Only show cards during gameplay phase */}
				{phase === 'gameplay' && (
					<>
						<HolographicCard
							position={[-3, 0, 0]}
							title='Dragon Warrior'
							description='You may put a random card from under your Super Hero into your hand, if you choose not to, +2 Power.'
							hologramColor={[1.0, 0.3, 0.3]}
							titleColor='rgba(255, 0, 0, 0.8)'
							titleTextColor='#FFD700'
							classText='Warrior'
							classColor='rgba(255, 100, 0, 0.8)'
							classTextColor='#FFD700'
							imageUrl={'/images/greenArrowsBow.webp'}
							onClick={() => handleCardClick('dragon')}
							onHover={(hovered) =>
								handleCardHover(hovered, 'dragon')
							}
							cornerRadius={0.12}
						/>

						<HolographicCard
							position={[0, 0, 0]}
							title='Cyber Mage'
							description='Master of digital magic and illusions'
							hologramColor={[0.2, 0.8, 1.0]}
							titleColor='rgba(0, 150, 255, 0.8)'
							titleTextColor='#00FFFF'
							classText='Mage'
							classColor='rgba(0, 100, 255, 0.8)'
							classTextColor='#00FFFF'
							onClick={() => handleCardClick('mage')}
							onHover={(hovered) =>
								handleCardHover(hovered, 'mage')
							}
							cornerRadius={0.12}
						/>

						<HolographicCard
							position={[3, 0, 0]}
							title='Neon Assassin'
							description='Stealthy killer from the neon streets'
							hologramColor={[0.8, 0.2, 1.0]}
							titleColor='rgba(255, 0, 255, 0.8)'
							titleTextColor='#FF69B4'
							classText='Assassin'
							classColor='rgba(255, 0, 150, 0.8)'
							classTextColor='#FF69B4'
							onClick={() => handleCardClick('assassin')}
							onHover={(hovered) =>
								handleCardHover(hovered, 'assassin')
							}
							cornerRadius={0.12}
						/>
					</>
				)}
			</Canvas>
		</>
	)
}

export default App
