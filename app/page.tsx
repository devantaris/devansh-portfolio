export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/blueprint.html" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/blueprint.html');`,
        }}
      />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/blueprint.html" />
        <a href="/blueprint.html">Enter Blueprint</a>
      </noscript>
    </>
  );
}
