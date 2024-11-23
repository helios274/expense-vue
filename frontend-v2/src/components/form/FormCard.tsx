import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // shadcn components

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  description,
  children,
  className = "",
}) => (
  <Card
    className={`w-full max-w-md bg-card text-card-foreground p-4 rounded-lg shadow-md border-0 ${className}`}
  >
    <CardHeader className="p-4">
      <CardTitle className="text-2xl font-bold text-center mb-3">
        {title}
      </CardTitle>
      <CardDescription className="text-center">{description}</CardDescription>
    </CardHeader>
    <CardContent className="p-4">{children}</CardContent>
  </Card>
);

export default FormCard;
