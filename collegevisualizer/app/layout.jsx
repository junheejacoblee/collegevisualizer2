import './globals.css';
import Link from 'next/link';
import NavLinks from '../components/NavLinks';
import ThemeToggle from '../components/ThemeToggle';
import Script from 'next/script';
import ThemeProvider from '../components/ThemeProvider';

export const metadata = {
  title: { default: 'College Visualizer', template: '%s | College Visualizer' },
  description: 'Explore admissions, costs, earnings, and application requirements for 1,400+ U.S. colleges.',
};

// Uniform-stroke capital Λ — equal width arms, like a sans-serif capital lambda
// Built as a path with consistent stroke weight throughout
const LogoMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M2 20 L12 4 L22 20"
      stroke="var(--accent)"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
    />
    <path
      d="M7 20 L12 11 L17 20"
      stroke="var(--bg)"
      strokeWidth="0"
      fill="var(--bg)"
    />
  </svg>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-70FXFDZ65C"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-70FXFDZ65C');
          `}
        </Script>
        <ThemeProvider>
          <nav style={{
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            gap: '1rem',
            overflow: 'visible',
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '14px 0',
              flexShrink: 0,
              textDecoration: 'none',
            }}>
              {/* Δ delta — smooth rounded triangle, matches favicon */}
              <svg width="15" height="15" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                <polygon points="16,7 5.5,25 26.5,25" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: 'var(--accent)',
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}>
                collegevisualizer
              </span>
            </Link>
            <NavLinks />
            <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <ThemeToggle />
            </div>
          </nav>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
