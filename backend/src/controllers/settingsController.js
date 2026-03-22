const SystemSettings = require('../models/SystemSettings');

// GET /api/settings — return the singleton settings doc (create if not exists)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SystemSettings.findOne({ _singleton: 'global' });
    if (!settings) {
      settings = await SystemSettings.create({ _singleton: 'global' });
    }
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/settings — update the singleton settings doc
exports.updateSettings = async (req, res, next) => {
  try {
    const forbidden = ['_singleton', '_id', '__v'];
    forbidden.forEach(k => delete req.body[k]);

    const settings = await SystemSettings.findOneAndUpdate(
      { _singleton: 'global' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) {
    next(err);
  }
};
