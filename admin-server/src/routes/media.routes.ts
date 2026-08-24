import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';

const router = Router();
router.use(authenticate);

let mediaItems = [
  {
    id: 'med-1',
    title: 'Himalayan Raw Honey Jar',
    filename: 'honey.jpg',
    url: '/products/honey.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    folder: 'products',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    title: 'Organic Dried Cranberries',
    filename: 'cranberries.jpg',
    url: '/products/cranberries.jpg',
    mimeType: 'image/jpeg',
    size: 312000,
    folder: 'products',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    title: 'Himalayan Organic Walnuts',
    filename: 'walnuts.jpg',
    url: '/products/walnuts.jpg',
    mimeType: 'image/jpeg',
    size: 198000,
    folder: 'products',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-4',
    title: 'Organic Pumpkin Seeds',
    filename: 'pumpkin-seeds.jpg',
    url: '/products/pumpkin-seeds.jpg',
    mimeType: 'image/jpeg',
    size: 275000,
    folder: 'products',
    createdAt: new Date().toISOString(),
  },
];

// GET /api/admin/media
router.get('/', requireMinRole('VIEWER'), (req, res) => {
  const { folder, search } = req.query;
  let filtered = [...mediaItems];

  if (folder && folder !== 'ALL') {
    filtered = filtered.filter((m) => m.folder === folder);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((m) => m.title.toLowerCase().includes(q) || m.filename.toLowerCase().includes(q));
  }

  res.json({
    data: filtered,
    pagination: {
      page: 1,
      limit: 50,
      total: filtered.length,
      totalPages: 1,
    },
  });
});

// POST /api/admin/media/upload
router.post('/upload', requireMinRole('CONTENT_MANAGER'), (req, res) => {
  const newItem = {
    id: `med-${Date.now()}`,
    title: req.body.title || 'Uploaded Image',
    filename: `upload-${Date.now()}.jpg`,
    url: req.body.url || '/products/cranberries.jpg',
    mimeType: 'image/jpeg',
    size: 250000,
    folder: req.body.folder || 'uploads',
    createdAt: new Date().toISOString(),
  };
  mediaItems.unshift(newItem);
  res.status(201).json({ success: true, data: newItem, url: newItem.url });
});

// DELETE /api/admin/media/:id
router.delete('/:id', requireMinRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  mediaItems = mediaItems.filter((m) => m.id !== id);
  res.json({ success: true, message: 'Media item deleted successfully' });
});

export default router;
