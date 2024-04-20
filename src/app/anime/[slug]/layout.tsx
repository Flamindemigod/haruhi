import genMeta from '~/app/utils/genMeta';

export const metadata = genMeta({});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
