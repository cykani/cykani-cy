"use client";

import Image from "next/image";
import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { RegisterForm } from "../_components/register-form";

export default function RegisterPage() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="flex justify-center">
          <Image src="/logo_black.png" alt="Cykani" width={32} height={32} className="h-8 w-auto" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Create your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to register.</p>
        </div>
        <div className="space-y-4">
          <RegisterForm
            onSuccess={() => {
              window.location.href = "/new";
            }}
          />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link prefetch={false} className="text-foreground" href="/sign-in">
            Sign in
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          ENG
        </div>
      </div>
    </>
  );
}
