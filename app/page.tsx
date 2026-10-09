export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/landing/" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/landing/');`,
        }}
      />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/landing/" />
        <a href="/landing/">Enter terminal</a>
      </noscript>
    </>
  );
}
