"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useSendOtpMutation } from "@/store/api/authApi";
import type { ApiError } from "@/types/auth.types";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const router = useRouter();
  const forgotPasswordEmail = useAppSelector((state) => state.auth.forgotPasswordEmail);
  
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  // Redirect if no email stored
  useEffect(() => {
    if (!forgotPasswordEmail) {
      router.push("/auth/forgot-password");
    }
  }, [forgotPasswordEmail, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 4 || !forgotPasswordEmail) {
      return;
    }

    try {
      const result = await verifyOtp({
        email: forgotPasswordEmail,
        otp: otpString,
      }).unwrap();
      
      toast.success(result.message || "OTP verified successfully!");
      router.push("/auth/reset-password");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!canResend || !forgotPasswordEmail) return;
    
    try {
      const result = await sendOtp({ email: forgotPasswordEmail }).unwrap();
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success(result.message || "OTP resent to your email!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  if (!forgotPasswordEmail) {
    return null;
  }

  return (
    <div
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 w-full max-w-[470px] mx-4"
      style={{
        minHeight: "304px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#E8F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-[#0F744F]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Verify OTP
        </h1>
        <p className="text-gray-600">
          We&apos;ve sent a 4-digit verification code to{" "}
          <span className="font-medium text-gray-900">{forgotPasswordEmail}</span>
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F744F] focus:border-transparent transition-all"
            />
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !isOtpComplete}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Didn&apos;t receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#0F744F] font-medium hover:underline disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            ) : (
              <span className="text-gray-400">
                Resend in {resendTimer}s
              </span>
            )}
          </p>
        </div>

        {/* Back to Forgot Password */}
        <div className="text-center pt-2">
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
}
