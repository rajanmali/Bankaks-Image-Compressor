export default function PreviewList({ previewList }) {
  return (
    <ul className="preview-list">
      <h5>Check your uploaded images:</h5>
      {previewList.map((previewLink, index) => (
        <li key={JSON.stringify(previewLink)}>
          <a href={previewLink} target="_blank" rel="noreferrer">
            {`Preview Image #${index + 1}`}
          </a>
        </li>
      ))}
    </ul>
  );
}
