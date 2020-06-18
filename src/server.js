const app = require('express')()
const graphqlHTTP = require('express-graphql')
const { schema, rootResolvers } = require('./graphql')
const sampleData = require('../sample-data.json')

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: rootResolvers,
	context: {
		db: sampleData
	},
	graphiql: true,
}))

app.listen(8080, () => {
	console.log('Server listening')
})
