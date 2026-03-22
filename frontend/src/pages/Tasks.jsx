import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, List, AlertCircle, Clock, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';

const Tasks = () => {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/follow-ups');
      setTasks(res.data.data.followUps);
    } catch (error) {
      console.error('Error fetching global tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (task) => {
    if (task.outcome) return 'text-slate-500 bg-slate-100 border-slate-200';
    if (!task.nextFollowUpDate) return 'text-slate-500 bg-slate-100 border-slate-200';
    
    const d = new Date(task.nextFollowUpDate);
    const now = new Date();
    d.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    if (d < now) return 'text-red-700 bg-red-50 border-red-200';
    if (d.getTime() === now.getTime()) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-brand-700 bg-brand-50 border-brand-200';
  };

  // --- List View Logic ---
  const today = new Date();
  today.setHours(0,0,0,0);

  const pendingTasks = tasks.filter(t => !t.outcome);

  const overdueTasks = pendingTasks.filter(t => new Date(t.nextFollowUpDate).setHours(0,0,0,0) < today.getTime());
  const todayTasks = pendingTasks.filter(t => new Date(t.nextFollowUpDate).setHours(0,0,0,0) === today.getTime());
  const upcomingTasks = pendingTasks.filter(t => new Date(t.nextFollowUpDate).setHours(0,0,0,0) > today.getTime());

  // --- Calendar View Logic ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarYear = currentDate.getFullYear();
  const calendarMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);

  const prevMonth = () => setCurrentDate(new Date(calendarYear, calendarMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(calendarYear, calendarMonth + 1, 1));

  const calendarCells = [];
  // Empty cells before start of month
  for(let i = 0; i < firstDay; i++) {
    calendarCells.push({ empty: true });
  }
  // Days of month
  for(let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(calendarYear, calendarMonth, d);
    // Find tasks for this day
    const dayTasks = tasks.filter(t => {
      if (!t.nextFollowUpDate) return false;
      const td = new Date(t.nextFollowUpDate);
      return td.getDate() === dayDate.getDate() && td.getMonth() === dayDate.getMonth() && td.getFullYear() === dayDate.getFullYear();
    });
    calendarCells.push({ date: d, fullDate: dayDate, tasks: dayTasks });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks & Follow-ups</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your pending actions across all enquiries.</p>
        </div>
        
        {/* View Toggle */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${view === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${view === 'calendar' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarDays className="w-4 h-4" /> Calendar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Overdue */}
          <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex justify-between items-center">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Overdue
              </h3>
              <span className="bg-white text-red-700 text-xs font-bold px-2 py-1 rounded-full">{overdueTasks.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {overdueTasks.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">No overdue tasks.</p> : null}
              {overdueTasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* Today */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 flex justify-between items-center">
              <h3 className="font-bold text-orange-900 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Today
              </h3>
              <span className="bg-white text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{todayTasks.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {todayTasks.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">All caught up for today.</p> : null}
              {todayTasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-200 overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-brand-50 px-4 py-3 border-b border-brand-200 flex justify-between items-center">
              <h3 className="font-bold text-brand-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Upcoming
              </h3>
              <span className="bg-white text-brand-700 text-xs font-bold px-2 py-1 rounded-full">{upcomingTasks.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {upcomingTasks.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">No upcoming tasks scheduled.</p> : null}
              {upcomingTasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 bg-white">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 bg-white text-xs font-bold text-slate-700">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 bg-white">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-slate-100 gap-px border-b border-slate-200">
            {calendarCells.map((cell, idx) => (
              <div key={idx} className={`bg-white p-2 min-h-[120px] max-h-48 overflow-y-auto ${cell.empty ? 'opacity-50' : ''}`}>
                {!cell.empty && (
                  <>
                    <div className={`text-xs font-bold mb-2 flex items-center justify-center w-6 h-6 rounded-full ${cell.fullDate?.getTime() === new Date().setHours(0,0,0,0) ? 'bg-brand-600 text-white' : 'text-slate-500'}`}>
                      {cell.date}
                    </div>
                    <div className="space-y-1.5">
                      {cell.tasks?.map(task => {
                        const styleClass = getStatusColor(task);
                        return (
                          <Link 
                            key={task._id} 
                            to={`/app/enquiries/${task.enquiry?._id}?tab=Follow-ups`}
                            className={`block text-[10px] p-1.5 rounded border leading-tight hover:opacity-80 transition-opacity ${styleClass}`}
                          >
                            <span className="font-bold flex items-center gap-1 block truncate">
                              {task.enquiry?.customer?.companyName || 'Unknown'}
                            </span>
                            <span className="text-slate-600 font-medium truncate block">{task.type}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/app/enquiries/${task.enquiry?._id}?tab=Follow-ups`} className="font-bold text-sm text-brand-600 hover:underline">
          {task.enquiry?.customer?.companyName || 'Unknown Customer'}
        </Link>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          {task.type}
        </span>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.notes}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-[10px] font-medium text-slate-400">
          ENQ: {task.enquiry?.enquiryId}
        </div>
        <Link 
          to={`/app/enquiries/${task.enquiry?._id}?tab=Follow-ups`}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Take Action
        </Link>
      </div>
    </div>
  );
};

export default Tasks;
