import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localErr, setLocalErr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalErr('');

    let success = false;
    if (isRegistering) {
      if (!name || !email || !password) {
        setLocalErr('Please fill in all registration fields');
        setSubmitting(false);
        return;
      }
      success = await register(name, email, password);
    } else {
      if (!email || !password) {
        setLocalErr('Please enter your email and password');
        setSubmitting(false);
        return;
      }
      success = await login(email, password);
    }

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isRegistering ? 'Create To Do List Account' : 'Sign In to To Do List'}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {(error || localErr) && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error || localErr}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={submitting}>
            {submitting
              ? 'Processing...'
              : isRegistering
              ? 'Create Account'
              : 'Sign In'}
          </button>

          <div className="auth-switch">
            <span>
              {isRegistering
                ? 'Already have an account?'
                : "Don't have an account?"}
            </span>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setLocalErr('');
              }}
            >
              {isRegistering ? 'Sign In' : 'Register Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
