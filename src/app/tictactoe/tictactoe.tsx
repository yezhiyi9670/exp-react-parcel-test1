import React, { useState } from 'react'

import * as classes from './tictactoe.module.scss'

enum GameState { Ongoing, Finished, Tie }
enum Player { Circle, Cross }
interface Coord { x: number, y: number }
type Mat = (Player|null)[][]

function Cell(props: {player: Player|null, onClick: () => any}) {
	const { player, onClick, ...other } = props

	let text = ''
	if(player == Player.Circle) {
		text = '⭕'
	} else if(player == Player.Cross) {
		text = '✖️'
	}

	return (
		<td className={classes.cell} onClick={onClick} {...other}>
			{text}
		</td>
	)
}

function Gameboard(props: {size: number, mat: Mat, onCheck: (where: Coord) => any}) {
	const { size, mat, onCheck, ...other } = props

	// ⭕✖️

	let tableContent = new Array(size + 1).fill(0).map((_, row2) => {
		let row = row2 - 1
		return <tr key={row}>
			{new Array(size + 1).fill(0).map((_, col2) => {
				let col = col2 - 1
				if(col >= 0 && row >= 0) {
					return <Cell key={col} player={mat[row][col]} onClick={() => onCheck({x: row, y: col})} />
				} else if(col < 0 && row >= 0) {
					return <td key={col} className={classes.number}>{row + 1}</td>
				} else if(row < 0 && col >= 0) {
					return <td key={col} className={classes.number}>{col + 1}</td>
				} else {
					return <td key={col} className={classes.number}></td>
				}
			})}
		</tr>
	})

	return (
		<div className={classes.GameBoard} {...other}>
			<table>
				<tbody>
					{tableContent}
				</tbody>
			</table>
		</div>
	)
}

function StatusText(props: {state: GameState, player: Player, checkCount: number}) {
	const { state, player, checkCount, ...other } = props

	let playerName = {
		[Player.Circle]: 'Circle',
		[Player.Cross]: 'Cross'
	}[player]
	let text = {
		[GameState.Ongoing]: `It's ${playerName}'s turn ${checkCount}.`,
		[GameState.Finished]: `${playerName} won.`,
		[GameState.Tie]: `Tie.`
	}[state]

	return (
		<div className={classes.StatusText} {...other}>
			{text}
		</div>
	)
}

interface TicTacToeProps {
	boardSize: number
	winRequire: number
	loseRequire: number
	checks: number
	initChecks: number
	looped?: boolean
}
export function TicTacToe(props: TicTacToeProps) {
	const { boardSize, winRequire, loseRequire, checks, initChecks, looped, ...other } = props

	let emptyMat = new Array(boardSize).fill(0).map(() => new Array(boardSize).fill(null)) as Mat
	const [ mat, setMat ] = useState(emptyMat)
	const [ state, setState ] = useState(GameState.Ongoing)
	const [ player, setPlayer ] = useState(Player.Circle)
	const [ checkCount, setCheckCount ] = useState(initChecks)

	let matCopy = mat.map(x => x.map(x => x))

	let resetGame = () => {
		setMat(emptyMat)
		setState(GameState.Ongoing)
		setPlayer(Player.Circle)
		setCheckCount(initChecks)
	}

	let getCell = (where: Coord) => {
		return matCopy[where.x][where.y]
	}
	let setCell = (where: Coord, player: Player|null) => {
		matCopy[where.x][where.y] = player
		setMat(matCopy)
	}

	let switchPlayer = () => {
		if(player == Player.Circle) {
			setPlayer(Player.Cross)
		} else {
			setPlayer(Player.Circle)
		}
	}

	let checkSame = (points: Coord[]) => {
		for(let i = 1; i < points.length; i++) {
			let prev = getCell(points[i - 1])
			let curr = getCell(points[i])
			if(prev != curr) {
				return null
			}
		}
		return getCell(points[0])
	}

	let checkWin = () => {
		let findWinning = (required: number) => {
			let checkLine = (points: Coord[], requireLength: number) => {
				for(let i = 0; i <= points.length - requireLength; i++) {
					let result = checkSame(points.slice(i, i + requireLength))
					if(result !== null) {
						return result
					}
				}
				return null
			}

			let lines: Coord[][] = []
			let fullMat: Coord[] = new Array(boardSize).fill(0).map((_, row) => (
				new Array(boardSize).fill(0).map((_, col) => ({x: row, y: col}))
			)).reduce((x, y) => x.concat(y))
			if(!looped) {
				for(let i = 0; i < boardSize; i++) {
					lines.push(new Array(boardSize).fill(0).map((_, index) => (
						{x: i, y: index % boardSize}
					)))
				}
				for(let i = 0; i < boardSize; i++) {
					lines.push(new Array(boardSize).fill(0).map((_, index) => (
						{x: index % boardSize, y: i}
					)))
				}
				for(let i = 0; i < boardSize * 2 - 1; i++) {
					lines.push(fullMat.filter((where) => where.x + where.y == i))
				}
				for(let i = 0; i < boardSize * 2 - 1; i++) {
					lines.push(fullMat.filter((where) => where.x - where.y + boardSize - 1 == i))
				}
			} else {
				for(let i = 0; i < boardSize; i++) {
					lines.push(new Array(boardSize * 2).fill(0).map((_, index) => (
						{x: i, y: index % boardSize}
					)))
				}
				for(let i = 0; i < boardSize; i++) {
					lines.push(new Array(boardSize * 2).fill(0).map((_, index) => (
						{x: index % boardSize, y: i}
					)))
				}
				for(let i = 0; i < boardSize; i++) {
					lines.push(fullMat.filter((where) => (where.x + where.y) % boardSize == i))
				}
				for(let i = 0; i < boardSize; i++) {
					lines.push(fullMat.filter((where) => (where.x - where.y + boardSize - 1) % boardSize == i))
				}
			}
			for(let line of lines) {
				let result = checkLine(line, required)
				if(result !== null) {
					return result
				}
			}

			return null
		}

		let winningPlayer = findWinning(winRequire)
		if(winningPlayer !== null) {
			setPlayer(winningPlayer)
			setState(GameState.Finished)
			return
		}
		let losingPlayer = findWinning(loseRequire)
		if(losingPlayer !== null) {
			setPlayer(losingPlayer == Player.Circle ? Player.Cross : Player.Circle)
			setState(GameState.Finished)
			return
		}

		// 平局判断
		let freeCells = 0
		for(let line of matCopy) {
			for(let cell of line) {
				if(cell === null) {
					freeCells += 1
				}
			}
		}
		if(freeCells == 0) {
			setState(GameState.Tie)
		}
	}

	let handleCheck = (where: Coord) => {
		if(state != GameState.Ongoing) {
			return
		}
		if(getCell(where) !== null) {
			return
		}
		
		setCell(where, player)
		if(checkCount == checks) {
			switchPlayer()
			setCheckCount(1)
		} else {
			setCheckCount(checkCount + 1)
		}

		checkWin()
	}

	return (
		<div className={classes.TicTacToe} {...other}>
			<Gameboard size={boardSize} mat={mat} onCheck={handleCheck} />
			<StatusText state={state} player={player} checkCount={checkCount} />
			<button onClick={resetGame} type="button">Reset</button>
		</div>
	)
}
