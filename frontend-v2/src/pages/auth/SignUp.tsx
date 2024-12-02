import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import { signupSchema } from "@/lib/validation/authSchemas";
import axios from "@/utils/axios/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await axios.post("auth/register/", data);
      toast.success("Sign-up successful! Please verify your email.");
      // Navigate to verify-email page and pass the email securely
      navigate("/verify-email", { state: { email: data.email } });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred during sign-up.";
        toast.error(errorMessage);

        // Handle field-specific errors if provided by the server
        if (error.response.data.errors) {
          const fieldErrors = error.response.data.errors;
          Object.keys(fieldErrors).forEach((field) => {
            methods.setError(field as keyof SignupFormValues, {
              type: "server",
              message: fieldErrors[field][0],
            });
          });
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center bg-background text-foreground mt-6">
      <FormCard
        title="Sign Up"
        description="Create an account to start tracking your expenses"
      >
        <Form methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <div className="flex space-x-3">
              <Input
                name="first_name"
                label="First Name"
                type="text"
                placeholder="Enter your first name"
              />
              <Input
                name="last_name"
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
              />
            </div>
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <Input
              name="confirm_password"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 bg-primary text-primary-foreground"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form>
      </FormCard>
    </section>
  );
};

export default SignUp;
