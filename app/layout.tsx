import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

export const metadata: Metadata = {
  title: "Home page",
  description: "This is the home page of the todo list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="flex flex-col justify-between">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <footer className="flex center-center p-2 border-t-2 border-x-border">
              <p>Task manger &copy; {new Date().getFullYear()}</p>
            </footer>
          </ThemeProvider>
        </body >
      </html >
    </>
  );
}
