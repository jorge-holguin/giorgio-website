import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tactical Mode | Jorge Holguin',
  description: 'Interactive tactical briefing room - an immersive portfolio experience',
}

export default function TacticalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
