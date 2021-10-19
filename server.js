const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
var jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

const User = require("./models/User");
const Post = require("./models/Post");

mongoose
  .connect(
    "mongodb+srv://black:black@cluster0.jhphl.mongodb.net/Vue?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

const getUser = async (token) => {
  if (token) {
    try {
      return await jwt.verify(token, "Test");
    } catch (err) {
      throw new AuthenticationError("Please signin again");
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => ({ name: error.name, message: error.message }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
