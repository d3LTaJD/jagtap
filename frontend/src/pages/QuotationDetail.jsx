import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Download, User as UserIcon, CheckCircle, CheckCircle2,
  Clock, AlertCircle, ArrowLeft, Loader2, IndianRupee,
  Send, GitBranch, Printer, Lock, X, AlertTriangle, Save, File
} from 'lucide-react';
import api from '../api/client';
import DynamicFormRenderer from '../components/DynamicFormRenderer';
import AttachmentManager from '../components/AttachmentManager';
import EmailComposerModal from '../components/EmailComposerModal';

const StatusBadge = ({ status }) => {
  const colors = {
    'DRAFT': 'bg-slate-100 text-slate-700 border-slate-200',
    'TECH_REVIEW': 'bg-blue-50 text-blue-700 border-blue-200',
    'PENDING_APPROVAL': 'bg-amber-50 text-amber-700 border-amber-200',
    'APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'REJECTED': 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-slate-50 text-slate-600'}`}>
      {status}
    </span>
  );
};

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showRevisionPanel, setShowRevisionPanel] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [dynamicValues, setDynamicValues] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await api.get(`/quotations/${id}`);
        if (qRes.data.data?.quotation) setQuotation(qRes.data.data.quotation);
        
        // Side data fetch
        api.get('/auth/users')
          .then(res => { if (res.data.data?.users) setUsers(res.data.data.users); })
          .catch(err => console.error('Failed to fetch users:', err));

      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (quotation?.dynamicFields) setDynamicValues(quotation.dynamicFields);
  }, [quotation]);

  const handleDynamicFieldChange = (fieldName, value) => {
    setDynamicValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const saveDynamicFields = async () => {
    setUpdateLoading(true);
    try {
      const res = await api.patch(`/quotations/${id}/status`, { dynamicFields: dynamicValues });
      setQuotation(res.data.data.quotation);
    } catch (err) { alert('Failed to save: ' + (err.response?.data?.message || err.message)); }
    finally { setUpdateLoading(false); }
  };

  const handleUpdate = async (update) => {
    setUpdateLoading(true);
    try {
      const res = await api.patch(`/quotations/${id}/status`, update);
      setQuotation(res.data.data.quotation);
      showToast('Quotation updated');
    } catch (err) {
      showToast('Update failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Approve action (Director / SA only)
  const handleApprove = async () => {
    if (!confirm('Approve this quotation? This will mark it as officially approved.')) return;
    await handleUpdate({ status: 'APPROVED', approvedBy: currentUser.id || currentUser._id });
  };

  const handleGeneratePdf = async () => {
    setUpdateLoading(true);
    try {
      showToast('Generating PDF securely...', 'success');
      const res = await api.post(`/quotations/${id}/generate-pdf`);
      setQuotation(res.data.data.quotation);
      showToast('Official PDF Generated & saved to S3!', 'success');
    } catch (err) {
      showToast('Generation failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Reject action
  const handleReject = async () => {
    const reason = prompt('Enter rejection reason (optional):');
    await handleUpdate({ status: 'REJECTED', rejectionReason: reason || '' });
  };

  // Create revision note
  const handleSaveRevision = async () => {
    if (!revisionNote.trim()) return;
    setUpdateLoading(true);
    try {
      const existing = quotation.revisionNotes || [];
      const newNote = { note: revisionNote, addedBy: currentUser.name, addedAt: new Date().toISOString() };
      const res = await api.patch(`/quotations/${id}/status`, { revisionNotes: [...existing, newNote] });
      setQuotation(res.data.data.quotation);
      setRevisionNote('');
      setShowRevisionPanel(false);
      showToast('Revision note added');
    } catch (err) {
      showToast('Failed to save revision', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Client-side print to PDF
  const handlePrintPdf = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    </div>
  );

  if (!quotation) return <div className="p-8 text-center text-slate-500 font-medium">Quotation not found.</div>;

  const isDirector = ['DIRECTOR', 'SUPER_ADMIN', 'SA', 'DIR'].includes(currentUser.role);
  const isSalesOrTA = ['SALES', 'TA'].includes(currentUser.role);
  // Pricing visible to: SA, DIR, ACC, SALES (edit), TA (read)
  const canSeePricing = ['SA', 'SUPER_ADMIN', 'DIR', 'DIRECTOR', 'ACC', 'ACCOUNTS', 'SALES'].includes(currentUser.role);
  
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Back to List</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{quotation.quotationId || 'Draft'}</h1>
              <StatusBadge status={quotation.status} />
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">Ref Enquiry: {quotation.enquiry?.enquiryId || 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {updateLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-center overflow-hidden">
             <div className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-500">Assign</div>
             <select 
               disabled={!isDirector}
               value={quotation.assignedTo || ''} 
               onChange={e => handleUpdate({ assignedTo: e.target.value })}
               className="bg-transparent border-none text-sm font-semibold text-slate-700 py-1.5 pl-3 pr-8 focus:ring-0 disabled:opacity-60 cursor-pointer w-32"
             >
               <option value="">Unassigned</option>
               {users.map(u => (
                 <option key={u._id} value={u._id}>{u.name || u.fullName}</option>
               ))}
             </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-center overflow-hidden">
             <div className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-500">Status</div>
             <select 
               value={quotation.status} 
               onChange={e => handleUpdate({ status: e.target.value })}
               className="bg-transparent border-none text-sm font-semibold text-brand-700 py-1.5 pl-3 pr-8 focus:ring-0 disabled:opacity-60 cursor-pointer"
             >
               <option value="DRAFT">DRAFT</option>
               <option value="TECH_REVIEW">TECH REVIEW</option>
               <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
               {isDirector && (
                 <>
                   <option value="APPROVED">APPROVED</option>
                   <option value="REJECTED">REJECTED</option>
                 </>
               )}
             </select>
          </div>

          {/* Approve / Reject — Director only */}
          {isDirector && quotation.status === 'PENDING_APPROVAL' && (
            <>
              <button onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all">
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button onClick={handleReject}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-all">
                <X className="w-4 h-4" /> Reject
              </button>
            </>
          )}

          {/* Revision button */}
          <button onClick={() => setShowRevisionPanel(p => !p)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <GitBranch className="w-4 h-4" /> Revision
          </button>

          <button onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <Send className="w-4 h-4 text-brand-600" /> Email Customer
          </button>

          <button onClick={handleGeneratePdf} disabled={updateLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60">
            {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Official PDF
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-in slide-in-from-top-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Revision Note Panel */}
      {showRevisionPanel && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 animate-in slide-in-from-top-2 mb-4">
          <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest">Add Revision Note</h4>
          <textarea
            value={revisionNote}
            onChange={e => setRevisionNote(e.target.value)}
            rows={3}
            placeholder="Describe the change or revision reason..."
            className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 outline-none resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowRevisionPanel(false)} className="px-4 py-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSaveRevision} disabled={updateLoading} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold">
              {updateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Revision'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Scope */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               <FileText className="w-5 h-5 text-brand-600" /> Quotation Details
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                <p className="font-semibold text-slate-800">{quotation.customer?.companyName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Scope of Supply</p>
                <p className="font-semibold text-slate-800 italic">"{quotation.scopeOfSupply || 'No description provided'}"</p>
              </div>
            </div>
            
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-100 italic">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Description</th>
                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</th>
                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit Price</th>
                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {quotation.items?.map((item, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className="px-4 py-4 text-slate-900 font-medium">{item.description}</td>
                      <td className="px-4 py-4 text-right text-slate-600 font-bold">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{(item.unitPrice || 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-right font-black text-slate-900">₹{(item.lineTotalExclGST || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Fields (Dynamic) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" /> Custom Fields
              </h2>
              <button onClick={saveDynamicFields} disabled={updateLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all">
                {updateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Save Fields
              </button>
            </div>
            <DynamicFormRenderer
              formContext="Quotation"
              values={dynamicValues}
              onChange={handleDynamicFieldChange}
              readOnly={false}
              currentUserRole={currentUser.role}
            />
          </div>

          {/* Attachments & Files */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <File className="w-5 h-5 text-brand-600" /> Attachments & Files
            </h2>
            <AttachmentManager 
              moduleName="Quotation"
              entityId={id}
              uploadedFiles={[...(quotation.attachments || []), ...(quotation.files || [])]}
              onUploadComplete={(newFile) => {
                 setQuotation(prev => ({ ...prev, files: [...(prev.files || []), newFile] }));
                 handleUpdate({ files: [...(quotation.files || []).map(f => f._id || f), newFile._id] });
              }}
              readOnly={quotation.status === 'APPROVED'}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Commercial Summary — role gated */}
          {canSeePricing ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
            <h2 className="text-lg font-bold text-slate-900 mb-6 relative z-10 flex items-center gap-2">
               <IndianRupee className="w-5 h-5 text-brand-600" /> Commercial Summary
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal (Excl. GST)</span>
                <span className="font-bold text-slate-900">₹{(quotation.commercialTotals?.grandTotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Estimated GST (18%)</span>
                <span className="font-bold text-slate-900">₹{((quotation.commercialTotals?.grandTotal || 0) * 0.18).toLocaleString()}</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-black uppercase tracking-tight">Grand Total</span>
                <span className="text-xl font-black text-brand-600">₹{((quotation.commercialTotals?.grandTotal || 0) * 1.18).toLocaleString()}</span>
              </div>
            </div>
          </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex items-center gap-3 text-slate-500">
              <Lock className="w-5 h-5" />
              <div>
                <p className="text-sm font-bold text-slate-700">Pricing Hidden</p>
                <p className="text-xs">Pricing details are visible to Accounts, Sales, and Directors only.</p>
              </div>
            </div>
          )}

          {/* Revision Notes History */}
          {(quotation.revisionNotes?.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-3">Revision History</h3>
              <div className="space-y-3">
                {quotation.revisionNotes.map((rn, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-amber-100">
                    <p className="text-sm font-medium text-slate-700">{rn.note}</p>
                    <p className="text-xs text-slate-400 mt-1">{rn.addedBy} · {new Date(rn.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Status */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Workflow Progress</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quotation.preparedBy ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Quotation Prepared</p>
                  <p className="text-xs text-slate-500">{quotation.preparedBy?.fullName || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quotation.technicalReviewBy ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  {quotation.technicalReviewBy ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Technical Review</p>
                  <p className="text-xs text-slate-500">{quotation.technicalReviewBy?.fullName || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quotation.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : quotation.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
                  {quotation.status === 'APPROVED' ? <CheckCircle className="w-5 h-5" /> : quotation.status === 'REJECTED' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Director Approval</p>
                  <p className="text-xs text-slate-500">{quotation.approvedBy?.fullName || 'Final Step'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Email Composer */}
      <EmailComposerModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        defaultTo={quotation.customer?.emailAddress || ''}
        defaultSubject={`Quotation # ${quotation.quotationId}`}
        availableFiles={quotation.files || []}
        onSendSuccess={() => showToast('Email message dispatched successfully!', 'success')}
      />
    </div>
  );
};

export default QuotationDetail;
