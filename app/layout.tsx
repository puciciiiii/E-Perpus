
/* eslint-disable react/no-children-prop */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Template from './components/Template'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Perpustakaan',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Template children={children} />
      </body>
    </html>
  )
}

