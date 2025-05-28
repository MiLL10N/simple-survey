import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"], // Add 'thai' subset
  variable: "--font-poppins", // Define a CSS variable
  weight: ["300", "400", "500", "600", "700", "800"], // Specify desired weights
});

export const metadata: Metadata = {
  title: "Simple Questionnaire", // Updated title
  description: "A user-friendly questionnaire application.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans`} // Apply Poppins variable AND font-sans utility
      >
        {children}
      </body>
    </html>
  );
}
