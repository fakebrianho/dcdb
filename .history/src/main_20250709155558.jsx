import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GameEngineProvider } from './hooks/useGameEngine'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<GameEngineProvider>
		<React.StrictMode>
			<App />
		</React.StrictMode>
		,
	</GameEngineProvider>
)
