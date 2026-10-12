import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, Info } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

const REMEMBER_KEY = 'usalama_demo_email';

export default function Login() {
  const { signedIn, signIn } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_KEY)));
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  if (signedIn) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Enter your work email address.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address, like name@example.com.';
    if (!password) next.password = 'Enter your password.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    const ok = await signIn(email, password);
    setLoading(false);
    if (!ok) {
      setFormError('The email or password is not correct. Check your details and try again.');
      return;
    }
    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
    else localStorage.removeItem(REMEMBER_KEY);
    navigate('/dashboard', { replace: true });
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    setFormError('');
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <Logo />
        <h1>Administrator Login</h1>
        <p className="muted">Sign in to review and manage submitted reports.</p>

        <div className="notice notice-info" role="note">
          <Info size={18} aria-hidden="true" />
          <div>
            <strong>Simulated sign-in.</strong> This is a frontend demonstration with no real authentication.
            Demo account: <span className="mono">{DEMO_EMAIL}</span> / <span className="mono">{DEMO_PASSWORD}</span>
            <div>
              <button type="button" className="link-btn" onClick={fillDemo}>Fill in demo details</button>
            </div>
          </div>
        </div>

        {formError && (
          <div className="notice notice-error" role="alert">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
          </div>

          <div className={`field ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="input-action">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="icon-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p id="password-error" className="field-error">{errors.password}</p>}
          </div>

          <div className="login-row">
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember my email
            </label>
            <button type="button" className="link-btn" onClick={() => setForgotOpen(true)}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (<><span className="spinner spinner-sm" aria-hidden="true" /> Signing in…</>) : 'Sign In'}
          </button>
        </form>
      </div>

      {forgotOpen && (
        <Modal
          title="Reset password"
          onClose={() => setForgotOpen(false)}
          labelledBy="forgot-title"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setForgotOpen(false)}>Close</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setForgotOpen(false);
                  notify('Demo only: no reset email was sent.', 'info');
                }}
              >
                Send reset link
              </button>
            </>
          }
        >
          <p>In the live system, a reset link would be emailed to you. In this demonstration no email is sent.</p>
        </Modal>
      )}
    </div>
  );
}