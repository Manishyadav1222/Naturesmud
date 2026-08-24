import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { pool } from '../services/laravelDb';

const router = Router();

// Public submission route from storefront /contact page
router.post('/public', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || null;

    const [result]: any = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status, ip_address, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'unread', ?, NOW(), NOW())`,
      [name, email, phone || null, subject || 'General Inquiry', message, ip]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Our team will contact you shortly.',
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// Authenticated Admin Routes
router.use(authenticate);

// GET /api/admin/messages
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (status && status !== 'ALL') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const [rows]: any = await pool.query(
      `SELECT id, name, email, phone, subject, message, status, admin_reply, replied_at, created_at
       FROM contact_messages
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM contact_messages WHERE ${whereClause}`,
      params
    );
    const total = Number(countRows[0]?.total || 0);

    const [unreadRows]: any = await pool.query(
      `SELECT COUNT(*) as unreadCount FROM contact_messages WHERE status = 'unread'`
    );
    const unreadCount = Number(unreadRows[0]?.unreadCount || 0);

    res.json({
      success: true,
      data: rows,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/messages/:id
router.patch('/:id', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (adminReply !== undefined) {
      updates.push('admin_reply = ?');
      values.push(adminReply);
      updates.push('replied_at = NOW()');
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE contact_messages SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true, message: 'Message updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/messages/:id
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM contact_messages WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

export default router;
