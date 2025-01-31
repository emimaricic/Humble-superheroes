"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
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
import { loginMutationFn } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";

export default function Login() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email().min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        router.replace(`/superheroes`);
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

  return (
    <AuthWrapper>
      <div className="z-10 mx-auto my-[40px] flex h-full max-w-[582px] flex-1 flex-col overflow-y-auto md:mx-0 md:justify-center rounded-lg px-2 py-4 bg-gray-200 dark:bg-gray-200/10">
        <AuthHeader
          title="Welcome back"
          description="Access your projects and pick up right where you left off"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Input placeholder="subscribeto@channel.com" {...field} />
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
            <Button
              className="h-[48px] w-full gap-x-2 rounded-[18px]"
              disabled={isPending}
              type="submit"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-xs font-normal text-muted-foreground">
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
        <div className="my-4 flex w-full items-center gap-x-2 text-sm">
          <p className="text-muted-foreground">Don&apos;t have an account?</p>
          <Link href={"/auth/signup"} className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
}
