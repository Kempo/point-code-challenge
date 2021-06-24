import { User, Post } from './types';

const users: User[] = [
  {
    id: 1,
    username: 'test@test.com',
    password: 'test'
  },
  {
    id: 2,
    username: 'a@b.com',
    password: '123'
  }
];

const posts: Post[] = [
  {
    id: 1,
    message: 'This is a post by a@b.com',
    authorId: 2
  },
  {
    id: 2,
    message: 'Another post by a@b.com',
    authorId: 2
  }
];

export const fetchUser = (userId: number) => users.find(user => user.id === userId);
export const fetchPostsByUser = (userId: number) => posts.filter(post => post.authorId === userId);
export const fetchPosts = () => posts;
export const fetchUsers = () => users;
export const isAuthor = (userId: number, postId: number) => {
  const post = posts.find(post => post.id === postId);

  return post?.authorId === userId;
}

export const isValidCredentials = ({ username, password }: { username: string, password: string }) => {
  const result = users.find(user => user.username === username && user.password === password);

  return result;
}

export const isAccountCreated = (username: string) => {
  return users.some(user => user.username === username);
}

export const createAccount = ({ username, password }: { username: string, password: string }) => {
  const nextId = users.length + 1;

  users.push({
    id: nextId,
    username,
    password
  });

  return users[users.length - 1];
}

export const createPost = (authorId, message) => {
  const nextId = posts.length + 1;

  posts.push({
    id: nextId,
    authorId,
    message
  })

  return posts[posts.length - 1];
} 

export const editPost = (postId: number, message: string) => {
  const index = posts.findIndex(post => post.id === postId);
  
  // If new message length is zero, delete the post.
  if(message.length === 0) {
    posts.splice(index, 1);
    return null;
  }
    
  posts[index].message = message;

  return posts[index];
}

