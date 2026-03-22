import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckSquare, TrendingUp, IndianRupee, Loader2, Activity, ClipboardList, AlertCircle, RefreshCw, Download, BarChart3, Trophy, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import api from '../api/client';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "brand", loading = false }) => {
  const styles = {
    brand: 'text-brand-600 bg-brand-50 border-brand-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg border ${styles[colorClass]} shadow-sm`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
        ) : (
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        )}
        {trend && !loading && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-bold text-emerald-600">{trend}%</span>
            <span className="text-slate-500 font-medium tracking-tight">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeEnquiries: 0,
    quotationsSent: 0,
    pipelineValue: 0,
    pendingQaps: 0,
    wonCount: 0,
    lostCount: 0,
    wonValue: 0,
    conversionRate: 0,
    byCategory: [],
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [myTasks, setMyTasks] = useState({ enquiries: [], followUps: [], approvals: [] });
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canSeeFinancials = ['SA', 'SUPER_ADMIN', 'DIR', 'DIRECTOR', 'ACC', 'ACCOUNTS'].includes(currentUser.role);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        const s = res.data.data.stats;
        setStats({
          activeEnquiries: s.activeEnquiries || 0,
          quotationsSent: (s.pendingQuotations || 0) + (s.wonQuotations || 0),
          pipelineValue: s.pipelineValue || 0,
          pendingQaps: s.pendingQaps || 0,
          wonCount: s.wonCount || 0,
          lostCount: s.lostCount || 0,
          wonValue: s.wonValue || 0,
          conversionRate: s.conversionRate || 0,
          byCategory: s.byCategory || [],
        });
        if (res.data.data.recentActivity) setRecentActivity(res.data.data.recentActivity);
        if (res.data.data.myTasks) setMyTasks(res.data.data.myTasks);

        // Build pipeline funnel from stage counts (keys must match Enquiry schema)
        const stages = [
          { label: 'New Leads',      color: 'bg-blue-500',    count: s.byStatus?.['New'] || 0 },
          { label: 'Contacted',      color: 'bg-violet-500',  count: s.byStatus?.['Contacted'] || 0 },
          { label: 'Tech Review',    color: 'bg-cyan-500',    count: s.byStatus?.['Technical Review'] || 0 },
          { label: 'Quotation Sent', color: 'bg-amber-500',   count: s.byStatus?.['Quoted'] || s.pendingQuotations || 0 },
          { label: 'Negotiating',    color: 'bg-orange-500',  count: s.byStatus?.['Negotiating'] || 0 },
          { label: 'Won',            color: 'bg-emerald-500', count: s.byStatus?.['Won'] || 0 },
          { label: 'On Hold',        color: 'bg-orange-300',  count: s.byStatus?.['On Hold'] || 0 },
          { label: 'Lost',           color: 'bg-red-400',     count: s.byStatus?.['Lost'] || 0 },
        ];
        setPipeline(stages);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Export full report
  const exportReport = () => {
    const headers = ['Stage', 'Count'];
    const rows = pipeline.map(p => [p.label, p.count]);
    rows.push(['', ''], ['Stat', 'Value'],
      ['Active Enquiries', stats.activeEnquiries],
      ['Quotations Sent', stats.quotationsSent],
      ['Pipeline Value', stats.pipelineValue],
      ['Won Count', stats.wonCount],
      ['Lost Count', stats.lostCount],
    );
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dashboard_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening at Jagtap Engineering today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); window.location.reload(); }}
            className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportReport} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-500/30 transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard loading={loading} title="Active Enquiries" value={stats.activeEnquiries} icon={Users} trend="12" colorClass="brand" />
        <StatCard loading={loading} title="Quotations Sent" value={stats.quotationsSent} icon={FileText} trend="8" colorClass="blue" />
        <StatCard loading={loading} title="QAPs Pending" value={stats.pendingQaps} icon={CheckSquare} colorClass="emerald" />
        <StatCard loading={loading} title="Pipeline Value" value={formatCurrency(stats.pipelineValue)} icon={IndianRupee} trend="24" colorClass="purple" />
      </div>

      {/* ── KPI Visualizations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-brand-600" /> Pipeline Stage Breakdown
          </h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {pipeline.map((entry, index) => {
                      const getFill = (c) => {
                        if (c.includes('emerald')) return '#10b981';
                        if (c.includes('blue')) return '#3b82f6';
                        if (c.includes('amber')) return '#f59e0b';
                        if (c.includes('orange')) return '#f97316';
                        if (c.includes('red')) return '#f87171';
                        if (c.includes('violet')) return '#8b5cf6';
                        if (c.includes('cyan')) return '#06b6d4';
                        return '#64748b';
                      };
                      return <Cell key={`cell-${index}`} fill={getFill(entry.color || '')} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Product Categories Doughnut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-brand-600" /> Product Categories
          </h2>
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
          ) : stats.byCategory && stats.byCategory.length === 0 ? (
             <div className="flex justify-center items-center h-72 text-sm text-slate-400 font-medium">No category data yet</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byCategory}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.byCategory?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'][index % 7]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Financial Metrics (SA/DIR/ACC only) ── */}
      {canSeeFinancials && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Won This Month</span>
            </div>
            <p className="text-3xl font-black text-emerald-700">{stats.wonCount}</p>
            <p className="text-sm text-emerald-600 mt-1">{formatCurrency(stats.wonValue)} total value</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">Lost This Month</span>
            </div>
            <p className="text-3xl font-black text-red-600">{stats.lostCount}</p>
            <p className="text-sm text-red-500 mt-1">Opportunities not converted</p>
          </div>
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-black text-brand-700 uppercase tracking-wider">Win Rate</span>
            </div>
            <p className="text-3xl font-black text-brand-700">{stats.conversionRate ? `${stats.conversionRate}%` : (stats.wonCount + stats.lostCount > 0 ? Math.round((stats.wonCount / (stats.wonCount + stats.lostCount)) * 100) + '%' : '—')}</p>
            <p className="text-sm text-brand-600 mt-1">Won / (Won + Lost)</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Tasks Widget */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-brand-600" /> My Tasks
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
          ) : (
            <div className="space-y-6">
              
              {/* Due Follow-ups */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Overdue / Due Today</h3>
                {myTasks.followUps.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending follow-ups</p>
                ) : (
                  <div className="space-y-2">
                    {myTasks.followUps.map(f => (
                      <div key={f._id} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-red-900">{f.enquiry?.enquiryId}</p>
                          <p className="text-xs text-red-700 mt-0.5">Due: {new Date(f.nextFollowUpDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Approvals */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pending Approvals</h3>
                {myTasks.approvals.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending approvals</p>
                ) : (
                  <div className="space-y-2">
                    {myTasks.approvals.map(a => (
                      <div key={a._id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-sm font-bold text-amber-900">{a.type}: {a.id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assigned Enquiries */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Action Required Leads</h3>
                {myTasks.enquiries.length === 0 ? (
                  <p className="text-sm text-slate-500">Inbox Zero!</p>
                ) : (
                  <div className="space-y-2">
                    {myTasks.enquiries.map(e => (
                      <div key={e._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-sm font-bold text-slate-900">{e.enquiryId}</p>
                        <p className="text-xs text-slate-500 truncate">{e.customer?.companyName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight flex items-center">
            <Activity className="w-5 h-5 mr-2 text-brand-600" /> Recent Follow-Ups
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 font-medium">No recent activities recorded</div>
          ) : (
            <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="relative pl-6 sm:pl-8">
                  <span className="absolute -left-3 top-2 w-6 h-6 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                    <p className="text-sm font-bold text-slate-900">{act.addedBy?.name || 'Team'} <span className="text-slate-500 font-normal">logged a {act.type?.toLowerCase().replace('_', ' ')} on</span> {act.enquiry?.enquiryId || 'Unknown Enquiry'}</p>
                    <span className="text-xs text-slate-400">{new Date(act.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">"{act.notes}"</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {act.outcome && <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">{act.outcome}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
