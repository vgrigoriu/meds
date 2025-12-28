import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    signIn({ user }) {
      if (!user.email) {
        return false
      }
      const allowedEmails =
        process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()) ?? []
      return allowedEmails.includes(user.email)
    },
    jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email ?? ''
        session.user.image = token.picture as string | undefined
      }
      return session
    },
  },
})
