import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';

const router = Router();
router.use(authenticate);

// In-memory / persistent suppliers list
let suppliers = [
  {
    id: 'sup-1',
    name: 'Himalayan Organic Farms Co-op',
    contactPerson: 'Pasang Sherpa',
    email: 'organic.farms@himalaya.np',
    phone: '+977-9841234567',
    address: 'Mustang Organic Zone, Gandaki',
    city: 'Pokhara',
    productsCount: 8,
    status: 'ACTIVE',
    rating: 4.9,
    paymentTerms: 'Net 30',
    notes: 'Primary supplier for raw Himalayan honey, walnuts, and organic buckwheat.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sup-2',
    name: 'Kathmandu Superfood Traders',
    contactPerson: 'Bikram Shrestha',
    email: 'bikram@ktmsuperfoods.com',
    phone: '+977-9851098765',
    address: 'New Road Commercial Hub',
    city: 'Kathmandu',
    productsCount: 12,
    status: 'ACTIVE',
    rating: 4.8,
    paymentTerms: 'Net 15',
    notes: 'Distributor for pumpkin seeds, chia seeds, and imported dried cranberries.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sup-3',
    name: 'Terai Herbal & Moringa Cooperative',
    contactPerson: 'Sunita Chaudhary',
    email: 'sunita@teraiherbals.com',
    phone: '+977-9801239876',
    address: 'Chitwan Organic Belt',
    city: 'Bharatpur',
    productsCount: 5,
    status: 'ACTIVE',
    rating: 4.7,
    paymentTerms: 'Cash on Delivery',
    notes: 'Supplies high-potency moringa leaf powder and turmeric.',
    createdAt: new Date().toISOString(),
  },
];

// GET /api/admin/suppliers
router.get('/', requireMinRole('VIEWER'), (req, res) => {
  res.json({
    data: suppliers,
    pagination: {
      page: 1,
      limit: 50,
      total: suppliers.length,
      totalPages: 1,
    },
  });
});

// POST /api/admin/suppliers
router.post('/', requireMinRole('MANAGER'), (req, res) => {
  const { name, contactPerson, email, phone, address, city, paymentTerms, notes } = req.body;
  const newSupplier = {
    id: `sup-${Date.now()}`,
    name: name || 'New Supplier',
    contactPerson: contactPerson || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    city: city || 'Kathmandu',
    productsCount: 0,
    status: 'ACTIVE',
    rating: 5.0,
    paymentTerms: paymentTerms || 'Net 30',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };
  suppliers.push(newSupplier);
  res.status(201).json({ success: true, data: newSupplier });
});

// PUT /api/admin/suppliers/:id
router.put('/:id', requireMinRole('MANAGER'), (req, res) => {
  const { id } = req.params;
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Supplier not found' });
  }
  suppliers[index] = { ...suppliers[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: suppliers[index] });
});

// DELETE /api/admin/suppliers/:id
router.delete('/:id', requireMinRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  suppliers = suppliers.filter((s) => s.id !== id);
  res.json({ success: true, message: 'Supplier deleted successfully' });
});

export default router;
