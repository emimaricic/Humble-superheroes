"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MailCheckIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";

export default function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const formSchema = z
    .object({
      name: z.string().trim().min(1, {
        message: "Name is required",
      }),
      email: z.string().trim().email().min(1, {
        message: "Email is required",
      }),
      password: z.string().trim().min(1, {
        message: "Password is required",
      }),
      confirmPassword: z.string().min(1, {
        message: "Confirm Password is required",
      }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  if (showMagicLink) {
    return (
      <AuthWrapper>
        <main className="z-10 mx-auto my-[40px] flex h-full max-w-[582px] flex-1 flex-col overflow-y-auto px-[2px] md:mx-0 md:justify-center">
          <AuthHeader
            title="Sign in with Magic Link"
            description="We'll send you a link to sign in instantly"
          />
          <p className="dark:text-slate- mt-7 text-xs font-normal text-muted-foreground">
            By signing in, you agree to our{" "}
            <a className="text-primary hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </main>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      {!isSubmitted ? (
        <div className="z-10 mx-auto my-[40px] flex h-full max-w-[582px] flex-1 flex-col overflow-y-auto px-[2px] md:mx-0 md:justify-center">
          <AuthHeader
            title="Create an account"
            description="Empower Your Projects, Simplify Your Success!"
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Techwithemma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="subscribeto@channel.com"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="h-[48px] w-full gap-x-2 rounded-[18px]"
                disabled={isPending}
                type="submit"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-xs font-normal text-muted-foreground">
            By signing up, you agree to our{" "}
            <a className="text-primary hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
          <div className="my-4 flex w-full items-center gap-x-2 text-sm">
            <p className="text-muted-foreground">Do you have an account?</p>
            <Link href={"/auth"} className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="absolute flex h-full w-full items-center justify-center">
          <div className="z-10 mx-auto flex h-full max-w-[582px] flex-1 flex-col items-center justify-center overflow-y-auto px-[2px] py-4 md:mx-0">
            <div className="size-[48px]">
              <MailCheckIcon size="48px" className="animate-bounce" />
            </div>
            <h2 className="text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
              Check your email
            </h2>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              We just sent a verification link to {form.getValues().email}.
            </p>
            <Link href="/">
              <Button className="h-[40px] gap-x-2">
                Go to login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthWrapper>
  );
}
