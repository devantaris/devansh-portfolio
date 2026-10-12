export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/landing/" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              window.location.replace('/landing.html');
            } else {
              window.location.replace('/landing/');
            }
          `,
        }}
      />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/landing/" />
        <a href="/landing/">Enter terminal</a>
      </noscript>
    </>
  );
}
