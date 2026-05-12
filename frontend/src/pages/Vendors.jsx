import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../api/client';
import AutocompleteSelect from '../components/AutocompleteSelect';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', vendorType: 'Supplier', contactPerson: '', mobile: '', email: '', status: 'Active', gstNumber: '', notes: ''
  });

  const fetchVendors = async () => {
    try {
      const res = await api.get(`/vendors?search=${searchTerm}`);
      setVendors(res.data.data.vendors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendors();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const openModal = (vendor = null) => {
    setError('');
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name || '',
        vendorType: vendor.vendorType || 'Supplier',
        contactPerson: vendor.contactPerson || '',
        mobile: vendor.mobile || '',
        email: vendor.email || '',
        status: vendor.status || 'Active',
        gstNumber: vendor.gstNumber || '',
        notes: vendor.notes || ''
      });
    } else {
      setEditingVendor(null);
      setFormData({ name: '', vendorType: 'Supplier', contactPerson: '', mobile: '', email: '', status: 'Active', gstNumber: '', notes: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true); setError('');
    try {
      if (editingVendor) {
        await api.put(`/vendors/${editingVendor._id}`, formData);
      } else {
        await api.post('/vendors', formData);
      }
      setShowModal(false);
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving vendor');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendors Database</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your suppliers, contractors, and service providers.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-sm shadow-brand-500/30">
          <Plus className="w-4 h-4 mr-2" /> Add New Vendor
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm ring-1 ring-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search vendors by name, contact, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 uppercase tracking-widest text-slate-500 text-[10px] font-black italic">
                <tr>
                  <th className="px-6 py-4">Vendor Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{v.name}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{v.vendorType}</span></td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{v.contactPerson || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{v.mobile}<br/>{v.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(v)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(v._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">No vendors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0">
              <h2 className="text-lg font-black text-slate-900">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Vendor Type</label>
                  <AutocompleteSelect 
                    options={['Supplier', 'Contractor', 'Service Provider', 'Logistics']} 
                    value={formData.vendorType} 
                    onChange={v => setFormData({...formData, vendorType: v})} 
                    allowClear={false} 
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Person</label>
                  <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mobile</label>
                  <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">GST Number</label>
                  <input type="text" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none uppercase" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <AutocompleteSelect 
                    options={['Active', 'Inactive', 'Blacklisted']} 
                    value={formData.status} 
                    onChange={v => setFormData({...formData, status: v})} 
                    allowClear={false} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notes</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 min-h-[80px] outline-none resize-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={submitLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-lg shadow-brand-500/30 flex items-center">
                {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
