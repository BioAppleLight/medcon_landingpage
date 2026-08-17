import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans, Instrument_Serif, Manrope, Newsreader } from 'next/font/google'
import { AdaptiveProvider } from '@/components/adaptive-provider'
import './globals.css'
import { SITE_URL } from '@/lib/site'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
})
const newsreader = Newsreader({
  variable: '--font-newsreader',
  weight: '400',
  subsets: ['latin'],
})
const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})
const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  weight: '300',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MYO'S | AI Expert Avatars Available 24/7",
    template: "%s | MYO'S",
  },
  description:
    'MyOS turns your best experts into AI avatars that teach, guide, and answer questions in real time. Deploy AI-powered doctors, professors, and government assistants that scale knowledge 24/7.',
  applicationName: "MYO'S",
  keywords: [
    "AI expert avatars",
    "enterprise AI assistants",
    "AI knowledge platform",
    "AI training avatars",
    "digital human AI",
  ],
  authors: [{ name: "MYO'S", url: SITE_URL }],
  creator: "MYO'S",
  publisher: "MYO'S",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MYO'S",
    title: "MYO'S | AI Expert Avatars Available 24/7",
    description:
      "Turn trusted human expertise into interactive AI avatars that teach, guide, and answer questions at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYO'S | AI Expert Avatars Available 24/7",
    description:
      "Turn trusted human expertise into interactive AI avatars that teach, guide, and answer questions at scale.",
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "MYO'S",
        url: SITE_URL,
        email: "info@myos.sk",
        telephone: "+421902950910",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Abu Dhabi",
          addressCountry: "AE",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "MYO'S",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${newsreader.variable} ${manrope.variable} ${ibmPlexSans.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <AdaptiveProvider>{children}</AdaptiveProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
