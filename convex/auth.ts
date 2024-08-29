import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password, GitHub, Google],
});
