import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
	tokenStore: "nextjs-cookie",
	urls: {
		afterSignIn: "/dashboard",
		afterSignOut: "/",
		afterSignUp: "/dashboard",
	},
});
