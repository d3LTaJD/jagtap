import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Phone, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/client';

const Verify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mobile_number: '',
    token: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/verify', formData);
      if (response.data.data?.reference) {
        navigate('/set-password', { state: { referenceId: response.data.data.reference } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your inputs.');
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
            <ShieldCheck className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Account</h1>
          <p className="text-sm text-slate-500 mt-2">Enter your mobile number and the OTP/Invite code provided by your administrator.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number or Email</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="mobile_number" required value={formData.mobile_number} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900" placeholder="Enter mobile or email" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">OTP / Invite Token</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="token" required value={formData.token} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 tracking-widest font-mono" placeholder="XXXXXX" />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full relative flex items-center justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:ring-brand-500/20 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-600 mt-6">
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">Return to Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Verify;
