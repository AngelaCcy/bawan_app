// import type { NextAuthConfig } from "next-auth";

// export const authConfig = {
//   pages: {
//     signIn: "/signin",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnDashboard = nextUrl.pathname.startsWith("/");
//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false;
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL("/", nextUrl));
//       }
//       return true;
//     },
//   },
//   providers: [], // Configure your auth providers here
// } satisfies NextAuthConfig;
