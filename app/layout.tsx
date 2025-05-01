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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
