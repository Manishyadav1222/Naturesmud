import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

router.use(authenticate);

const mapBlogPost = (post: any) => {
  let status = 'DRAFT';
  if (Number(post.is_published) === 1) status = 'PUBLISHED';
  
  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.featured_image, // maps to frontend coverImage
    author: post.author ? { name: post.author, firstName: post.author.split(' ')[0] || '', lastName: post.author.split(' ').slice(1).join(' ') || '' } : null,
    category: post.category,
    tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [],
    status,
    isPublished: Number(post.is_published) === 1,
    isFeatured: Number(post.is_featured) === 1, // Now properly mapped from DB
    publishedAt: post.published_at,
    metaTitle: post.meta_title,
    metaDescription: post.meta_description,
    views: post.views_count, // maps to frontend views
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
};

// GET /api/admin/blog - List blog posts
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = 'SELECT SQL_CALC_FOUND_ROWS * FROM blog_posts';
    const params = [];
    if (search) {
      query += ' WHERE title LIKE ? OR excerpt LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await laravelDb.query(query, params);
    const [countResult] = await laravelDb.query('SELECT FOUND_ROWS() as count');
    const total = (countResult as any)[0].count;

    res.json({
      data: (rows as any[]).map(mapBlogPost),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/blog/:id - Get single blog post
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const [rows] = await laravelDb.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    const post = (rows as any[])[0];
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ data: mapBlogPost(post) });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/blog - Create blog post
router.post('/', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, featuredImage, coverImage, author, category, tags, isPublished, status, seoTitle, seoDescription, isFeatured } = req.body;
    
    // Auto-generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const isPub = isPublished || status === 'PUBLISHED';
    const finalImage = coverImage || featuredImage;
    const finalMetaTitle = seoTitle;
    const finalMetaDesc = seoDescription;
    const finalIsFeatured = isFeatured ? 1 : 0;

    const [result] = await laravelDb.query(
      `INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, author, category, tags, 
        is_published, is_featured, published_at, meta_title, meta_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title, finalSlug, excerpt, content, finalImage, author, category, JSON.stringify(tags || []),
        isPub ? 1 : 0, finalIsFeatured, isPub ? new Date() : null, finalMetaTitle, finalMetaDesc
      ]
    );

    const [rows] = await laravelDb.query('SELECT * FROM blog_posts WHERE id = ?', [(result as any).insertId]);
    res.status(201).json({ data: mapBlogPost((rows as any[])[0]) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A blog post with this slug already exists' });
    }
    next(err);
  }
});

// PUT /api/admin/blog/:id - Update blog post
router.put('/:id', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, featuredImage, coverImage, author, category, tags, isPublished, status, seoTitle, seoDescription, isFeatured } = req.body;
    
    const [rows] = await laravelDb.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (!(rows as any[])[0]) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const fields: string[] = [];
    const params: any[] = [];

    const setField = (field: string, value: any) => {
      fields.push(`${field} = ?`);
      params.push(value);
    }

    if (title !== undefined) setField('title', title);
    if (slug !== undefined) setField('slug', slug);
    if (excerpt !== undefined) setField('excerpt', excerpt);
    if (content !== undefined) setField('content', content);
    if (featuredImage !== undefined || coverImage !== undefined) setField('featured_image', coverImage || featuredImage);
    if (author !== undefined) setField('author', author);
    if (category !== undefined) setField('category', category);
    if (tags !== undefined) setField('tags', JSON.stringify(tags));
    if (seoTitle !== undefined) setField('meta_title', seoTitle);
    if (seoDescription !== undefined) setField('meta_description', seoDescription);
    
    if (isPublished !== undefined || status !== undefined) {
      const isPub = isPublished !== undefined ? isPublished : status === 'PUBLISHED';
      setField('is_published', isPub ? 1 : 0);
      if (isPub && !(rows as any[])[0].published_at) {
        setField('published_at', new Date());
      }
    }

    if (isFeatured !== undefined) {
      setField('is_featured', isFeatured ? 1 : 0);
    }

    if (fields.length > 0) {
      fields.push('updated_at = NOW()');
      await laravelDb.query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
    }

    const [updatedRows] = await laravelDb.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    res.json({ data: mapBlogPost((updatedRows as any[])[0]) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A blog post with this slug already exists' });
    }
    next(err);
  }
});

// DELETE /api/admin/blog/:id - Delete blog post
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const [result] = await laravelDb.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
