import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

// Add metadata
export const metadata = {
  title: 'VectorForge',
  description: 'Scenario Analysis Tool',
} 