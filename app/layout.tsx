import type { Metadata } from 'next'
import { Archivo, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Diễn đàn Kinh tế Tư nhân Hải Phòng 2026 | H-SOLO',
  description: 'Đột phá thể chế – Hợp lực công tư. Chuyên đề Doanh nghiệp 1 người OPC/Solopreneur. 09/06/2026, Nhà hát Hoa Phượng – Hải Phòng. Đăng ký ngay.',
  openGraph: {
    title: 'Diễn đàn Kinh tế Tư nhân Hải Phòng 2026 | H-SOLO',
    description: 'Đột phá thể chế – Hợp lực công tư. 09/06/2026, Nhà hát Hoa Phượng.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${archivo.variable} ${beVietnamPro.variable}`}>{children}</body>
    </html>
  )
}
