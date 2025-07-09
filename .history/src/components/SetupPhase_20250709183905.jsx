import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'
import { myPlayer } from 'playroomkit'

// Helper function to get player display name
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

export default function SetupPhase() {
	const {
		phase,
		playerTurn,
		players,
		selectedHeroes,
		setupComplete,
		completeSetup,
	} = useGameEngine()

	// Only show during setup phase
	if (phase !== 'setupPhase') return null

	const currentPlayer = players[playerTurn]

	// Get the current user's player object
	const currentUser = myPlayer()

	// Check if current user is the one setting up
	const isCurrentUserTurn =
		currentUser && currentPlayer && currentUser.id === currentPlayer.id

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
					⚙️ Setup Phase
				</h1>
				{currentPlayer && (
					<p style={{ fontSize: '18px', margin: '0' }}>
						{isCurrentUserTurn
							? `It's your turn to setup, ${getPlayerName(
									currentPlayer
							  )}!`
							: `Waiting for ${getPlayerName(
									currentPlayer
							  )} to complete setup...`}
					</p>
				)}
			</div>

			{/* Selected Heroes Display */}
			{selectedHeroes.length > 0 && (
				<div
					style={{
						marginBottom: '30px',
						textAlign: 'center',
					}}
				>
					<h3 style={{ color: 'white', margin: '0 0 15px 0' }}>
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

			{/* Setup Progress */}
			<div
				style={{
					marginBottom: '30px',
					textAlign: 'center',
					color: 'white',
				}}
			>
				<h3 style={{ margin: '0 0 10px 0' }}>Setup Progress:</h3>
				<div
					style={{
						display: 'flex',
						gap: '10px',
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
					{players.map((player, index) => {
						const isComplete = setupComplete.includes(player.id)
						return (
							<div
								key={player.id}
								style={{
									background: isComplete ? '#4CAF50' : '#666',
									color: 'white',
									padding: '5px 12px',
									borderRadius: '15px',
									fontSize: '12px',
									fontWeight: 'bold',
								}}
							>
								{getPlayerName(player)}:{' '}
								{isComplete ? '✅' : '⏳'}
							</div>
						)
					})}
				</div>
			</div>

			{/* Different UI based on whether it's current user's turn */}
			{isCurrentUserTurn ? (
				// Interactive setup UI for current player
				<>
					<div
						style={{
							textAlign: 'center',
							color: 'white',
							maxWidth: '600px',
							padding: '0 20px',
						}}
					>
						<p
							style={{
								fontSize: '16px',
								margin: '0 0 20px 0',
								opacity: 0.9,
							}}
						>
							Configure your game settings and prepare for battle!
						</p>

						<button
							onClick={completeSetup}
							style={{
								background: '#4CAF50',
								color: 'white',
								border: 'none',
								borderRadius: '15px',
								padding: '15px 30px',
								fontSize: '18px',
								fontWeight: 'bold',
								cursor: 'pointer',
								transition: 'all 0.3s ease',
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
							✅ Complete Setup
						</button>
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
							⚙️
						</div>
						<h2 style={{ fontSize: '24px', margin: '0 0 15px 0' }}>
							Waiting for {getPlayerName(currentPlayer)} to
							complete setup...
						</h2>
						<p
							style={{
								fontSize: '16px',
								opacity: 0.8,
								margin: '0 0 30px 0',
							}}
						>
							Please wait while the current player configures
							their settings. You'll be able to setup when it's
							your turn.
						</p>
					</div>
				</>
			)}
		</div>
	)
}
