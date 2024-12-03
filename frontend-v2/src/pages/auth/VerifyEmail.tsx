import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios/config";
import axios from "axios";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState<number>(300); // 5 minutes
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/auth/verify-email/", {
        email,
        verification_code: verificationCode,
      });
      toast.success("Email verified successfully!");
      // Navigate to the desired page, e.g., dashboard or login
      navigate("/dashboard");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Invalid verification code.";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-verification-code/", { email });
      toast.success("Verification code resent successfully!");
      setTimer(300); // Reset timer to 5 minutes
      setCode(["", "", "", "", "", ""]); // Clear input fields
      inputRefs.current[0]?.focus(); // Focus on the first input
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Unable to resend verification code.";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    // Redirect to sign-up page if email is not available
    return <Navigate to="/sign-up" replace />;
  }

  return (
    <section className="flex items-center justify-center bg-background text-foreground mt-6">
      <FormCard
        title="Verify Your Email"
        description={`A verification code has been sent to ${email}. Please enter it below.`}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Verification Code Inputs */}
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl text-black border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center text-sm text-muted-foreground">
              {timer > 0 ? (
                <p>Code expires in {formatTime(timer)}</p>
              ) : (
                <p className="text-red-500">Code expired. Please resend.</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-primary text-primary-foreground"
              disabled={isSubmitting || code.join("").length !== 6}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>

            {/* Resend Code */}
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend Verification Code"}
              </button>
            </div>
          </div>
        </form>
      </FormCard>
    </section>
  );
};

export default VerifyEmail;
