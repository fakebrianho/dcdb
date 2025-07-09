import { onPlayerJoin, useMultiplayerState, usePlayersList } from 'playroomkit'
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

	const startGame = () => {}
	useEffect(() => {
		startGame()
		onPlayerJoin(startGame)
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
