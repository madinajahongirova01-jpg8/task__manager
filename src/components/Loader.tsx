interface LoaderProps {
  label?: string;
  size?: string;
}

function Loader({ label, size = 'large' }: LoaderProps) {
  return (
    <div className={'loader loader--' + size}>
      <span className="loader__spinner" />
      {label && <span className="loader__label">{label}</span>}
    </div>
  );
}

export default Loader;
