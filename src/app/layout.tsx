import './globals.css';
import { LogbookProvider } from '@/context/LogbookContext';

export const metadata = {
  title: 'WorkStory | Enterprise Edition',
  description: 'Document your internship in 60 seconds a day with AI-assisted documentation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LogbookProvider>{children}</LogbookProvider>
      </body>
    </html>
  );
}

