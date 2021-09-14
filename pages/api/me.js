import Cookies from 'cookies'
const API_URL = process.env.WORDPRESS_GRAPHQL_URL

export default async (req, res) => {
	const authToken = req.headers['auth-token']
	if (authToken) {
		const email = await getEmail(authToken).then((x) => {
			res.status(200).json({ email: JSON.stringify(x.viewer.email) })
		});
	} else if (!authToken) {
		res.status(401).json({ error: 'Authentication required ' + authToken })
	} else {
		res.status(403).json({ error: 'Not permitted' })
	}
}

async function getEmail(authToken = null, { variables } = {}) {
	const headers = { 'Content-Type': 'application/json' }
	const query = `{
		viewer{ 
			id
			databaseId
			username
			email
		}
	}`

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
		return { errors: json.errors }
	}

	return json.data
}
