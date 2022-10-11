import React from 'react'

function HelloName(props: {name: string}) {
	return (
		<h1>Hello, {props.name}!</h1>
	)
}

function HelloNames(props: {names: string[]}) {
	const { names, ...other } = props

	return (
		<>
			{names.map((value) => (
				<HelloName key={value} name={value} {...other} />
			))}
		</>
	)
}

export { HelloName, HelloNames }
