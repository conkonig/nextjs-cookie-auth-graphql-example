const API_URL = process.env.WORDPRESS_GRAPHQL_URL

export default async (req, res) => {
	const email = req.body.email
	const password = req.body.password
	if (email) {
		const loginres = await login(email, password).then((x) => {
			if (x.errors) {
				const error = x.errors[0].message
				console.log('error ', error)
				res.status(401).send({ error: error });
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
	return json?.data
}

