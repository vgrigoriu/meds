import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meds",
  description: "Medication inventory for your household",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
