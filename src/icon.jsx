// Lucide icon wrapper for React. Renders SVG from window.lucide icon data.
const toPascal = (s) => s.split(/[-_]/).map(p => p ? p[0].toUpperCase() + p.slice(1) : '').join('');

function Icon({ name, size = 18, strokeWidth = 1.75, className = '', style }) {
  const iconName = toPascal(name);
  const data = (window.lucide && (window.lucide[iconName] || window.lucide.icons?.[iconName]));
  if (!data) {
    // fallback: empty span
    return <span style={{ display: 'inline-block', width: size, height: size }} className={className} />;
  }
  // data may be: [tag, attrs, children] OR array of children
  let children;
  if (Array.isArray(data) && data.length === 3 && typeof data[0] === 'string' && data[0] === 'svg') {
    children = data[2] || [];
  } else if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
    children = data;
  } else if (data.toSvg) {
    // fallback to dangerously set
    return <span ref={(el) => { if (el) el.innerHTML = data.toSvg({ width: size, height: size, 'stroke-width': strokeWidth }); }} className={className} style={{ display: 'inline-flex', ...style }} />;
  } else {
    children = [];
  }
  const renderNode = (node, i) => {
    if (!Array.isArray(node)) return null;
    const [tag, attrs] = node;
    const rest = { ...attrs };
    return React.createElement(tag, { key: i, ...rest });
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide ${className}`}
      style={{ display: 'inline-block', verticalAlign: '-2px', ...style }}
    >
      {children.map(renderNode)}
    </svg>
  );
}

window.Icon = Icon;
