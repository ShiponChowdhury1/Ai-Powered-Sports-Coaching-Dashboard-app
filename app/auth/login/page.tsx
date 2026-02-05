"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation, useGoogleLoginMutation } from "@/store/api/authApi";
import type { ApiError } from "@/types/auth.types";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { baseApi } from "@/store/api/baseApi";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
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
    } catch (error) {
      const apiError = error as ApiError;
      
      if (apiError.data?.errors) {
        const errors = apiError.data.errors;
        if (errors.email) {
          setError("email", { message: errors.email[0] });
          toast.error(errors.email[0]);
        }
        if (errors.password) {
          setError("password", { message: errors.password[0] });
          toast.error(errors.password[0]);
        }
      } else {
        const errorMessage = apiError.data?.message || "Invalid email or password. Please check your credentials and try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await googleLogin({
          access_token: tokenResponse.access_token,
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
            email: "",
            name: "Admin",
            role: "Admin",
          },
        }));
        
        toast.success(result.message || "Logged in successfully with Google!");
        router.push("/dashboard");
      } catch (error) {
        const apiError = error as ApiError;
        toast.error(apiError.data?.message || "Google login failed. Please try again.");
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            I&apos;ve read and agree with the{" "}
            <Link href="/terms" className="text-gray-900 underline font-medium">
              Terms and Conditions
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="text-gray-900 underline font-medium">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading || !agreedToTerms}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 h-[48px] flex items-center justify-center gap-3 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => handleGoogleLogin()}
          >
            <Image
              src="/auth/search.png"
              alt="Google"
              width={24}
              height={24}
            />
            <span className="font-medium text-gray-700">Google</span>
          </button>
          <button
            type="button"
            className="flex-1 h-[48px] flex items-center justify-center gap-3 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => console.log("Facebook login")}
          >
            <Image
              src="/auth/facebook.png"
              alt="Facebook"
              width={24}
              height={24}
            />
            <span className="font-medium text-gray-700">Facebook</span>
          </button>
        </div>
      </form>
    </div>
  );
}
