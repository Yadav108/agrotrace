import { DefaultSession } from 'next-auth'

export type Role = 'FARMER' | 'BUYER' | 'TRANSPORTER'

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role
    } & DefaultSession['user']
  }
}
