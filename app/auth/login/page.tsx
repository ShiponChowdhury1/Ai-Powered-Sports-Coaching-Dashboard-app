"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { baseApi } from "@/store/api/baseApi";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      
      // Check if user is admin
      if (result.user && result.user.role !== "Admin") {
        toast.error("Only admin users can access the dashboard.");
        return;
      }
      
      // Clear API cache before setting new credentials to ensure fresh data
      dispatch(baseApi.util.resetApiState());
      
      // Store tokens and user in Redux and localStorage
      dispatch(setCredentials({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: result.user || {
          email: data.email,
          name: "Admin",
          role: "Admin",
        },
      }));
      
      toast.success(result.message || "Logged in successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const apiError = error as { data?: Record<string, unknown>; status?: number };
      const data = apiError?.data;

      // Backend returns errors in different formats: { detail: ... }, { error: ... }, { non_field_errors: [...] }
      const errorMessage =
        (data?.detail as string) ||
        (data?.error as string) ||
        (Array.isArray(data?.non_field_errors) ? (data.non_field_errors as string[])[0] : null) ||
        (data?.message as string) ||
        "Invalid email or password. Please check your credentials and try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 w-full max-w-[470px] mx-4"
      style={{
        minHeight: "518px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back Admin!
        </h1>
        <p className="text-gray-600">Sign in on your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-900 font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

      </form>
    </div>
  );
}
