import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import { signinSchema } from "@/lib/validation/authSchemas";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";

type SigninFormValues = z.infer<typeof signinSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, status, error, emailForVerification } = useAppSelector(
    (state) => state.auth
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SigninFormValues) => {
    setIsSubmitting(true);
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (status === "succeeded" && accessToken) {
      toast.success("Sign-in successful!");
      navigate("/dashboard");
    } else if (status === "failed" && error) {
      setIsSubmitting(false);
      toast.error(error);
    } else if (status === "inactive" && emailForVerification) {
      toast.error(
        error || "Your account is inactive. Please verify your email."
      );
      navigate("/verify-email", { state: { email: emailForVerification } });
    }
  }, [status, accessToken, navigate, error, emailForVerification]);

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
