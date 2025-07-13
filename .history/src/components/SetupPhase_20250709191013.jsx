import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'

// Helper function to get player display name
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

export default function SetupPhase() {
	const { phase, selectedHeroes } = useGameEngine()

	// Only show during setup phase
	if (phase !== 'setup') return null

	return (
		<div
			style={{
				position: 'fixed',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				background: 'rgba(0, 0, 0, 0.9)',
				color: 'white',
				padding: '20px',
				borderRadius: '15px',
				zIndex: 1000,
				fontFamily: 'Arial, sans-serif',
				textAlign: 'center',
				border: '2px solid #4CAF50',
			}}
		>
			<div
				style={{
					fontSize: '32px',
					marginBottom: '10px',
					animation: 'pulse 2s infinite',
				}}
			>
				⚙️
			</div>
			<h2 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>
				Setting up the game...
			</h2>
			<p style={{ fontSize: '14px', opacity: 0.8, margin: '0 0 15px 0' }}>
				All heroes have been selected! Preparing for battle.
			</p>

			{/* Selected Heroes Summary */}
			{selectedHeroes.length > 0 && (
				<div
					style={{
						background: 'rgba(255, 255, 255, 0.1)',
						padding: '10px',
						borderRadius: '10px',
						marginTop: '10px',
					}}
				>
					<div
						style={{
							fontSize: '12px',
							marginBottom: '5px',
							opacity: 0.8,
						}}
					>
						Selected Heroes ({selectedHeroes.length}):
					</div>
					<div
						style={{
							display: 'flex',
							gap: '5px',
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
									padding: '3px 8px',
									borderRadius: '10px',
									fontSize: '10px',
									fontWeight: 'bold',
								}}
							>
								{selection.heroName}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
