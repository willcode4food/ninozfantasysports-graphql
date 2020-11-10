"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server-cloud-functions'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var functions = require('firebase-functions');
// Construct a schema, using GraphQL schema language
var typeDefs = gql(__makeTemplateObject(["\n    type Query {\n        hello: String\n    }\n"], ["\n    type Query {\n        hello: String\n    }\n"
    // Provide resolver functions for your schema fields
]));
// Provide resolver functions for your schema fields
var resolvers = {
    Query: {
        hello: function () { return 'Hello world!'; },
    },
};
var server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    playground: true,
    introspection: true,
});
exports.api = functions.https.onRequest(server.createHandler());
//# sourceMappingURL=index.js.map