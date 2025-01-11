import { NewPostForm } from "@/components/forms/new-post";
import { TextEditor } from "@/components/text-editor";
import { Toaster } from "@/components/ui/toaster";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [value, setValue] = useState<any>(null);
  return (
    <div
    className="font-geist-sans font-geist-mono max-w-3xl mx-auto p-8"
    >
      <Toaster />
      <NewPostForm />
    </div>
  );
}
