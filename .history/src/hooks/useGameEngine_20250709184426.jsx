import { onPlayerJoin, useMultiplayerState, usePlayersList } from 'playroomkit'
import React, { useEffect } from 'react'

const GameEngineContext = React.createContext()

// Helper function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to check if current player is host
const isHost = () => {
	// For now, we'll assume the first player is the host
	// You might need to implement this based on your playroomkit setup
	return true
}

// Helper function to get player display name
const getPlayerName = (player) => {
	return player?.state?.profile?.name || player?.id || 'Unknown Player'
}

// Available heroes pool
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

export const GameEngineProvider = ({ children }) => {
	const [timer, setTimer] = useMultiplayerState('timer', 0)
	const [playerTurn, setPlayerTurn] = useMultiplayerState('playerTurn', 0)
	const [actionSuccess, setActionSuccess] = useMultiplayerState(
		'actionSuccess',
		true
	)
	const [phase, setPhase] = useMultiplayerState('phase', 'heroSelection')
	const [selectedHeroes, setSelectedHeroes] = useMultiplayerState(
		'selectedHeroes',
		[]
	)
	const [setupComplete, setSetupComplete] = useMultiplayerState(
		'setupComplete',
		[]
	)
	const [debugMode, setDebugMode] = useMultiplayerState('debugMode', true) // Temporarily enabled
	const players = usePlayersList(true)
	players.sort((a, b) => a.id.localeCompare(b.id))

	const gameState = {
		timer,
		playerTurn,
		actionSuccess,
		players,
		phase,
		selectedHeroes,
		setupComplete,
		debugMode,
		AVAILABLE_HEROES,
	}

	// Get available heroes (not yet selected)
	const getAvailableHeroes = () => {
		return AVAILABLE_HEROES.filter(
			(hero) =>
				!selectedHeroes.some((selected) => selected.heroId === hero.id)
		)
	}

	// Handle hero selection
	const selectHero = (heroId) => {
		if (phase !== 'heroSelection') return

		const hero = AVAILABLE_HEROES.find((h) => h.id === heroId)
		if (!hero) return

		const currentPlayer = players[playerTurn]
		if (!currentPlayer) return

		// Add hero to selected heroes
		const newSelectedHeroes = [
			...selectedHeroes,
			{
				playerId: currentPlayer.id,
				playerName: getPlayerName(currentPlayer),
				heroId: heroId,
				heroName: hero.name,
				heroColor: hero.color,
			},
		]

		setSelectedHeroes(newSelectedHeroes, true)

		// Move to next player's turn
		const nextPlayerTurn = (playerTurn + 1) % players.length
		setPlayerTurn(nextPlayerTurn, true)

		// If all players have selected, move to setup phase
		if (newSelectedHeroes.length >= players.length) {
			setPhase('setupPhase', true)
			setPlayerTurn(0, true) // Reset to first player for setup
			console.log('🎮 All heroes selected! Moving to setup phase.')
		} else {
			console.log(
				`🎯 ${getPlayerName(currentPlayer)} selected ${
					hero.name
				}! Next player's turn.`
			)
		}
	}

	// Handle setup phase completion
	const completeSetup = () => {
		if (phase !== 'setupPhase') return

		const currentPlayer = players[playerTurn]
		if (!currentPlayer) return

		// Mark setup as complete for current player
		const newSetupComplete = [...setupComplete, currentPlayer.id]
		setSetupComplete(newSetupComplete, true)

		// Move to next player's setup
		const nextPlayerTurn = (playerTurn + 1) % players.length
		setPlayerTurn(nextPlayerTurn, true)

		// If all players have completed setup, move to gameplay
		if (newSetupComplete.length >= players.length) {
			setPhase('gameplay', true)
			setPlayerTurn(0, true) // Reset to first player for gameplay
			console.log('🎮 Setup complete! Moving to gameplay phase.')
		} else {
			console.log(
				`🎯 ${getPlayerName(
					currentPlayer
				)} completed setup! Next player's turn.`
			)
		}
	}

	// Toggle debug mode
	const toggleDebugMode = () => {
		setDebugMode(!debugMode, true)
	}

	const startGame = () => {
		if (isHost() && players.length > 0) {
			console.log('start game')
			setTimer(60, true)
			const randomPlayer = getRandomInt(0, players.length - 1)
			setPlayerTurn(randomPlayer, true)
			setPhase('heroSelection', true)
			setSelectedHeroes([], true)
			setSetupComplete([], true)

			// Log which player's turn it is
			const currentPlayer = players[randomPlayer]
			console.log(
				`🎮 Game started! It's ${getPlayerName(
					currentPlayer
				)}'s turn to select a hero!`
			)
		}
	}

	useEffect(() => {
		// Only start game when players are available
		if (players.length > 0) {
			startGame()
		}
	}, [players.length])

	useEffect(() => {
		onPlayerJoin(() => {
			// Start game when a new player joins
			if (players.length > 0) {
				startGame()
			}
		})
	}, [])

	// Log when player turn changes
	useEffect(() => {
		if (players.length > 0 && playerTurn < players.length) {
			const currentPlayer = players[playerTurn]
			console.log(
				`🎯 Current turn: ${getPlayerName(currentPlayer)} (Player ${
					playerTurn + 1
				}/${players.length})`
			)
		}
	}, [playerTurn, players])

	return (
		<GameEngineContext.Provider
			value={{
				...gameState,
				getAvailableHeroes,
				selectHero,
				completeSetup,
				toggleDebugMode,
			}}
		>
			{children}
		</GameEngineContext.Provider>
	)
}

export const useGameEngine = () => {
	const context = React.useContext(GameEngineContext)
	if (context === undefined) {
		throw new Error(
			'useGameEngine must be used within a GameEngineProvider'
		)
	}
	return context
}
