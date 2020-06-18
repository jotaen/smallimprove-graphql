const { buildSchema } = require('graphql')

const schema = buildSchema(`
	type Query {
		"""Retrieve infos about someone"""
		getUser(id: ID!): User

		"""See all users in the system"""
		getAllUsers: [User!]

		"""See all praises that have been submitted about someone"""
		getPraisesAbout(user: ID!): [Praise!]
	}

	type Mutation {
		"""Submit a praise about another user"""
		praise(fromUser: ID!, aboutUser: ID!, message: String!): Praise!
	}

	"""Basic user information"""
	type User {
		id: ID!
		name: String!
		email: String!
	}

	"""Praise that someone has submitted about someone else"""
	type Praise {
		id: ID!
		from: User
		about: User
		message: String!
	}
`)

const toPraise = db => data => ({
	...data,
	about: () => db.users.find(u => u.id === data.aboutUserId),
	from: () => db.users.find(u => u.id === data.fromUserId),
})

const rootResolvers = {
	// Queries:
	getUser: (args, context) => {
		return context.db.users.find(u => u.id === parseInt(args.id))
	},
	getAllUsers: (args, context) => {
		return context.db.users
	},
	getPraisesAbout: (args, context) => {
		return context.db.praise
			.filter(d => d.aboutUserId === parseInt(args.user))
			.map(toPraise(context.db))
	},

	// Mutations:
	praise: (args, context) => {
		const data = {
			id: context.db.praise.length + 1,
			aboutUserId: parseInt(args.aboutUser),
			fromUserId: parseInt(args.fromUser),
			message: args.message,
		}
		context.db.praise.push(data)
		return toPraise(context.db)(data)
	}
}

module.exports = {
	schema, rootResolvers
}
