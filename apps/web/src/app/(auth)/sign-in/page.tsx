"use client";

import Link from "next/link";

import { LoginForm } from "../_components/login-form";

export default function SignInPage() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Sign in to your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to sign in.</p>
        </div>
        <div className="space-y-4">
          <LoginForm
            onSuccess={() => {
              window.location.href = "/dashboard";
            }}
          />
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-[#5C5F66]">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[#EDEDED] underline underline-offset-4 hover:no-underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
