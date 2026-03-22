const Enquiry = require('../models/Enquiry');
const Customer = require('../models/Customer');
const Quotation = require('../models/Quotation');

// GET /api/search?q=...
// Returns up to 5 results each from Enquiries, Customers, Quotations
exports.globalSearch = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.status(200).json({ status: 'success', data: { results: [] } });
    }

    const regex = new RegExp(q, 'i');

    const [enquiries, customers, quotations] = await Promise.all([
      Enquiry.find({
        $or: [
          { enquiryId: regex },
          { productDescription: regex },
          { productCategory: regex },
          { contactPerson: regex },
          { contactMobile: regex }
        ]
      })
        .populate('customer', 'companyName')
        .limit(5)
        .select('enquiryId productCategory status customer'),

      Customer.find({
        $or: [
          { companyName: regex },
          { customerId: regex },
          { primaryContactName: regex },
          { mobileNumber: regex }
        ]
      })
        .limit(5)
        .select('customerId companyName primaryContactName mobileNumber city'),

      Quotation.find({
        $or: [
          { quotationId: regex },
          { status: regex }
        ]
      })
        .populate('customer', 'companyName')
        .limit(5)
        .select('quotationId status customer createdAt')
    ]);

    const results = [
      ...enquiries.map(e => ({
        type: 'Enquiry',
        id: e._id,
        title: e.enquiryId,
        subtitle: `${e.customer?.companyName || ''} • ${e.productCategory || ''}`,
        status: e.status,
        link: `/app/enquiries/${e._id}`
      })),
      ...customers.map(c => ({
        type: 'Customer',
        id: c._id,
        title: c.companyName,
        subtitle: `${c.customerId} • ${c.primaryContactName || ''} • ${c.mobileNumber || ''}`,
        link: `/app/customers`
      })),
      ...quotations.map(q => ({
        type: 'Quotation',
        id: q._id,
        title: q.quotationId,
        subtitle: `${q.customer?.companyName || ''} • ${q.status}`,
        link: `/app/quotations/${q._id}`
      }))
    ];

    res.status(200).json({ status: 'success', data: { results } });
  } catch (err) {
    next(err);
  }
};
