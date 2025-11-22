import "./globals.css";
export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
