import React from 'react'

const GameEngineContext = React.createContext()

export const GameEngineProvider = ({ children }) => {
	return (
		<GameEngineContext.Provider value={{}}>
			{children}
		</GameEngineContext.Provider>
	)
}
