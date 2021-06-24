import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  "The Twitter user"
  type User {
    id: Int
    username: String
    posts: [Post]
  }

  "A post made by a Twitter user"
  type Post {
    id: Int
    message: String
    author: User
  }

  type Query {
    "Fetch a specific user "
    user(id: Int): User

    "Fetch all posts"
    posts: [Post]

    "Fetch all users"
    users: [User]

    "Fetch the current viewer"
    viewer: User
  }

  "Input for logging in to an account and signing up"
  input AccountInput {
    username: String
    password: String
  }

  "Input for creating a post, requiring a message field."
  input CreatePostInput {
    message: String
  }

  "Input for editing a post, requiring a post id and a message"
  input EditPostInput {
    id: Int
    message: String 
  }

  "Login and signup response that contains both the user payload and a token"
  type UserTokenResponse {
    user: User
    token: String
  }

  type Mutation {
    login(account: AccountInput): UserTokenResponse
    signup(account: AccountInput): UserTokenResponse
    createPost(input: CreatePostInput): Post
    editPost(input: EditPostInput): Post
  }
`;
