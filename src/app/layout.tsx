import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './provider'
import { Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  metadataBase: new URL('https://vocal-clone.vercel.app/'),
  title: 'Ink Labs - Read, Write and Create Stories',
  applicationName: 'Ink Labs',
  description: 'A full‑stack blogging platform inspired by Vocal—read, write, publish, and discover stories.',
  openGraph: {
    title: 'Ink Labs - Read, Write and Create Stories',
    description: 'Ink Labs is a full‑stack blogging platform inspired by Vocal—read, write, publish, and discover stories.',
    url: 'https://vocal-clone.vercel.app/',
    siteName: "Ink Labs",
    images: [
      {
        url: "images/preview.png", // place preview.png inside /public
        width: 1200,
        height: 630,
        alt: "Preview of AI-generated room setup",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Ink Labs - Read, Write and Create Stories',
    description: 'Ink Labs is a full‑stack blogging platform inspired by Vocal—read, write, publish, and discover stories.',
    images: ["/images/preview.png"], // same image as above
  },
  generator: "v0.app",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
