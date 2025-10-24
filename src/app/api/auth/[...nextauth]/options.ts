import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { randomBytes } from 'crypto'
import { UserType } from '@/types/auth'


export const fakeUsers: UserType[] = [
  {
    id: '1',
    email: 'user@demo.com',
    username: 'demo_user',
    password: '123456',
    firstName: 'Demo',
    lastName: 'User',
    role: 'Admin',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYW5uYXR0aGVtZXMiLCJpYXQiOjE1ODczNTY2NDksImV4cCI6MTkwMjg4OTQ0OSwiYXVkIjoibWFubmF0dGhlbWVzLmNvbSIsInN1YiI6InN1cHBvcnRAbWFubmF0dGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGhlbWUiLCJFbWFpbCI6InN1cHBvcnRAbWFubmF0dGhlbWVzLmNvbSIsIlJvbGUiOiJBZG1pbiIsImZpcnN0TmFtZSI6Ik1hbm5hdCJ9.8f2Rh6LjOVLJnTCAYsMtKWpcieXQiEqPEe7o97r0P3M',
  },
]

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        const filteredUser = fakeUsers.find((user) => {
          return user.email === credentials?.email && user.password === credentials?.password
        })
        if (filteredUser) {
          return filteredUser
        } else {
          throw new Error('Email or Password is not valid')
        }
      },
    }),
  ],
  secret: 'kvwLrfri/MBznUCofIoRH9+NvGu6GqvVdqO3mor1GuA=',
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    session: ({ session, token }) => {
      session.user = {
        email: 'user@demo.com',
        name: 'Test User',
      }
      return Promise.resolve(session)
    },
  },
  session: {
    maxAge: 24 * 60 * 60 * 1000,
    generateSessionToken: () => {
      return randomBytes(32).toString('hex')
    },
  },
}
