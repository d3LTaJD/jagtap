import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Loader2, X, Pencil, ShieldAlert } from 'lucide-react';
import api from '../api/client';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '', customerType: 'Private', primaryContactName: '', designation: '',
    mobileNumber: '', alternateMobile: '', emailAddress: '', alternateEmail: '',
    city: '', state: '', country: 'India', gstin: '', pan: '', paymentTerms: '30 days',
    creditLimit: 0, isActive: true
  });

  const fetchCustomers = async (searchQuery = '') => {
    try {
      const res = await api.get(`/customers?search=${searchQuery}`);
      setCustomers(res.data.data.customers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(search);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const openNew = () => {
    setEditingCustomer(null);
    setFormData({
      companyName: '', customerType: 'Private', primaryContactName: '', designation: '',
      mobileNumber: '', alternateMobile: '', emailAddress: '', alternateEmail: '',
      city: '', state: '', country: 'India', gstin: '', pan: '', paymentTerms: '30 days',
      creditLimit: 0, isActive: true
    });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      companyName: c.companyName || '', customerType: c.customerType || 'Private', 
      primaryContactName: c.primaryContactName || '', designation: c.designation || '',
      mobileNumber: c.mobileNumber || '', alternateMobile: c.alternateMobile || '', 
      emailAddress: c.emailAddress || '', alternateEmail: c.alternateEmail || '',
      city: c.city || '', state: c.state || '', country: c.country || 'India', 
      gstin: c.gstin || '', pan: c.pan || '', paymentTerms: c.paymentTerms || '30 days',
      creditLimit: c.creditLimit || 0, isActive: c.isActive !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingCustomer) {
        await api.patch(`/customers/${editingCustomer._id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setShowModal(false);
      fetchCustomers(search);
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving customer');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading && !customers.length) return <div className="p-8 flex justify-center min-h-[60vh] items-center"><Loader2 className="animate-spin w-8 h-8 text-brand-600" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Master</h1>
          <p className="text-sm text-slate-500 mt-1">Manage global database of clients and contacts.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-sm shadow-brand-500/30">
          <UserPlus className="w-4 h-4 mr-2" /> Add Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-200 flex items-center mb-6">
        <Search className="w-5 h-5 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search by company name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-sm p-0"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 uppercase tracking-widest text-slate-500 text-[10px] font-black italic">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">GSTIN</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c._id} onClick={() => openEdit(c)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{c.customerId || '—'}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{c.companyName}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{c.primaryContactName}</div>
                    <div className="text-[10px] text-slate-500">{c.mobileNumber}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{c.gstin || '—'}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{c.customerType || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="text-slate-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-brand-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCustomer ? 'Edit Customer' : 'Create New Customer'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                    <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="Acme Corp" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact *</label>
                    <input type="text" required value={formData.primaryContactName} onChange={e => setFormData({...formData, primaryContactName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                    <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="Manager" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                    <input type="text" required value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" value={formData.emailAddress} onChange={e => setFormData({...formData, emailAddress: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="john@acme.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer Type</label>
                    <select value={formData.customerType} onChange={e => setFormData({...formData, customerType: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option>Government</option>
                      <option>Private</option>
                      <option>Export</option>
                      <option>Trader</option>
                      <option>EPC</option>
                      <option>End User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                    <select value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option>Advance</option>
                      <option>30 days</option>
                      <option>45 days</option>
                      <option>60 days</option>
                      <option>LC</option>
                      <option>Against Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
                    <input type="text" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="27XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PAN</label>
                    <input type="text" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="XXXXX1234X" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500 border-slate-300 w-4 h-4" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Account is Active</label>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm">Cancel</button>
              <button type="submit" form="customer-form" disabled={submitLoading} className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center">
                {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
