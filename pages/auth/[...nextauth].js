// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/*
CS5356 TODO 1b. Authentication

Add sign in to your app by setting up NextAuth.

Define a CredentialsProvider with a username, and authorize the user
when they sign in by creating a user token that sets the user name
to be the provided username.

Note - For our prototype authentication system, we only need the username
and no password is required from the user.

See here for an example - https://next-auth.js.org/providers/credentials#example---username--password
*/

const options = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        // password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        const user = { id: `${Math.random()}`, name: credentials.username, email: credentials.username }
        
        return user
  
        // if (user) {
        //   // Any object returned will be saved in `user` property of the JWT
        //   return user
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   return null
  
        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      }
    })
  ], // <-- Fill this in.
  session: {
    jwt: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
