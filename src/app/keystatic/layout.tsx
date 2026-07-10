/** Root layout dedicato al pannello (fuori dal layout [locale] del sito). */
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
