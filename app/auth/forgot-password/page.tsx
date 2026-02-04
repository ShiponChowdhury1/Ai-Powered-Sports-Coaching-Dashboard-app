"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSendOtpMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setForgotPasswordEmail } from "@/features/auth/authSlice";
import { toast } from "react-toastify";
import type { ApiError } from "@/types/auth.types";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await sendOtp({ email: data.email }).unwrap();
      
      // Store email for OTP verification
      dispatch(setForgotPasswordEmail(data.email));
      
      toast.success(result.message || "OTP sent to your email!");
      router.push("/auth/verify-otp");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 w-full max-w-[470px] mx-4"
      style={{
        minHeight: "300px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
        </p>
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base"
        >
          {isLoading ? "Sending..." : "Send OTP"}
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
