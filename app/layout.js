
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClerkWrapperManual from './Wrappers/ClerkWrapperManual'
import { ToastContainer } from 'react-toastify'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata= {
  title: 'ASTRO_TALK APP',
  description: 'An App That tell About Your Astrology and all',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              {children}
        <ToastContainer position='top-center'/>
      </body>
    </html>
  )
}