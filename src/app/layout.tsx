import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Task Genie — Remote work, built on trust",
    template: "%s · Task Genie",
  },
  description:
    "A trusted marketplace connecting Filipino remote professionals with thoughtful global teams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
