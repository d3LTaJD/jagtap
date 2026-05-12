const FollowUp = require('../models/FollowUp');
const Task = require('../models/Task');
const Enquiry = require('../models/Enquiry');

exports.getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query; // Optional filters, if not provided, fetch all relevant
    
    // 1. Fetch Follow-ups
    const followUps = await FollowUp.find({ nextFollowUpDate: { $exists: true, $ne: null } })
      .populate({ path: 'enquiry', populate: { path: 'customer', select: 'companyName' } })
      .lean();

    const followUpEvents = followUps.map(f => ({
      _id: f._id,
      title: `${f.enquiry?.customer?.companyName || 'Unknown'} - ${f.type}`,
      date: f.nextFollowUpDate,
      type: 'FOLLOW_UP',
      status: f.outcome ? 'DONE' : 'PENDING',
      enquiryId: f.enquiry?._id,
      originalData: f
    }));

    // 2. Fetch To-Dos
    const tasks = await Task.find({ dueDate: { $exists: true, $ne: null } })
      .populate({ path: 'linkedEnquiry', populate: { path: 'customer', select: 'companyName' } })
      .lean();

    const taskEvents = tasks.map(t => {
      // Combine dueDate and dueTime if available
      let eventDate = new Date(t.dueDate);
      if (t.dueTime) {
        const [hours, minutes] = t.dueTime.split(':');
        eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      }

      return {
        _id: t._id,
        title: t.title,
        date: eventDate.toISOString(),
        type: 'TODO',
        status: t.status === 'Done' ? 'DONE' : (t.status === 'Cancelled' ? 'CANCELLED' : 'PENDING'),
        priority: t.priority,
        enquiryId: t.linkedEnquiry?._id,
        originalData: t
      };
    });

    // 3. Fetch Enquiry Deadlines
    const enquiries = await Enquiry.find({ requiredDeliveryWeeks: { $exists: true, $ne: null } })
      .populate('customer', 'companyName')
      .lean();

    const deadlineEvents = enquiries.map(e => {
      const weeks = parseInt(e.requiredDeliveryWeeks, 10);
      if (isNaN(weeks)) return null;

      const createdDate = new Date(e.createdAt);
      const deliveryDate = new Date(createdDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);

      return {
        _id: `deadline_${e._id}`,
        title: `${e.customer?.companyName || 'Unknown'} - Delivery Deadline`,
        date: deliveryDate.toISOString(),
        type: 'DEADLINE',
        status: ['Lost', 'Won'].includes(e.status) ? 'DONE' : 'PENDING',
        enquiryId: e._id,
        originalData: e
      };
    }).filter(Boolean);

    // Combine all events
    const allEvents = [...followUpEvents, ...taskEvents, ...deadlineEvents];

    res.status(200).json({
      success: true,
      data: {
        events: allEvents
      }
    });

  } catch (error) {
    console.error('Calendar Error:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching calendar events' });
  }
};
