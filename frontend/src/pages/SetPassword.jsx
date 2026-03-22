import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const referenceId = location.state?.referenceId;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!referenceId && !success) {
    return <Navigate to="/verify" replace />;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      return setError('Passwords do not match!');
    }

    setLoading(true); setError('');
    try {
      await api.post('/auth/set-password', { referenceId, ...formData });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password. Your session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/5 p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-100 rounded-2xl mb-4">
            <Lock className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set Secure Password</h1>
          <p className="text-sm text-slate-500 mt-2">Create a new password to secure your IndusFlow account.</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
             <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
               <CheckCircle2 className="w-8 h-8 text-emerald-600" />
             </div>
             <p className="text-emerald-700 font-bold">Password set successfully!</p>
             <p className="text-slate-500 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="password" name="new_password" required minLength="6" value={formData.new_password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="password" name="confirm_password" required minLength="6" value={formData.confirm_password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900" placeholder="••••••••" />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full relative flex items-center justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:ring-brand-500/20 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Save'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default SetPassword;
