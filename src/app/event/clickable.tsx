import React, { SyntheticEvent } from 'react'

function AlertButton(props: {text: string, alert: string}) {
	const { text: buttonText, alert: alertText, ...other } = props

	let handleClick = (e: SyntheticEvent) => {
		alert(alertText)
		e.preventDefault()
	}

	return (
		<button onClick={handleClick} {...props}>{buttonText}</button>
	)
}

export { AlertButton }
