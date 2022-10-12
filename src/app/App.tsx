import React from 'react'
import { createRoot } from 'react-dom/client'

import { HelloName, HelloNames } from './helloworld/helloworld'
import { ClockApp } from './clock/clock'
import { AlertButton } from './event/clickable'
import { ProductTableApp } from './thinking/goods-filter'
import { TicTacToe } from './tictactoe/tictactoe'

const root = createRoot(document.getElementById('root')!)
root.render(
	<>
		{/* <HelloName name="Sara" /> */}
		{/* <ClockApp /> */}
		{/* <AlertButton text="Click me" alert="1" /> */}
		{/* <HelloNames names={['Sara', 'Cahal', 'Edite']} /> */}
		{/* <ProductTableApp /> */}
		<TicTacToe />
	</>
)
