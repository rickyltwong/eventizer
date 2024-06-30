import '@mantine/core/styles.css';
import {
  MantineProvider,
  ColorSchemeScript,
  MantineColorsTuple,
} from '@mantine/core';

import { Libre_Franklin } from 'next/font/google';
import { Chivo } from 'next/font/google';

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
});
const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
});

import type { Metadata } from 'next';
import './globals.css';

// const inter = Inter({ subsets: ["latin"] });

import { createTheme } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#e1f9ff',
  '#ccedff',
  '#9ad7ff',
  '#64c1ff',
  '#3baefe',
  '#20a2fe',
  '#099cff',
  '#0088e4',
  '#0078cd',
  '#0069b6',
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

export const metadata: Metadata = {
  title: 'Eventizer',
  description: 'Events and Tickets Management System',
  icons: {
    icon: '/logo-wbg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        {/* <link rel="shortcut icon" href="/favicon.svg" /> */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}

