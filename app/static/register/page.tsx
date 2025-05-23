"use client";

import { useRouter } from "next/navigation";
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

const checkUsernameUnique = async (username: string) => {
  try {
    const response = await fetch(`/api/check_username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    throw new Error("Unable to check username uniqueness");
  }
}

const checkEmailUnique = async (email: string) => {
  try {
    const response = await fetch(`/api/check_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking email uniqueness:", error);
    throw new Error("Unable to check username uniqueness");
  }
}

const addUser = async (userName: string, userEmail: string, userPassword: string) => {
  try {
    const response = await fetch(`/api/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, userEmail, userPassword }),
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.addUser.toString();
  }
  catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Unable to add user");
  }
}

// REF: https://zod.dev/?id=functions
const formSchema = z.object({
  username: z.string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-z0-9]+$/i, { message: "Username must contain only alphanumeric characters" }),
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" }),
  rePassword: z.string()
    .min(1, { message: "Re-Password is required" }),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
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
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
    },
    {
      name: "rePassword",
      label: "Re-Password",
      placeholder: "Enter your password again",
    },
  ];

export default function Register() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      rePassword: "",
    },
  })

  const validateUserInput = async (values: z.infer<typeof formSchema>) => {
    try {
      const isUsernameUnique = await checkUsernameUnique(values.username);
      if (!isUsernameUnique) {
        form.setError("username", {
          type: "manual",
          message: "Username already exists"
        });
        return;
      }

      const isEmailUnique = await checkEmailUnique(values.email);
      if (!isEmailUnique) {
        form.setError("email", {
          type: "manual",
          message: "Email already exists"
        });
        return;
      }

      const result = await addUser(values.username, values.email, values.password);
      if (result > 0) {
        console.log("User added successfully:", result);
        localStorage.setItem('userId', result.toString());
        router.push("/dashboard/personal-tasks");
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  return (
    <>
      <NavBar pageName="Register" />
      <main className="flex justify-center h-screen">
        <ResponsiveTitle title="Register" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(validateUserInput)} className="space-y-3 px-7 py-3">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: inputField }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.name === "password" || field.name === "rePassword" ? (
                        <Input placeholder={field.placeholder} {...inputField} /> //TODO: ADD a hide and show password button
                      ) : (
                        <Input placeholder={field.placeholder} {...inputField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <span className="font-normal">Already have an account ?</span> <Button variant="link" className="p-0 text-1xl" type="submit" ><Link href={"/static/login"}> Log in</Link></Button>
            <div className="flex items-center w-full justify-center ">
              <Button variant="outline" className="self-end w-full p-5 text-1xl" type="submit" >Create account</Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}