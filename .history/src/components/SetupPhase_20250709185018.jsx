import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'
import { myPlayer } from 'playroomkit'

// Helper function to get player display name
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

export default function SetupPhase() {
	const { phase, players, selectedHeroes } = useGameEngine()

	// Only show during setup phase
	if (phase !== 'setup') return null

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
				<p style={{ fontSize: '18px', margin: '0' }}>
					Preparing for battle...
				</p>
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

			{/* Setup Message */}
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
					Setting up the game...
				</h2>
				<p
					style={{
						fontSize: '16px',
						opacity: 0.8,
						margin: '0 0 30px 0',
					}}
				>
					All heroes have been selected! The game is now being
					configured for battle.
				</p>
			</div>
		</div>
	)
}
