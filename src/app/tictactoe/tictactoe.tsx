import React, { useState } from 'react'

import classes from './tictactoe.module.scss'

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
		<td onClick={onClick} {...other}>
			{text}
		</td>
	)
}

function Gameboard(props: {size: number, mat: Mat, onCheck: (where: Coord) => any}) {
	const { size, mat, onCheck, ...other } = props

	// ⭕✖️

	let tableContent = new Array(size).fill(0).map((_, row) => (
		<tr key={row}>
			{new Array(size).fill(0).map((_, col) => (
				<Cell key={col} player={mat[row][col]} onClick={() => onCheck({x: row, y: col})} />
			))}
		</tr>
	))

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

function StatusText(props: {state: GameState, player: Player}) {
	const { state, player, ...other } = props

	let playerName = {
		[Player.Circle]: 'Circle',
		[Player.Cross]: 'Cross'
	}[player]
	let text = {
		[GameState.Ongoing]: `It's ${playerName}'s turn.`,
		[GameState.Finished]: `${playerName} won.`,
		[GameState.Tie]: `Tie.`
	}[state]

	return (
		<div className={classes.StatusText} {...other}>
			{text}
		</div>
	)
}

export function TicTacToe(props: {}) {
	const { ...other } = props

	const size = 3
	let emptyMat = new Array(size).fill(0).map(() => new Array(size).fill(null)) as Mat
	const [ mat, setMat ] = useState(emptyMat)
	const [ state, setState ] = useState(GameState.Ongoing)
	const [ player, setPlayer ] = useState(Player.Circle)

	let matCopy = mat.map(x => x.map(x => x))

	let resetGame = () => {
		setMat(emptyMat)
		setState(GameState.Ongoing)
		setPlayer(Player.Circle)
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
		let winningPlayer = (() => {
			for(let i = 0; i < size; i++) {
				let points1: Coord[] = []
				let points2: Coord[] = []
				for(let j = 0; j < size; j++) {
					points1.push({x: i, y: j})
					points2.push({x: j, y: i})
				}
				let check1 = checkSame(points1)
				let check2 = checkSame(points2)
				if(check1 !== null) {
					return check1
				}
				if(check2 !== null) {
					return check2
				}
			}
			let points1: Coord[] = []
			let points2: Coord[] = []
			for(let i = 0; i < size; i++) {
				points1.push({x: i, y: i})
				points2.push({x: i, y: size - i - 1})
			}
			let check1 = checkSame(points1)
			let check2 = checkSame(points2)
			if(check1 !== null) {
				return check1
			}
			if(check2 !== null) {
				return check2
			}
			return null
		})()
		if(winningPlayer !== null) {
			setPlayer(winningPlayer)
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
		switchPlayer()

		checkWin()
	}

	return (
		<div className={classes.TicTacToe} {...props}>
			<Gameboard size={size} mat={mat} onCheck={handleCheck} />
			<StatusText state={state} player={player} />
			<button onClick={resetGame} type="button">Reset</button>
		</div>
	)
}
