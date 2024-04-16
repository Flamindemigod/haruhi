import '~/styles/globals.css';
import '@radix-ui/themes/styles.css';

import { cookies } from 'next/headers';

import { TRPCReactProvider } from '~/trpc/react';
import ThemeWrapper from './_components/ThemeWrapper';
import { Theme } from '@radix-ui/themes';
import genMeta from './utils/genMeta';
import { Viewport } from 'next';
import { Header } from './_components/Header';
import SessionWrapper from './_components/SessionWrapper';
import Footer from './_components/Footer';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import { UserProvider } from './_contexts/User';
import { CardProvider } from './_contexts/CardContext';

export const viewport: Viewport = {
  themeColor: '#cc006d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = genMeta({});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesh = await getServerAuthSession();
  if (!!sesh?.user) {
    await api.user.refreshUser.mutate();
  }
  return (
    <html lang='en'>
      <body className='relative min-h-svh overflow-x-clip font-sans'>
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionWrapper>
            <ThemeWrapper>
              <UserProvider>
                <CardProvider>
                  <Theme
                    accentColor='pink'
                    panelBackground='translucent'
                    radius='large'
                    scaling='90%'
                  >
                    <div className='flex flex-col '>
                      <div>
                        <Header />
                      </div>
                      <main className='relative flex w-full flex-grow'>
                        {children}
                      </main>
                      <div className=''>
                        <Footer />
                      </div>
                    </div>
                    <div className='sticky bottom-0 h-fit bg-red-400'>
                      {/*Reserved for Media Editor Button*/}
                      <div id={'editor-area'}></div>
                      <div id={'nav-top-panel'}></div>
                      {/* Reserved for Mobile Navigation */}
                      <div className='relative' id={'bot-navigation'}></div>
                    </div>
                  </Theme>
                </CardProvider>
              </UserProvider>
            </ThemeWrapper>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
