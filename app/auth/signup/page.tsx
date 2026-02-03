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

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log("Signup data:", data);
      // Add your signup API call here
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 w-full max-w-[470px] mx-4"
      style={{
        minHeight: "806px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back Admin!
        </h1>
        <p className="text-gray-600">Sign up on your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-900 font-medium">
            Frist Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Shipon"
            {...register("firstName")}
            className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-900 font-medium">
            Last name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Shipon"
            {...register("lastName")}
            className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900 font-medium">
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+6464"
            {...register("phone")}
            className="w-full h-[48px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

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

        {/* Signup Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !agreedToTerms}
          className="w-full h-[48px] bg-[#0F744F] hover:bg-[#0d6344] text-white font-medium rounded-xl text-base"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>

        {/* Sign In Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#0F744F] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

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
            onClick={() => console.log("Google signup")}
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
            onClick={() => console.log("Facebook signup")}
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
