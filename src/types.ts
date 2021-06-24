export interface Post {
  id: number;
  authorId: number;
  message: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Context {
  user?: User;
}

export interface AccountInput {
  username: string
  password: string
}

export interface CreatePostInput {
  message: string
}

export interface EditPostInput {
  id: number
  message: string 
}