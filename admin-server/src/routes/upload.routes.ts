import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { upload, uploadToCloudinary } from '../services/upload.service';

const router = Router();

router.use(authenticate);

const handleUpload = async (req: any, res: any, next: any) => {
  try {
    const file = req.file || (req.files && Array.isArray(req.files) ? req.files[0] : null);
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Please attach an image file.' });
    }

    const folder = req.body.folder || 'products';
    const result = await uploadToCloudinary(file.buffer, folder, file.originalname);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/upload - General file upload
router.post(
  '/',
  requireMinRole('VIEWER'),
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  (req, res, next) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    req.file = files?.file?.[0] || files?.image?.[0] || (req as any).file;
    handleUpload(req, res, next);
  }
);

// POST /api/admin/upload/image - Image specific endpoint used by product editor
router.post(
  '/image',
  requireMinRole('VIEWER'),
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  (req, res, next) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    req.file = files?.file?.[0] || files?.image?.[0] || (req as any).file;
    handleUpload(req, res, next);
  }
);

// POST /api/admin/upload/media - Media gallery specific endpoint
router.post(
  '/media',
  requireMinRole('VIEWER'),
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  (req, res, next) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    req.file = files?.file?.[0] || files?.image?.[0] || (req as any).file;
    handleUpload(req, res, next);
  }
);

export default router;
