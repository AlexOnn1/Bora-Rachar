import { Stack } from 'expo-router';
import { JogadoresProvider } from '@/context/JogadoresContext';

export default function RootLayout() {
  return (
    <JogadoresProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A1A0A' },
          animation: 'slide_from_right',
        }}
      />
    </JogadoresProvider>
  );
}
