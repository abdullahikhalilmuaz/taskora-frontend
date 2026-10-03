import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 90, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, letterSpacing: -4 }}>404</div>
      <h1 style={{ fontSize: 20, margin: '18px 0 6px' }}>Page not found</h1>
      <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 24 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <i className="fas fa-house" /> Go Home
      </Link>
    </div>
  );
}
