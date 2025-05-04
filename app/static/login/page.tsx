"use client";
import NavBar from "@/app/static/components/NavBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
      label: "Name",
      placeholder: "Enter your name",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Message",
      placeholder: "Enter your password",
    },
    {
      name: "rePassword",
      label: "Re-Password",
      placeholder: "Enter your password again",
    },
  ];

export default function login() {

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
      <NavBar pageName="" />
      <main>
        <h1 className="text-4xl text-center">
          Register page
        </h1>

        <form onSubmit={validateUserInput}>
          <div className="input">
            <label htmlFor="usernName">User Name</label>
            <input type="text" id="usernName"></input>
          </div>

          <div className="input">
            <label htmlFor="email">Email</label>
            <input type="text" id="email"></input>
          </div>

          <div className="input">
            <label htmlFor="password">Password</label>
            <input type="text" id="password"></input>
          </div>

          <div className="input">
            <label htmlFor="rePassowrd">Re-Passowrd</label>
            <input type="text" id="rePassowrd"></input>
          </div>

          <div className="input tick-box">
            <input type="checkbox" id="showPassword"></input>
            <label htmlFor="showPassword">Show password</label>
          </div>

          <div className="submitForm">
            <input type="submit" id="registerBtn" value="Register now!"></input>
          </div>

        </form>
      </main>
    </>
  );
}
