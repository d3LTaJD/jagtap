const ActivityLog = require('../models/ActivityLog');

/**
 * Creates an audit log entry (uses original field names for backward compat)
 */
const logActivity = async ({
  req,
  action,
  module,
  resourceId,
  resourceName,
  previousState,
  newState,
  details
}) => {
  try {
    // Smart diffing: only record changed fields for UPDATE actions
    let diffPrevious = previousState;
    let diffNew = newState;

    if (previousState && newState && action === 'UPDATE') {
      diffPrevious = {};
      diffNew = {};

      const allKeys = new Set([...Object.keys(previousState), ...Object.keys(newState)]);

      for (const key of allKeys) {
        if (['_id', '__v', 'updatedAt', 'createdAt'].includes(key)) continue;

        const prevVal = JSON.stringify(previousState[key]);
        const newVal = JSON.stringify(newState[key]);

        if (prevVal !== newVal) {
          diffPrevious[key] = previousState[key];
          diffNew[key] = newState[key];
        }
      }
    }

    await ActivityLog.create({
      user_id: req.user?._id,
      action,
      module,
      related_id: resourceId,
      resourceName,
      previousState: diffPrevious,
      newState: diffNew,
      details,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
    // Don't throw — audit logging shouldn't break business logic
  }
};

module.exports = { logActivity };
