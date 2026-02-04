"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearForgotPasswordEmail } from "@/features/auth/authSlice";
import { toast } from "react-toastify";
import type { ApiError } from "@/types/auth.types";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const forgotPasswordEmail = useAppSelector((state) => state.auth.forgotPasswordEmail);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Redirect if no email stored
  useEffect(() => {
    if (!forgotPasswordEmail) {
      router.push("/auth/forgot-password");
    }
  }, [forgotPasswordEmail, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!forgotPasswordEmail) return;
    
    try {
      const result = await resetPassword({
        email: forgotPasswordEmail,
        password: data.password,
      }).unwrap();
      
      toast.success(result.message || "Your password has been reset successfully!");
      
      // Clear forgot password email and redirect to login
      router.push("/auth/login");
      setTimeout(() => {
        dispatch(clearForgotPasswordEmail());
      }, 100);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to reset password. Please try again.");
    }
  };

  if (!forgotPasswordEmail) {
    return null;
  }

  return (
    <div
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 w-full max-w-[470px] mx-4"
      style={{
        minHeight: "356px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-900 font-medium">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
