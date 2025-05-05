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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  rePassword: z.string().min(1, {
    message: "Re-Password is required",
  }),
})

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


export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      rePassword: "",
    },
  })

  const validateUserInput = (values: z.infer<typeof formSchema>) => {
    // Handle form submission logic here
    console.log(values);
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
                      {field.type === "textarea" ? (
                        <Textarea className="h-80" placeholder={field.placeholder} {...inputField} />
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
      </main >
    </>
  );
}