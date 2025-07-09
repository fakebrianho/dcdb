import {
	onPlayerJoin,
	useMultiplayerState,
	usePlayersList,
	isHost,
	randInt,
} from 'playroomkit'
import React, { useEffect } from 'react'

const GameEngineContext = React.createContext()

export const GameEngineProvider = ({ children }) => {
	const [timer, setTimer] = useMultiplayerState('timer', 0)
	const [playerTurn, setPlayerTurn] = useMultiplayerState('playerTurn', 0)
	const [actionSuccess, setActionSuccess] = useMultiplayerState(
		'actionSuccess',
		true
	)
	const players = usePlayersList(true)
	players.sort((a, b) => a.id.localeCompare(b.id))

	const gameState = {
		timer,
		playerTurn,
		actionSuccess,
		players,
	}

	const startGame = () => {
		if (isHost() && players.length > 0) {
			console.log('start game')
			setTimer(60, true)
			const randomPlayer = randInt(0, players.length - 1)
			setPlayerTurn(randomPlayer, true)
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
