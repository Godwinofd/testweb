import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Action Rénovation Habitat - Éligibilité MaPrimeRénov',
    description: 'Testez votre éligibilité aux aides d\'État pour vos travaux de rénovation énergétique',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    )
}
