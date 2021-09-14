import axios from 'axios'
import { useEffect, useState } from 'react'

const API_URL = process.env.API_URL

async function getInitialProps({ req, res }) {
	if (!process.browser) {
		try {
			const Cookies = require('cookies')
			const cookies = new Cookies(req, res)
			const authToken = cookies.get('auth-token') || ''

			const { email } = await axios
				.get(`${API_URL}/me`, { headers: { 'auth-token': authToken } })
				.then((response) => response.data)

			return { initialLoginStatus: `Logged in as ${email}` }
		} catch (err) {
			return { initialLoginStatus: 'Not logged in' }
		}
	}
	return {}
}

export default function Homepage({ initialLoginStatus }) {
	const [loginStatus, setLoginStatus] = useState(initialLoginStatus || 'Loading...')
	const [errorMsg, setErrorMsg] = useState('')

	async function getLoginStatus() {
		setLoginStatus('Loading...')
		try {
			const { email } = await axios.get('/api/proxy/me').then((response) => response.data)
			setLoginStatus(`Logged in as ${email}`)
		} catch (err) {
			setLoginStatus('Not logged in')
		}
	}

	async function onSubmit(e) {
		e.preventDefault()

		const email = e.target.querySelector('[name="email"]').value
		const password = e.target.querySelector('[name="password"]').value

		await axios.post('/api/proxy/login', { email, password }).then((res) => {
			setErrorMsg('')  
			getLoginStatus()
		}).catch(function (error) { 
			console.log(error.response.status)        
			console.log(error.response.data.error) 
			setErrorMsg(error.response.data.error) 
			getLoginStatus() 
		})
	}

	useEffect(() => {
		if (!initialLoginStatus) {
			getLoginStatus()
		}
	}, [initialLoginStatus])

	return (
		<>
			<div className="Homepage">

				<h1>NextJS - headless WordPress Graphql http cookie Authentication</h1>

				<p className="login-status">
					{loginStatus} (<a href="/logout">Logout</a>)
				</p>

				<form className="login-form" onSubmit={onSubmit}>
					<label>
						<span>Email</span>
						<input name="email" type="email" required />
					</label>

					<label>
						<span>Password</span>
						<input name="password" type="password" required />
					</label>

					<button type="submit">Log in!</button>
				</form>

				<span style={{ color: 'red' }}>{errorMsg}</span>

				<p>
					<small>Use credentials from your wordpress CMS</small>
				</p>

				<hr />
				<p>
					<small>
						Inspired by the blog post by max schmitt:{' '}
						<a href="https://maxschmitt.me/posts/next-js-http-only-cookie-auth-tokens/">
							Next.js: Using HTTP-Only Cookies for Secure Authentication
						</a>
					</small>
				</p>
			</div>
		</>
	)
}

Homepage.getInitialProps = getInitialProps
