/**
 * pages/api/login.js
 *
 * A demo API endpoint for logging in.
 */

export default async (req, res) => {
	if (req.body.email) {
		const loginres = await login('test').then((x) => {
			res.status(200).json({ authToken: x.login.refreshToken.toString() }) 
		});
		// console.log("loginres", loginres.login.refreshToken) 
	} else { 
		res.status(400).json({ error: 'not an error' }) 
	}
}
 
const API_URL = "http://thenursery.hopto.org/graphql"

async function fetchAPI(query, { variables } = {}) {
	const res = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
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
	// console.log("fetchAPI", json.data)
	return json.data
}

export async function login(password) {
	const data = await fetchAPI(
		`
    mutation Login {
        login(
          input: {
            clientMutationId: "uniqueId"
            password: "${password}"
            username: "test"
          }
        ) {
          refreshToken
        }
      }
  `)

	return data
}