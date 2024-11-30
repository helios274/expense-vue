import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import { signupSchema } from "@/lib/validation/authSchemas";

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp = () => {
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Form Data:", data);
    try {
    } catch (error) {}
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
            Sign Up
          </Button>
        </Form>
      </FormCard>
    </section>
  );
};

export default SignUp;
