import z from "zod";
export const authFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Password must be 8 characters or more",
  }),
});
