import type { Metadata } from "next";
import "./globals.css";
import "./spacecrew.css";
import "./spacecrew-app.css";
import "./spacecrew-landing.css";
import "./apply-points.css";
import "./freelancer-waitlist.css";

export const metadata: Metadata = {
  title: {
    default: "Task Genie — Remote work, built on trust",
    template: "%s · Task Genie",
  },
  description:
    "A trusted worldwide marketplace connecting remote professionals with thoughtful teams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* The supplied skin loads these fonts in the browser; keep static export build-independent. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('tg-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
