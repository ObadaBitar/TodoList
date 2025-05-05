"use client";
import NavBar from "@/app/static/components/nav-bar";
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
import { useMediaQuery } from "@/hooks/use-media-query";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  message: z.string().min(1, {
    message: "Message is required",
  }),
});

const fields: Array<{
  name: keyof z.infer<typeof formSchema>; label: string;
  placeholder: string; type?: "input" | "textarea";
}> = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      type: "input",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "input",
    },
    {
      name: "message",
      label: "Message",
      placeholder: "Enter your message",
      type: "textarea",
    },
  ];

export default function ContactUs() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const isMobile = useMediaQuery("(max-width: 768px)");


  return (
    <>
      <NavBar pageName="Contact Us" />
      <main >
        {isMobile ?(<></>) :(<h1 className="text-4xl w-full text-center p-1">Contact us page</h1>)}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-7 py-3">
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
                        <Textarea className="h-50" placeholder={field.placeholder} {...inputField} />
                      ) : (
                        <Input placeholder={field.placeholder} {...inputField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex items-center w-full justify-center ">
              <Button variant="outline" className="self-end w-full p-5 text-1xl" type="submit" >Contact</Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}