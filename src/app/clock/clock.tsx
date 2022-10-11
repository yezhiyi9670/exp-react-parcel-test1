import React, { useState, useEffect } from 'react'

function ClockText(props: {}) {
	const [ date, setDate ] = useState(new Date())
	
	useEffect(() => {
		let interval_t = setInterval(() => {
			setDate(new Date())
		}, 1000)
		return () => {
			clearInterval(interval_t)
		}
	})

	return (
		<>{date.toLocaleTimeString()}</>
	)
}

function ClockApp(props: {}) {
	return (
		<>
			<h1>Dynamic Clock</h1>
			<p>Current time is: <ClockText /></p>
		</>
	)
}

export { ClockText, ClockApp }
