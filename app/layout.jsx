import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"

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
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Navigation />
            <main>{children}</main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
