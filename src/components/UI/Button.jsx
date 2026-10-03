export default function Button({
  children, variant = 'primary', size, icon, loading, block, className = '', ...rest
}) {
  const cls = [
    'btn',
    'btn-' + variant,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading && <i className="fas fa-circle-notch spin" />}
      {!loading && icon && <i className={icon.startsWith('fa-') && !icon.includes(' ') ? 'fas ' + icon : icon} />}
      <span>{children}</span>
    </button>
  );
}
