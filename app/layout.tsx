import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '지도 기반 매물 사이트',
  description: 'Notion과 Pory를 활용한 지도 기반 매물 홍보 사이트',
  keywords: ['매물', '부동산', '지도', 'Notion', 'Pory'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="h-screen">
        {children}
      </body>
    </html>
  )
} 