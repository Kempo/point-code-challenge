import { ApolloError } from 'apollo-server-express';
import { 
  fetchUser, 
  fetchPostsByUser, 
  createPost, 
  fetchPosts, 
  isValidCredentials, 
  isAccountCreated, 
  createAccount, 
  isAuthor,
  editPost,
  fetchUsers
} from "./models";
import { signToken } from './services/auth';
import { AccountInput, CreatePostInput, EditPostInput } from './types';

export const resolvers = {
  User: {
    posts: (parent) => {
      return fetchPostsByUser(parent.id);
    }
  },
  Post: {
    author: (parent) => {
      return fetchUser(parent.authorId);
    }
  },
  Query: {
    user: (_, { id }: { id: number }) => {
      return fetchUser(id);
    },
    posts: fetchPosts,
    users: fetchUsers,
    viewer: (_, __, ctx) => ctx.user
  },
  Mutation: {
    login: (_, { account }: { account: AccountInput }) => {
      const user = isValidCredentials(account);

      if(!user) {
        throw new ApolloError('Invalid account.');
      }

      const token = signToken(user.id);

      return {
        user,
        token
      };
    },
    signup: (_, { account }: { account: AccountInput }) => {
      if(isAccountCreated(account.username)) {
        throw new ApolloError('Account with username already exists.');
      }

      const user = createAccount(account);

      if(!user) {
        throw new ApolloError('Could not create account.');
      }

      return {
        user,
        token: signToken(user.id)
      };
    },
    createPost: (_, { input }: { input: CreatePostInput }, ctx) => {
      if(!ctx.user) {
        throw new ApolloError('Not allowed to create a post.');
      }

      return createPost(ctx.user.id, input.message);
    },
    editPost: (_, { input }: { input: EditPostInput }, ctx) => {
      if(!ctx.user) {
        throw new ApolloError('Not allowed to edit a post.');
      }

      if(!isAuthor(ctx.user.id, input.id)) {
        throw new ApolloError('User does not have permission to edit this post.');
      }

      return editPost(input.id, input.message);
    }
  }
};