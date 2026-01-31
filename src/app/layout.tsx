import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import SplashScreen from '@/components/SplashScreen'
import Footer from '@/components/Footer'
import { portfolioData } from '@/data/portfolio'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata: Metadata = {
  title: {
    default: portfolioData.seo.title,
    template: `%s | ${portfolioData.personal.name}`
  },
  description: portfolioData.seo.description,
  keywords: portfolioData.seo.keywords,
  authors: [{ name: portfolioData.personal.name }],
  creator: portfolioData.personal.name,
  publisher: portfolioData.personal.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://raghavchawla.dev',
    title: portfolioData.seo.title,
    description: portfolioData.seo.description,
    siteName: `${portfolioData.personal.name} Portfolio`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: portfolioData.seo.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolioData.seo.title,
    description: portfolioData.seo.description,
    images: ['/og-image.jpg'],
    creator: portfolioData.social.twitter.split('twitter.com/')[1] || '@raghavchawla',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://raghavchawla.dev'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-slate-900 text-white antialiased`}>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
          <SplashScreen />
          <AnimatedBackground />
          {/* Background gradient effects */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
          </div>

          <Navbar />

          <main className="flex-1 relative z-10">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}