import type { Metadata } from "next";

import 'jsvectormap/dist/jsvectormap.min.css'
// import '@/assets/scss/bootstrap.scss'
import '@/assets/scss/app.scss'
import '@/assets/scss/icons.scss'
import AppProvidersWrapper from "@/components/wrappers/AppProvidersWrapper";
import { DEFAULT_PAGE_TITLE } from "@/context/constants";

export const metadata: Metadata = {
  title: {
    template: '%s | Rumo Saudável',
    default: DEFAULT_PAGE_TITLE,
  },
  description: 'Rumo Saudável',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <AppProvidersWrapper>{children}</AppProvidersWrapper>
      </body>
    </html>
  );
}
