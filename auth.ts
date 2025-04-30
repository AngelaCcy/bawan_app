import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Line from "next-auth/providers/line";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Line({ allowDangerousEmailAccountLinking: true }),
  ],
  adapter: PrismaAdapter(prisma),
  // callbacks: {
  //   async signIn({ account, profile, user }) {
  //     if (!account || !profile) {
  //       return false; // or handle appropriately
  //     }
  //     if (account.provider === "github" && profile.email === user.email) {
  //       return true;
  //     }

  //     if (account.provider === "google" && profile.email === user.email) {
  //       return true;
  //     }

  //     return true; // Allow sign-in for other cases
  //   },
  // },
});
