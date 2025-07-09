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

	// Check if current user is the one selecting
	const isCurrentUserTurn =
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
						{isCurrentUserTurn
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

			{/* Different UI based on whether it's current user's turn */}
			{isCurrentUserTurn ? (
				// Interactive selection UI for current player
				<>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '15px',
							maxWidth: '800px',
							width: '100%',
							padding: '0 20px',
						}}
					>
						{availableHeroes.map((hero) => (
							<button
								key={hero.id}
								onClick={() => selectHero(hero.id)}
								style={{
									background: hero.color,
									color: 'white',
									border: 'none',
									borderRadius: '15px',
									padding: '20px',
									fontSize: '16px',
									fontWeight: 'bold',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									transform: 'scale(1)',
									opacity: 1,
									boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
								}}
								onMouseEnter={(e) => {
									e.target.style.transform = 'scale(1.05)'
									e.target.style.boxShadow =
										'0 6px 20px rgba(0,0,0,0.4)'
								}}
								onMouseLeave={(e) => {
									e.target.style.transform = 'scale(1)'
									e.target.style.boxShadow =
										'0 4px 15px rgba(0,0,0,0.3)'
								}}
							>
								<div style={{ marginBottom: '8px' }}>
									{hero.name}
								</div>
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

					<div
						style={{
							marginTop: '30px',
							textAlign: 'center',
							color: '#ccc',
							fontSize: '14px',
						}}
					>
						Click on a hero to select it!
					</div>
				</>
			) : (
				// Waiting UI for other players
				<>
					<div
						style={{
							textAlign: 'center',
							color: 'white',
							maxWidth: '600px',
							padding: '0 20px',
						}}
					>
						<div
							style={{
								fontSize: '48px',
								marginBottom: '20px',
								animation: 'pulse 2s infinite',
							}}
						>
							⏳
						</div>
						<h2 style={{ fontSize: '24px', margin: '0 0 15px 0' }}>
							Waiting for {getPlayerName(currentPlayer)} to
							choose...
						</h2>
						<p
							style={{
								fontSize: '16px',
								opacity: 0.8,
								margin: '0 0 30px 0',
							}}
						>
							Please wait while the current player selects their
							hero. You'll be able to choose from the remaining
							heroes when it's your turn.
						</p>

						{/* Show available heroes as preview (non-interactive) */}
						{availableHeroes.length > 0 && (
							<div>
								<h3
									style={{
										fontSize: '18px',
										margin: '0 0 15px 0',
									}}
								>
									Available Heroes ({availableHeroes.length}{' '}
									remaining):
								</h3>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns:
											'repeat(auto-fit, minmax(150px, 1fr))',
										gap: '10px',
										maxWidth: '600px',
									}}
								>
									{availableHeroes.map((hero) => (
										<div
											key={hero.id}
											style={{
												background: hero.color,
												color: 'white',
												borderRadius: '10px',
												padding: '15px',
												fontSize: '14px',
												fontWeight: 'bold',
												opacity: 0.7,
												textAlign: 'center',
											}}
										>
											{hero.name}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}
