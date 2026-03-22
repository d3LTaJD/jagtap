const Role = require('../models/Role');
const User = require('../models/User');

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ status: 'success', data: { roles } });
  } catch (err) {
    next(err);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ status: 'success', data: { role } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Role with this name or code already exists' });
    }
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) {
      return res.status(404).json({ status: 'fail', message: 'Role not found' });
    }
    res.status(200).json({ status: 'success', data: { role } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Role with this name or code already exists' });
    }
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ status: 'fail', message: 'Role not found' });
    }
    // Prevent deletion if any user has this role
    const usersWithRole = await User.countDocuments({ role: role.code });
    if (usersWithRole > 0) {
      return res.status(400).json({ status: 'fail', message: 'Cannot delete role as it is assigned to one or more users' });
    }
    await role.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
