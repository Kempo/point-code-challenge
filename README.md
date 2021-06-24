# Point Code Challenge

**Stack**: Apollo Server, Passport.js, JWTs, Typescript

## Running locally
Assuming `npm` and `node` are already installed, after cloning the repo:
1. Run `npm install` to install the respective dependencies
2. Run `npm run dev` to start the development server

From there, you can navigate to the server playground located at `localhost:4000`.

## Design Decisions
Given the time frame, here are some main items I decided not to implement:
1. Password hashing (such as with `bcrypt`)
2. A database and ORM (ie. Prisma or Sequelize)
3. Containerization (ie. Docker)

For this project, I decided to use JWTs to handle authentication/authorization on the server. I use a default encryption algorithm `HS256`, specify an expiration date of `1 hour` and store a user `id` within each token which can then be decoded to fetch user details in the server's context. 

To use the tokens, store them in the headers of a request using the Bearer scheme: 
```json
{
  "Authorization": "Bearer <token>"
}
```

The `models.ts` file handles the business logic of the server, mimicking an API to a database and contains all the necessary function calls. In hindsight, it may have been better to take advantage of Apollo Server's `datasources` API structure and have DB calls initiated through a resolver's context.

The `resolvers.ts` file is the entry-point for requests and how they are processed. `schema.ts` contains the actual GraphQL schema. All fields are made nullable.

Everything JWT-related is located within the `auth` service in `src/services/auth.ts` which sets up Passport.js and contains functions to authenticate requests and `signTokens`.

On `login` and `signup` mutations, the server provides a `token` field in the response which can then be used within the header to authorize the user for other function calls.

There is some crude logic for creating/editing posts, due to the use of an in-memory database (this can be cleaned up with an ORM). Also, editing a post with a blank message will delete it.

## Queries
Fetch a user and their posts:
```graphql
query fetchUserAndPosts {
  user(id: 3) {
    username
    id 
    posts {
      message
    }
  }
}
```

Get the current viewer:
```graphql
query getViewer {
  viewer {
    id
    username
  }
}
```

Fetch all posts:
```graphql
query fetchPosts {
  posts {
    id
    message
    author {
      id
      username
    }
  }
}
```

Fetch all users:
```graphql
query fetchUsers {
  users {
    id
    username
  }
}
```

## Mutations
Sign up:
```graphql
mutation signup {
  signup(account: {
    username: "new@account.com",
    password: "password"
  }) {
    user {
      id 
    }
    token
  }
}
```

Log in:
```graphql
mutation login {
  login(account: {
    username: "a@b.com",
    password: "123"
  }) {
    user {
      id
    }
    token
  }
}
```

Create post (must be authenticated):
```graphql
mutation createPost {
  createPost(input: {
    message: "A new message for an account."
  }) {
    id
    message
    author {
      id
      username
    }
  }
}
```

Edit post (must be authenticated): 
```graphql
mutation editPost {
  editPost(input: {
    id: 1,
    message: "Edited post!"
  }) {
    id
    message
  }
}
```

### Pros
- Lightweight (ish)
- Schema-first development 
- Built-in playground environment
- Quick documentation!
- Smaller response payloads

###  Cons
- In-memory database for main data store
- No password hashing (eg. with `bcrypt`)
- No email verification
- Lack of JWT invalidation
- Lack of production / development environments
- Lack of pagination options on queries
- No request batching (eg. preventing N+1 queries with `dataloader`)
- Not easily extensible for user permissions
- Repititive type enforcment (types on the schema vs. types in the code)

# Finishing Notes
For another server implementation, feel free to check out my other [project](https://github.com/Kempo/realtime-orders).

In that project, I do use Prisma, a Postgres DB, along with `dataloader` and some sense of different dev/prod environments.