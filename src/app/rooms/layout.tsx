import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salas de Poker | SUPERNOVA',
  description: 'Descubre las mejores salas de poker online con bonos exclusivos, rakeback competitivo y torneos las 24 horas.',
  keywords: 'salas poker, poker online, rakeback, bonos poker, torneos poker',
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}