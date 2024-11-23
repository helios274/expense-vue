import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Button } from "@/components/ui/button";
import FormCard from "@/components/form/FormCard";
import { signinSchema } from "@/lib/validation/authSchemas";

type SigninFormValues = z.infer<typeof signinSchema>;

const SignIn = () => {
  const methods = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SigninFormValues) => {
    console.log("Form Data:", data);
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
            Sign In
          </Button>
        </Form>
      </FormCard>
    </section>
  );
};

export default SignIn;
