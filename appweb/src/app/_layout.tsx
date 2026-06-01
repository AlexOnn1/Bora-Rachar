import { Stack } from 'expo-router';
import { JogadoresProvider } from '@/context/JogadoresContext';
import { SplashProvider } from '@/components/SplashTransition';

export default function RootLayout() {
  return (
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
  );
}
