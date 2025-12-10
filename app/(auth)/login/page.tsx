import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./_components/login-form";

const page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>Log in with your Google Account</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm/>
      </CardContent>
    </Card>
  );
};

export default page;
