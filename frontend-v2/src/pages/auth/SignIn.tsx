import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import { signinSchema } from "@/lib/validation/authSchemas";
import axios from "@/utils/axios/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type SigninFormValues = z.infer<typeof signinSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SigninFormValues) => {
    setIsSubmitting(true);
    try {
      await axios.post("auth/login/", data);
      toast.success("Sign-in successful!");
      navigate("/dashboard");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;
        const errorMessage =
          errorResponse.message || "An error occurred during sign-in.";
        toast.error(errorMessage);
        if (errorResponse?.code === "account_inactive") {
          navigate("/verify-email", { state: { email: data.email } });
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
      <FormCard title="Sign In" description="Welcome back">
        <Form methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 bg-primary text-primary-foreground"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </FormCard>
    </section>
  );
};

export default SignIn;
