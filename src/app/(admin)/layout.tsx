import { Nunito } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/global/Navbar'

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
        <Navbar
          label={'Job List'}
          src="/asset/global/TemplateAdmin.jpg"
        />
        {children}
      </main>
    </>
  )
}
