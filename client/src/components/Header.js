export default function Header() {
  return (
    <header className="title">
      <h1>Upload an image</h1>
      <p>
        {' '}
        (Supported image types:{' '}
        <strong>
          <em>*.jpg</em>
        </strong>
        ,{' '}
        <strong>
          <em>*.jpeg</em>
        </strong>
        ,{' '}
        <strong>
          <em>*.png</em>
        </strong>
        )
      </p>
    </header>
  );
}
