"use client";
import NavBar from "@/app/static/components/nav-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ResponsiveTitle from "@/components/responsive-title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Fixed import

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const fields: Array<{
  name: keyof z.infer<typeof formSchema>; label: string;
  placeholder: string; type?: "input" | "textarea";
}> = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your name",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
];

const checkUser = async (userName: string, userPassword: string) => {
  try {
    const response = await fetch(`/api/check_valid_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, userPassword }),
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.isValidUser;
  }
  catch (error) {
    console.error("Error checking user validity:", error);
    throw new Error("Unable to check user validity");
  }
};

export default function Login() {
  const router = useRouter(); // Fixed router initialization
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const validateUserInput = async (values: z.infer<typeof formSchema>) => {
    try {
      const parsedData = formSchema.parse(values);
      if (parsedData) {
        const username = parsedData.username.toString();
        const password = parsedData.password.toString();
        const result = await checkUser(username, password);
        if (result > 0) {
          localStorage.setItem('userId', result.toString());  
          router.push("/dashboard/personal-tasks"); 
        }
        // else{
        //   // TODO: Show error message to user maybe alert
        // }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <>
      <NavBar pageName="Log in" />
      <main className="flex justify-center h-screen">
        <ResponsiveTitle title="Log in" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(validateUserInput)} className="space-y-5 px-7 py-3">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: inputField }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.name === "password" ? (
                        <Input placeholder={field.placeholder} {...inputField} /> // TODO: Make a button to show and hide password 
                      ) : (
                        <Input placeholder={field.placeholder} {...inputField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button variant="link" className="p-0 text-1xl" type="submit" ><Link href={"/static/reset-password"}>Reset password</Link></Button>
            <div className="flex items-center w-full justify-center ">
              <Button variant="outline" className="self-end w-full p-5 text-1xl" type="submit" >Log in</Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}