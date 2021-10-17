const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");


const User = require("./models/User");
const Post = require("./models/Post");

mongoose
  .connect(
    "mongodb+srv://black:black@cluster0.jhphl.mongodb.net/Vue?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
