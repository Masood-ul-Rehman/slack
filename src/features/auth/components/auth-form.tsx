"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import z from "zod";
import { Warning } from "@phosphor-icons/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GithubIco from "@/components/icons/github";
import GoogleIco from "@/components/icons/google";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthFormProps, authFormSchema } from "@/features/auth/types";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";
import { redirectToWorkspace } from "@/lib/utils";

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
  });
  const { data, isLoading } = useGetWorkspaces();
  const [text, setText] = useState({
    title: "",
    description: "",
    button: "",
    footer: "",
    footerLink: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleProviderSignin = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      redirectToWorkspace(router, type, data, isLoading);
    });
  };

  const onPasswordSignin = async (values: z.infer<typeof authFormSchema>) => {
    setPending(true);
    signIn("password", { ...values, flow: type })
      .catch((err) => {
        type == "signIn"
          ? setError("Email or password is incorrect")
          : setError("Unknown error occurred");
      })
      .finally(() => {
        redirectToWorkspace(router, type, data, isLoading);
        setPending(false);
      });
  };

  useEffect(() => {
    if (type == "signIn") {
      setText({
        title: "Sign in to your account",
        description: "Enter your email below to sign in",
        button: "Sign in",
        footer: " New to slack? Signup instead",
        footerLink: "/auth/signup",
      });
    } else {
      setText({
        title: "Create an account",
        description: "Enter your email below to create your account",
        button: "Create account",
        footer: "Already have an account? Sign in instead",
        footerLink: "/auth/signin",
      });
    }
  }, [type]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            disabled={pending}
            variant="outline"
            className="w-full"
            onClick={() => handleProviderSignin("github")}
          >
            <div className="mr-2 h-4 w-4">
              <GithubIco />
            </div>
            Github
          </Button>
          <Button
            disabled={pending}
            variant="outline"
            className="w-full"
            onClick={() => handleProviderSignin("google")}
          >
            <div className="mr-2 h-4 w-4">
              <GoogleIco />
            </div>
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onPasswordSignin)}
          >
            {error && (
              <div className="text-red-500 text-center text-sm flex gap-2 items-center justify-center ">
                <Warning /> {error}
              </div>
            )}
            {type == "signUp" && (
              <FormField
                disabled={pending}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter you full name"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              disabled={pending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={pending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  {type == "signIn" && (
                    <div className="text-right w-full">
                      <h4 className="text-xs text-gray-600 font-medium hover:underline cursor-pointer">
                        Forgot password?
                      </h4>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-3" type="submit">
              {text.button}
            </Button>
          </form>
        </Form>
        {
          <Link href={text.footerLink}>
            <h4 className="text-center text-xs font-medium hover:underline mt-3 text-gray-600">
              {text.footer}
            </h4>
          </Link>
        }
      </CardContent>
    </Card>
  );
};

export default AuthForm;
