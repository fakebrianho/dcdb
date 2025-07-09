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

export const GameEngineProvider = ({ children }) => {
	const [timer, setTimer] = useMultiplayerState('timer', 0)
	const [playerTurn, setPlayerTurn] = useMultiplayerState('playerTurn', 0)
	const [actionSuccess, setActionSuccess] = useMultiplayerState(
		'actionSuccess',
		true
	)
	const [phase, setPhase] = useMultiplayerState('phase', 'heroSelection')
	const players = usePlayersList(true)
	players.sort((a, b) => a.id.localeCompare(b.id))

	// Debug: Log player properties
	// useEffect(() => {
	// 	if (players.length > 0) {
	// 		console.log('🔍 Player objects from PlayroomKit:', players)
	// 		players.forEach((player, index) => {
	// 			console.log(`Player ${index}:`, {
	// 				id: player.id,
	// 				name: getPlayerName(player),
	// 				state: player.state,
	// 				profile: player.state?.profile,
	// 				allProperties: Object.keys(player),
	// 			})
	// 		})
	// 	}
	// }, [players])

	const gameState = {
		timer,
		playerTurn,
		actionSuccess,
		players,
		phase,
	}

	const startGame = () => {
		if (isHost() && players.length > 0) {
			console.log('start game')
			setTimer(60, true)
			const randomPlayer = getRandomInt(0, players.length - 1)
			setPlayerTurn(randomPlayer, true)

			// Log which player's turn it is
			const currentPlayer = players[randomPlayer]
			console.log(
				`🎮 Game started! It's ${getPlayerName(currentPlayer)}'s turn!`
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
		<GameEngineContext.Provider value={{ ...gameState }}>
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
