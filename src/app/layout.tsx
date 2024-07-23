import '@mantine/core/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@/app/globals.css';

import {
  ColorSchemeScript,
  // MantineColorsTuple,
  MantineProvider,
} from '@mantine/core';
import { createTheme } from '@mantine/core';
import type { Metadata } from 'next';

// const myColor: MantineColorsTuple = [
//   '#e1f9ff',
//   '#ccedff',
//   '#9ad7ff',
//   '#64c1ff',
//   '#3baefe',
//   '#20a2fe',
//   '#099cff',
//   '#0088e4',
//   '#0078cd',
//   '#0069b6',
// ];
// const theme = createTheme({
//   colors: {
//     myColor,
//   },
// });
// import { ActionIcon, Loader } from '@mantine/core';
// import Head from 'next/head';
import { auth } from '@/auth';
import { AuthProvider } from '@/context/AuthProvider';

const theme = createTheme({
  // primaryColor: 'indigo',
  defaultRadius: 'md',
  focusRing: 'always',
  // fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
  // components: {
  //   ActionIcon: ActionIcon.extend({
  //     defaultProps: {
  //       variant: 'subtle',
  //     },
  //   }),
  //   Loader: Loader.extend({
  //     defaultProps: {
  //       type: 'bars',
  //     },
  //   }),
  // },
});

export const metadata: Metadata = {
  title: 'Eventizer',
  description: 'Events and Tickets Management System',
  icons: {
    icon: '/logo-wbg.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        {/* <title>Eventizer</title>
        <link rel="image/png" href="/logo-wbg.png" sizes="1000x1000" />
        <meta
          name="description"
          content="Events and Tickets Management System"
        /> */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AuthProvider session={session}>{children}</AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
