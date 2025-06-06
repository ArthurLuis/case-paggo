import NextAuth, {User} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {label: 'Username', type: 'text', placeholder: 'loomi'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials): Promise<User | null> {
        const users = [
          {
            id: 'test-user-1',
            userName: 'test1',
            name: 'Test 1',
            password: '1234',
            email: 'eduardo@test.com',
          },
          {
            id: 'test-user-2',
            userName: 'test2',
            name: 'Test 2',
            password: '1234',
            email: 'paulo@test.com',
          },
        ];
        const user = users.find(
          (user) =>
            user.userName === credentials.username &&
            user.password === credentials.password
        );
        return user ? {id: user.id, name: user.name, email: user.email} : null;
      },
    }),
  ],
  secret: process.env.NEXAUTH_SECRET,
};

export const {handlers, signIn, signOut, auth} = NextAuth(authOptions);

// callbacks: {
//     async jwt({token, user}) {
//       return {...token, ...user};
//     },
//     async session({session, token, user}) {
//       session.user = token;
//       return session;
//     },
//   }
