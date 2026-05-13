import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, List, AlertCircle, Clock, CheckCircle2, Loader2, ChevronLeft, ChevronRight, CheckSquare, Target, Plus, X } from 'lucide-react';
import api from '../api/client';
import AutocompleteSelect from '../components/AutocompleteSelect';

const Tasks = () => {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Filters
  const [showFollowUps, setShowFollowUps] = useState(true);
  const [showTodos, setShowTodos] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Quick Add Reminder state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/calendar/events');
      setEvents(res.data.data.events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedDate) return;
    setAddingTask(true);
    try {
      await api.post('/tasks', {
        title: newTaskTitle,
        dueDate: selectedDate,
        priority: 'Medium',
        status: 'To Do'
      });
      setShowAddModal(false);
      setNewTaskTitle('');
      fetchEvents();
      showToast('Reminder added');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Error adding reminder', 'error');
    } finally {
      setAddingTask(false);
    }
  };

  const openAddModal = (dateStr) => {
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  // Filter events based on toggles
  const filteredEvents = events.filter(e => {
    if (e.type === 'FOLLOW_UP' && !showFollowUps) return false;
    if (e.type === 'TODO' && !showTodos) return false;
    if (e.type === 'DEADLINE' && !showDeadlines) return false;
    return true;
  });

  const getTypeStyle = (type) => {
    switch (type) {
      case 'FOLLOW_UP': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'TODO': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'DEADLINE': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'FOLLOW_UP': return <Clock className="w-3 h-3" />;
      case 'TODO': return <CheckSquare className="w-3 h-3" />;
      case 'DEADLINE': return <Target className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusColor = (event) => {
    if (event.status === 'DONE' || event.status === 'CANCELLED') return 'opacity-50 line-through';
    
    const d = new Date(event.date);
    const now = new Date();
    d.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    if (d < now) return 'ring-1 ring-red-400';
    if (d.getTime() === now.getTime()) return 'ring-1 ring-orange-400';
    return '';
  };

  // --- List View Logic ---
  const today = new Date();
  today.setHours(0,0,0,0);

  const pendingEvents = filteredEvents.filter(e => e.status !== 'DONE' && e.status !== 'CANCELLED');

  const overdueEvents = pendingEvents.filter(e => new Date(e.date).setHours(0,0,0,0) < today.getTime());
  const todayEvents = pendingEvents.filter(e => new Date(e.date).setHours(0,0,0,0) === today.getTime());
  const upcomingEvents = pendingEvents.filter(e => new Date(e.date).setHours(0,0,0,0) > today.getTime());

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
    // Find events for this day
    const dayEvents = filteredEvents.filter(e => {
      if (!e.date) return false;
      const ed = new Date(e.date);
      return ed.getDate() === dayDate.getDate() && ed.getMonth() === dayDate.getMonth() && ed.getFullYear() === dayDate.getFullYear();
    });
    // Sort events by type (Deadlines first, then followups, then todos)
    dayEvents.sort((a,b) => {
      const order = { 'DEADLINE': 1, 'FOLLOW_UP': 2, 'TODO': 3 };
      return order[a.type] - order[b.type];
    });

    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ date: d, fullDate: dayDate, dateStr, events: dayEvents });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks & Follow-ups</h1>
          <p className="text-sm text-slate-500 mt-1">Unified view of your follow-ups, internal to-dos, and enquiry deadlines.</p>
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

      {/* Filters & Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mr-2">Show:</span>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={showFollowUps} onChange={(e) => setShowFollowUps(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded">
            <Clock className="w-4 h-4" /> Follow-Ups
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={showTodos} onChange={(e) => setShowTodos(e.target.checked)} className="w-4 h-4 text-purple-600 rounded border-slate-300" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-purple-800 bg-purple-50 px-2 py-1 rounded">
            <CheckSquare className="w-4 h-4" /> Internal Reminders (To-Dos)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={showDeadlines} onChange={(e) => setShowDeadlines(e.target.checked)} className="w-4 h-4 text-red-600 rounded border-slate-300" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-red-800 bg-red-50 px-2 py-1 rounded">
            <Target className="w-4 h-4" /> Enquiry Deadlines
          </span>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Overdue */}
          <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden flex flex-col h-[65vh]">
            <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex justify-between items-center">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Overdue
              </h3>
              <span className="bg-white text-red-700 text-xs font-bold px-2 py-1 rounded-full">{overdueEvents.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {overdueEvents.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">No overdue tasks.</p> : null}
              {overdueEvents.map(event => (
                <EventCard key={event._id} event={event} typeStyle={getTypeStyle(event.type)} />
              ))}
            </div>
          </div>

          {/* Today */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden flex flex-col h-[65vh]">
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 flex justify-between items-center">
              <h3 className="font-bold text-orange-900 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Today
              </h3>
              <span className="bg-white text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{todayEvents.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {todayEvents.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">All caught up for today.</p> : null}
              {todayEvents.map(event => (
                <EventCard key={event._id} event={event} typeStyle={getTypeStyle(event.type)} />
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-200 overflow-hidden flex flex-col h-[65vh]">
            <div className="bg-brand-50 px-4 py-3 border-b border-brand-200 flex justify-between items-center">
              <h3 className="font-bold text-brand-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Upcoming
              </h3>
              <span className="bg-white text-brand-700 text-xs font-bold px-2 py-1 rounded-full">{upcomingEvents.length}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {upcomingEvents.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">No upcoming tasks scheduled.</p> : null}
              {upcomingEvents.map(event => (
                <EventCard key={event._id} event={event} typeStyle={getTypeStyle(event.type)} />
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
              <div key={idx} className={`bg-white min-h-[140px] max-h-56 overflow-y-auto group relative ${cell.empty ? 'opacity-50 pointer-events-none' : ''}`}>
                {!cell.empty && (
                  <>
                    <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 p-2 flex justify-between items-center border-b border-slate-50/50">
                      <span className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-full ${cell.fullDate?.getTime() === new Date().setHours(0,0,0,0) ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500'}`}>
                        {cell.date}
                      </span>
                      <button 
                        onClick={() => openAddModal(cell.dateStr)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-all"
                        title="Add Reminder"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="p-1.5 space-y-1.5">
                      {cell.events?.map(event => {
                        const baseStyle = getTypeStyle(event.type);
                        const statusStyle = getStatusColor(event);
                        const eventUrl = event.enquiryId 
                            ? `/app/enquiries/${event.enquiryId}?tab=${event.type==='TODO'?'Tasks':'Follow-ups'}`
                            : (event.type === 'TODO' ? `/app/todos` : '#');

                        return (
                          <Link 
                            key={event._id} 
                            to={eventUrl}
                            className={`block text-[10px] p-1.5 rounded border leading-tight hover:brightness-95 transition-all shadow-sm ${baseStyle} ${statusStyle}`}
                            title={event.title}
                          >
                            <span className="font-bold flex items-start gap-1 block">
                              <span className="mt-0.5 opacity-70 shrink-0">{getTypeIcon(event.type)}</span>
                              <span className="line-clamp-2">{event.title}</span>
                            </span>
                            {event.status === 'DONE' && <span className="block mt-1 text-[9px] font-black tracking-widest opacity-60">COMPLETED</span>}
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

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Add Internal Reminder
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
            </div>
            <form onSubmit={handleAddReminder} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date</label>
                <div className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Reminder Task</label>
                <input 
                  type="text" 
                  autoFocus
                  required 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Call vendor for parts" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={addingTask} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg flex items-center">
                  {addingTask ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const EventCard = ({ event, typeStyle }) => {
  const isDone = event.status === 'DONE' || event.status === 'CANCELLED';
  const eventUrl = event.enquiryId 
      ? `/app/enquiries/${event.enquiryId}?tab=${event.type==='TODO'?'Tasks':'Follow-ups'}`
      : (event.type === 'TODO' ? `/app/todos` : '#');

  const getTypeLabel = () => {
    switch (event.type) {
      case 'FOLLOW_UP': return 'Follow-Up';
      case 'TODO': return 'Internal To-Do';
      case 'DEADLINE': return 'Deadline';
      default: return 'Event';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative group ${isDone ? 'opacity-60 border-slate-200' : typeStyle.split(' ')[2]}`}>
      <div className="flex justify-between items-start mb-2">
        <Link to={eventUrl} className={`font-bold text-sm hover:underline ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
          {event.title}
        </Link>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${typeStyle}`}>
          {getTypeLabel()}
        </span>
      </div>
      
      {event.originalData?.notes && <p className="text-xs text-slate-500 line-clamp-2 mt-1">{event.originalData.notes}</p>}
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-2">
          {event.enquiryId && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Linked to Enquiry</span>}
          {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </div>
        <Link 
          to={eventUrl}
          className="text-[11px] font-bold text-slate-600 hover:text-brand-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Tasks;
