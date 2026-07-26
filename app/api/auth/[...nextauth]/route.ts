import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { connectToDatabase } = await import('@/lib/mongodb');
          const { User } = await import('@/models/User');
          await connectToDatabase();

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).select('+password');

          if (!user || !user.password) {
            return null;
          }

          const bcrypt = await import('bcryptjs');
          const isPasswordValid = credentials.password === user.password || bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: (user as any).role || 'CUSTOMER',
            phone: user.phone,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'CUSTOMER';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
