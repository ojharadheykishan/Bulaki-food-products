import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'CUSTOMER' | 'ADMIN';
      phone?: string | null;
    } & DefaultSession;
  }

  interface User {
    role?: 'CUSTOMER' | 'ADMIN';
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CUSTOMER' | 'ADMIN';
    phone?: string;
  }
}
