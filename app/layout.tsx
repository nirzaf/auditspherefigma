import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AuditSphere | STE Audit Management Platform v2.2',
  description: 'Enterprise audit management workstation complying with International Standards on Auditing (ISA) & IFRS in Qatari Riyal (QAR). 7-phase audit workflow, split P&L / Balance Sheet fieldwork, dual-key gatekeeper, materiality engine, review notes, and ISA 230 compliance archive.',
  openGraph: {
    title: 'AuditSphere | STE Audit Management Platform v2.2',
    description: 'Enterprise audit management workstation complying with International Standards on Auditing (ISA) & IFRS in Qatari Riyal (QAR).',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuditSphere | STE Audit Management Platform v2.2',
    description: 'Enterprise audit management workstation complying with International Standards on Auditing (ISA) & IFRS in Qatari Riyal (QAR).',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
