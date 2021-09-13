import Cookies from 'cookies'

/**
 * pages/api/me.js
 *
 * A demo API endpoint for getting the currently authenticated user.
 */
export default async (req, res) => {
	const authToken = req.headers['auth-token']
	if (authToken) {
		const email = await getEmail(authToken).then((x) => {
			res.status(200).json({ email: 'hello ' + JSON.stringify(x.users.edges[0].node.email) })
		});
	} else if (!authToken) {
		res.status(401).json({ error: 'Authentication required ' + authToken })
	} else {
		res.status(403).json({ error: 'Not permitted' })
	}
}

export async function getEmail(authToken) {
	const data = await fetchAPI(
		`query getUsers{
			users(first: 10) {
			  edges {
				node {
				  id
				  username
				  email
				}
			  }
			}
		}`, authToken)
	return data
}

const API_URL = "http://thenursery.hopto.org/graphql"

async function fetchAPI(query, authToken = null, { variables } = {}) {
	const headers = { 'Content-Type': 'application/json' }

	if (authToken) {
		headers[
			'Authorization'
		] = `Bearer ${authToken}`
	}

	const res = await fetch(API_URL, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			query,
			variables,
		}),
	})
	const json = await res.json()
	if (json.errors) {
		console.error(json.errors)
		throw new Error('Failed to fetch API')
	}
	console.log("got email", json.data)
	return json.data
}
