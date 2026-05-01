export const metadata = {
  title: 'WorldView 3D',
  description: 'An interactive 3D globe application that displays comprehensive country information',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}