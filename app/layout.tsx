import './globals.css'

export const metadata = {
  title: 'Generative SQL',
  description: 'Generate SQL queries from natural language prompts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
