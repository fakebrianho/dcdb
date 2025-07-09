import { useMultiplayerState, usePlayerState } from 'playroomkit'
import React from 'react'

const GameEngineContext = React.createContext()

export const GameEngineProvider = ({ children }) => {
	const [timer, setTimer] = useMultiplayerState('timer', 0)
	const [playerTurn, setPlayerTurn] = useMultiplayerState('playerTurn', 0)
	const [actionSuccess, setActionSuccess] = useMultiplayerState(
		'actionSuccess',
		true
	)
	const players = usePlayersList(true)

	return (
		<GameEngineContext.Provider value={{}}>
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
