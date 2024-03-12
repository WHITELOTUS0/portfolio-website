//utils/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const GITHUB_ID = process.env.NEXT_PUBLIC_GITHUB_ID!;
const GITHUB_SECRET = process.env.NEXT_PUBLIC_GITHUB_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXT_PUBLIC_NEXAUTH_SECRET!;


export const authOptions: NextAuthOptions = {
    secret: NEXTAUTH_SECRET,
    

    providers: [
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
    ],
};
