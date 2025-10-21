import { Nunito } from 'next/font/google'
import '@/styles/globals.css'
import NavbarProgress from '@/components/global/NavbarProgress'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className={`${nunito.variable} antialiased`}>
        <NavbarProgress />
        {children}
      </main>
    </>
  )
}
