import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'

// Helper function to get player display name
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

export default function HeroSelection() {
	const {
		phase,
		playerTurn,
		players,
		selectedHeroes,
		getAvailableHeroes,
		selectHero,
	} = useGameEngine()

	// Only show during hero selection phase
	if (phase !== 'heroSelection') return null

	const currentPlayer = players[playerTurn]
	const availableHeroes = getAvailableHeroes()
	const isCurrentPlayerTurn =
		currentPlayer && currentPlayer.id === players[playerTurn]?.id

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'rgba(0, 0, 0, 0.8)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 2000,
				fontFamily: 'Arial, sans-serif',
			}}
		>
			{/* Header */}
			<div
				style={{
					textAlign: 'center',
					marginBottom: '30px',
					color: 'white',
				}}
			>
				<h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>
					🎮 Hero Selection
				</h1>
				{currentPlayer && (
					<p style={{ fontSize: '18px', margin: '0' }}>
						{isCurrentPlayerTurn
							? `It's your turn, ${getPlayerName(
									currentPlayer
							  )}! Choose your hero:`
							: `Waiting for ${getPlayerName(
									currentPlayer
							  )} to choose...`}
					</p>
				)}
			</div>

			{/* Selected Heroes Display */}
			{selectedHeroes.length > 0 && (
				<div
					style={{
						marginBottom: '20px',
						textAlign: 'center',
					}}
				>
					<h3 style={{ color: 'white', margin: '0 0 10px 0' }}>
						Selected Heroes:
					</h3>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							justifyContent: 'center',
							flexWrap: 'wrap',
						}}
					>
						{selectedHeroes.map((selection, index) => (
							<div
								key={index}
								style={{
									background: selection.heroColor,
									color: 'white',
									padding: '8px 16px',
									borderRadius: '20px',
									fontSize: '14px',
									fontWeight: 'bold',
								}}
							>
								{selection.playerName}: {selection.heroName}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Available Heroes Grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: '15px',
					maxWidth: '800px',
					width: '100%',
					padding: '0 20px',
				}}
			>
				{availableHeroes.map((hero) => (
					<button
						key={hero.id}
						onClick={() =>
							isCurrentPlayerTurn && selectHero(hero.id)
						}
						disabled={!isCurrentPlayerTurn}
						style={{
							background: isCurrentPlayerTurn
								? hero.color
								: '#666',
							color: 'white',
							border: 'none',
							borderRadius: '15px',
							padding: '20px',
							fontSize: '16px',
							fontWeight: 'bold',
							cursor: isCurrentPlayerTurn
								? 'pointer'
								: 'not-allowed',
							transition: 'all 0.3s ease',
							transform: isCurrentPlayerTurn
								? 'scale(1)'
								: 'scale(0.95)',
							opacity: isCurrentPlayerTurn ? 1 : 0.7,
							boxShadow: isCurrentPlayerTurn
								? '0 4px 15px rgba(0,0,0,0.3)'
								: 'none',
						}}
						onMouseEnter={(e) => {
							if (isCurrentPlayerTurn) {
								e.target.style.transform = 'scale(1.05)'
								e.target.style.boxShadow =
									'0 6px 20px rgba(0,0,0,0.4)'
							}
						}}
						onMouseLeave={(e) => {
							if (isCurrentPlayerTurn) {
								e.target.style.transform = 'scale(1)'
								e.target.style.boxShadow =
									'0 4px 15px rgba(0,0,0,0.3)'
							}
						}}
					>
						<div style={{ marginBottom: '8px' }}>{hero.name}</div>
						<div
							style={{
								fontSize: '12px',
								fontWeight: 'normal',
								opacity: 0.9,
							}}
						>
							{hero.description}
						</div>
					</button>
				))}
			</div>

			{/* Instructions */}
			<div
				style={{
					marginTop: '30px',
					textAlign: 'center',
					color: '#ccc',
					fontSize: '14px',
				}}
			>
				{isCurrentPlayerTurn
					? 'Click on a hero to select it!'
					: 'Please wait for the current player to make their selection.'}
			</div>
		</div>
	)
}
