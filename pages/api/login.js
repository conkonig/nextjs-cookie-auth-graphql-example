/**
 * pages/api/login.js
 *
 * A demo API endpoint for logging in.
 */
const API_URL = "http://thenursery.hopto.org/graphql"

export default async (req, res) => {
	const email = req.body.email
	const password = req.body.password
	if (email) {
		const loginres = await login(email, password).then((x) => {

			// res.status(200).send({ authToken: 'haha' })

			if (x.errors) {
				const error = x.errors[0].message
				console.log('x.error0', error)
				res.status(401).send({ error: error }); 
				// res.status(400).json({ error: 'Invalid credentials' })
			}
			else {
				const token = x.login.refreshToken.toString()
				if (token) {
					res.status(200).send({ authToken: token })
				}
			}
		});
	} else {
		res.status(500).send({ error: 'Something went wrong' })
	}
}

async function login(email, password) {
	const query = `
		 mutation Login {
			 login(
			 input: {
				 clientMutationId: "uniqueId"
				 password: "${password}"
				 username: "${email}"
			 }
			 ) {
			 refreshToken
			 }
		 }
	 `
	const variables = {}
	let json = {}
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query,
				variables,
			}),
		})
		json = await res.json() 
		if (json.errors) {
			console.error(json.errors)
			return { errors: json.errors }
		}
	} catch (error) {
		return { errors: error }
	}
	// console.log("login fetchAPI", json?.data)
	return json?.data ?? { msg: 'fuck knows' }
}

