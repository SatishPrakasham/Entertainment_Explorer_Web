import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { ClientLayout } from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Entertainment Explorer",
  description: "Discover the best in movies, books, and music",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ClientLayout>
              <Navigation />
              <main>{children}</main>
            </ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
