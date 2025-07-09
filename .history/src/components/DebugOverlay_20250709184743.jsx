import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'
import { myPlayer } from 'playroomkit'

// Available heroes pool (same as in useGameEngine)
const AVAILABLE_HEROES = [
	{
		id: 'dragon-warrior',
		name: 'Dragon Warrior',
		color: '#FF4444',
		description: 'Fierce warrior with dragon powers',
	},
	{
		id: 'cyber-mage',
		name: 'Cyber Mage',
		color: '#4444FF',
		description: 'Master of digital magic',
	},
	{
		id: 'neon-assassin',
		name: 'Neon Assassin',
		color: '#FF44FF',
		description: 'Stealthy killer from the neon streets',
	},
	{
		id: 'crystal-knight',
		name: 'Crystal Knight',
		color: '#44FFFF',
		description: 'Noble protector with crystal armor',
	},
	{
		id: 'shadow-witch',
		name: 'Shadow Witch',
		color: '#8844FF',
		description: 'Dark magic wielder',
	},
	{
		id: 'flame-archer',
		name: 'Flame Archer',
		color: '#FF8844',
		description: 'Archer with fire arrows',
	},
	{
		id: 'ice-giant',
		name: 'Ice Giant',
		color: '#44FF88',
		description: 'Massive warrior with ice powers',
	},
]

export default function DebugOverlay() {
	const {
		phase,
		playerTurn,
		players,
		selectedHeroes,
		timer,
		actionSuccess,
		debugMode,
		toggleDebugMode,
	} = useGameEngine()

	// Only show if debug mode is enabled
	if (!debugMode) return null

	const currentUser = myPlayer()
	const currentPlayer = players[playerTurn]

	return (
		<div
			style={{
				position: 'fixed',
				top: '10px',
				left: '10px',
				background: 'rgba(0, 0, 0, 0.9)',
				color: '#00FF00',
				padding: '15px',
				borderRadius: '10px',
				fontFamily: 'monospace',
				fontSize: '12px',
				maxWidth: '400px',
				maxHeight: '80vh',
				overflow: 'auto',
				zIndex: 3000,
				border: '2px solid #00FF00',
			}}
		>
			{/* Debug Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '10px',
					borderBottom: '1px solid #00FF00',
					paddingBottom: '5px',
				}}
			>
				<h3 style={{ margin: 0, color: '#00FF00' }}>🐛 DEBUG MODE</h3>
				<button
					onClick={toggleDebugMode}
					style={{
						background: '#FF0000',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						padding: '5px 10px',
						fontSize: '10px',
						cursor: 'pointer',
					}}
				>
					❌ Close
				</button>
			</div>

			{/* Game State */}
			<div style={{ marginBottom: '10px' }}>
				<strong>🎮 Game State:</strong>
				<div style={{ marginLeft: '10px' }}>
					<div>
						Phase: <span style={{ color: '#FFFF00' }}>{phase}</span>
					</div>
					<div>
						Timer: <span style={{ color: '#FFFF00' }}>{timer}</span>
					</div>
					<div>
						Action Success:{' '}
						<span style={{ color: '#FFFF00' }}>
							{actionSuccess ? '✅' : '❌'}
						</span>
					</div>
				</div>
			</div>

			{/* Player Turn */}
			<div style={{ marginBottom: '10px' }}>
				<strong>👤 Current Turn:</strong>
				<div style={{ marginLeft: '10px' }}>
					<div>
						Player Index:{' '}
						<span style={{ color: '#FFFF00' }}>{playerTurn}</span>
					</div>
					<div>
						Current Player:{' '}
						<span style={{ color: '#FFFF00' }}>
							{currentPlayer ? currentPlayer.id : 'None'}
						</span>
					</div>
					<div>
						Current User:{' '}
						<span style={{ color: '#FFFF00' }}>
							{currentUser ? currentUser.id : 'None'}
						</span>
					</div>
					<div>
						Is My Turn:{' '}
						<span
							style={{
								color:
									currentUser &&
									currentPlayer &&
									currentUser.id === currentPlayer.id
										? '#00FF00'
										: '#FF0000',
							}}
						>
							{currentUser &&
							currentPlayer &&
							currentUser.id === currentPlayer.id
								? '✅'
								: '❌'}
						</span>
					</div>
				</div>
			</div>

			{/* Players */}
			<div style={{ marginBottom: '10px' }}>
				<strong>👥 Players ({players.length}):</strong>
				<div style={{ marginLeft: '10px' }}>
					{players.map((player, index) => (
						<div
							key={player.id}
							style={{
								color:
									index === playerTurn
										? '#FFFF00'
										: '#FFFFFF',
								fontWeight:
									index === playerTurn ? 'bold' : 'normal',
							}}
						>
							{index + 1}.{' '}
							{player.state?.profile?.name || player.id}
							{index === playerTurn && ' (CURRENT)'}
						</div>
					))}
				</div>
			</div>

			{/* Selected Heroes */}
			<div style={{ marginBottom: '10px' }}>
				<strong>🦸 Selected Heroes ({selectedHeroes.length}):</strong>
				<div style={{ marginLeft: '10px' }}>
					{selectedHeroes.length > 0 ? (
						selectedHeroes.map((selection, index) => (
							<div key={index} style={{ color: '#00FFFF' }}>
								{selection.playerName}: {selection.heroName}
							</div>
						))
					) : (
						<div style={{ color: '#888' }}>None selected</div>
					)}
				</div>
			</div>

			{/* Available Heroes */}
			<div style={{ marginBottom: '10px' }}>
				<strong>🎯 Available Heroes:</strong>
				<div style={{ marginLeft: '10px' }}>
					{AVAILABLE_HEROES.filter(
						(hero) =>
							!selectedHeroes.some(
								(selected) => selected.heroId === hero.id
							)
					).map((hero) => (
						<div key={hero.id} style={{ color: '#00FF00' }}>
							{hero.name}
						</div>
					))}
				</div>
			</div>

			{/* Raw Data */}
			<div style={{ marginBottom: '10px' }}>
				<strong>📊 Raw Data:</strong>
				<div style={{ marginLeft: '10px', fontSize: '10px' }}>
					<div>
						Selected Heroes:{' '}
						<span style={{ color: '#888' }}>
							{JSON.stringify(selectedHeroes, null, 2)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
