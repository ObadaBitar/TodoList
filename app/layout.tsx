import type { Metadata } from "next";
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
    <html>
      <body className="flex flex-col justify-between">
        {children}
        <footer className="flex center-center p-2 border-t-2 border-x-border">
          <p>Task manger &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
