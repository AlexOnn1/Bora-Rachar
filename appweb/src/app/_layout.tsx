import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { JogadoresProvider } from '@/context/JogadoresContext';
import { SplashProvider } from '@/components/SplashTransition';

export default function RootLayout() {
  return (
    <>
      <Head>
        <link rel="icon" href="/assets/favicons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/assets/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/favicons/site.webmanifest" />
      </Head>
      <JogadoresProvider>
        <SplashProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#060E06' },
              animation: 'none', // a transição é feita pelo SplashTransition
            }}
          />
        </SplashProvider>
      </JogadoresProvider>
    </>
  );
}