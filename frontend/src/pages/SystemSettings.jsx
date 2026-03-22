import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/client';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    companyName: '', companyLogo: '', gstin: '', pan: '', registeredAddress: '',
    smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', smtpFromName: '',
    whatsappApiKey: '', firebaseConfig: '', defaultGSTRate: 18,
    quotationValidity: 30, followupReminderDays: 2, escalationThresholdDays: 5,
    quoteAbandonDays: 60, bankName: '', bankAccountNumber: '', ifscCode: '', upiId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(s => ({ ...s, ...res.data.data.settings }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.patch('/settings', settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center min-h-[60vh] items-center"><Loader2 className="animate-spin w-8 h-8 text-brand-600" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage global system configuration and defaults.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-sm shadow-brand-500/30">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Settings
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="font-medium">{message}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" /> Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label><input type="text" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Company Logo (URL/Base64)</label><input type="text" value={settings.companyLogo} onChange={e => setSettings({...settings, companyLogo: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label><input type="text" value={settings.gstin} onChange={e => setSettings({...settings, gstin: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">PAN</label><input type="text" value={settings.pan} onChange={e => setSettings({...settings, pan: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label><textarea value={settings.registeredAddress} onChange={e => setSettings({...settings, registeredAddress: e.target.value})} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Bank Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Bank Details (For Quotations)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label><input type="text" value={settings.bankName} onChange={e => setSettings({...settings, bankName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label><input type="text" value={settings.bankAccountNumber} onChange={e => setSettings({...settings, bankAccountNumber: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label><input type="text" value={settings.ifscCode} onChange={e => setSettings({...settings, ifscCode: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label><input type="text" value={settings.upiId} onChange={e => setSettings({...settings, upiId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Defaults & Thresholds */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Operational Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Default GST Rate (%)</label><select value={settings.defaultGSTRate} onChange={e => setSettings({...settings, defaultGSTRate: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Quotation Validity (days)</label><input type="number" min="1" value={settings.quotationValidity} onChange={e => setSettings({...settings, quotationValidity: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Reminder (days)</label><input type="number" min="1" value={settings.followupReminderDays} onChange={e => setSettings({...settings, followupReminderDays: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Escalation Threshold (days)</label><input type="number" min="1" value={settings.escalationThresholdDays} onChange={e => setSettings({...settings, escalationThresholdDays: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Quote Abandon (days)</label><input type="number" min="1" value={settings.quoteAbandonDays} onChange={e => setSettings({...settings, quoteAbandonDays: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Technical */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Technical Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp API Key</label><input type="password" value={settings.whatsappApiKey} onChange={e => setSettings({...settings, whatsappApiKey: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Left blank for now" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Firebase Config Key</label><input type="password" value={settings.firebaseConfig} onChange={e => setSettings({...settings, firebaseConfig: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Left blank for now" /></div>
            <div className="md:col-span-2 mt-2"><h4 className="text-sm font-bold text-slate-900 mb-2">SMTP Configuration</h4></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label><input type="text" value={settings.smtpHost} onChange={e => setSettings({...settings, smtpHost: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label><input type="number" value={settings.smtpPort} onChange={e => setSettings({...settings, smtpPort: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">SMTP User</label><input type="text" value={settings.smtpUser} onChange={e => setSettings({...settings, smtpUser: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password</label><input type="password" value={settings.smtpPass} onChange={e => setSettings({...settings, smtpPass: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Left blank for now" /></div>
          </div>
        </div>

      </form>
    </div>
  );
};
export default SystemSettings;
