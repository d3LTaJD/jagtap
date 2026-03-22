const multer = require('multer');
const FileMetadata = require('../models/FileMetadata');
const { uploadFileToS3, getSignedDownloadUrl } = require('../services/s3Service');

// Use memory storage to process file buffer before sending to S3
const storage = multer.memoryStorage();
exports.upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// POST /api/files/upload
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file provided' });
    }

    const { module = 'Temp', entityId } = req.body;
    
    // 1. Upload buffer to S3
    const s3Key = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);

    // 2. Save metadata to MongoDB
    const fileMeta = await FileMetadata.create({
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      s3Key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      module,
      entityId: entityId || null
    });

    res.status(201).json({ 
      status: 'success', 
      data: { file: fileMeta } 
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/files/:id/download-url
// Returns a short-lived presigned URL for secure frontend viewing
exports.getSecureDownloadUrl = async (req, res, next) => {
  try {
    const fileMeta = await FileMetadata.findById(req.params.id);
    if (!fileMeta) return res.status(404).json({ status: 'fail', message: 'File not found' });

    // TODO: Add authorization checks here if file is private and user doesn't have module access

    const downloadUrl = await getSignedDownloadUrl(fileMeta.s3Key);
    
    res.status(200).json({ 
      status: 'success', 
      data: { 
        url: downloadUrl, 
        fileName: fileMeta.fileName,
        mimeType: fileMeta.mimeType
      } 
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/files
// Fetches a paginated list of all uploaded files, sorted by newest
exports.getAllFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const { module, search } = req.query;

    let query = {};
    if (module) query.module = module;
    if (search) query.originalName = { $regex: search, $options: 'i' };

    const total = await FileMetadata.countDocuments(query);
    const files = await FileMetadata.find(query)
      .populate('uploadedBy', 'fullName')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        page,
        pages: Math.ceil(total / limit),
        files
      }
    });
  } catch (err) {
    next(err);
  }
};
