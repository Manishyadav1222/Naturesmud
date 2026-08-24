'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Badge } from '@/components/admin/Badge';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { Select } from '@/components/admin/Select';
import { Modal } from '@/components/admin/Modal';
import { toast } from 'sonner';
import {
  Search,
  CircleAlert,
  UserPlus,
  Pencil,
  Trash2,
  Shield,
  Users as UsersIcon,
  Leaf,
  Mail,
  CheckCircle2,
  XCircle,
  KeyRound,
  RefreshCw,
  Sliders,
  Send,
  Power,
  ShieldAlert,
  Save,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: string | null;
  permissions: string[];
  lastLoginAt?: string | null;
  createdAt: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string | null;
  userCount: number;
  permissions: string[];
}

interface PermissionItem {
  id: string;
  name: string;
  key: string;
}

const ROLE_BADGES: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary' }> = {
  SUPER_ADMIN: { label: 'Super Admin', variant: 'danger' },
  ADMIN: { label: 'Admin', variant: 'warning' },
  MANAGER: { label: 'Manager', variant: 'info' },
  MARKETING: { label: 'Marketing', variant: 'info' },
  WAREHOUSE: { label: 'Warehouse', variant: 'secondary' },
  SUPPORT: { label: 'Support', variant: 'info' },
  CONTENT_MANAGER: { label: 'Content Mgr', variant: 'success' },
  VIEWER: { label: 'Viewer', variant: 'secondary' },
  CUSTOMER: { label: 'Customer', variant: 'secondary' },
};

const ALL_ROLES_LIST = [
  { value: 'SUPER_ADMIN', label: 'Super Admin (Full Control)' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Store Manager' },
  { value: 'MARKETING', label: 'Marketing & Discounts' },
  { value: 'WAREHOUSE', label: 'Warehouse & Inventory' },
  { value: 'SUPPORT', label: 'Customer Support' },
  { value: 'CONTENT_MANAGER', label: 'Content & Blog Manager' },
  { value: 'VIEWER', label: 'Viewer (Read-Only)' },
  { value: 'CUSTOMER', label: 'Customer' },
];

export default function AdminUsersPage() {
  const { hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [rolePermissionKeys, setRolePermissionKeys] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    roleName: 'ADMIN',
    password: '',
    isActive: true,
    isVerified: true,
    sendWelcomeEmail: true,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleName: 'ADMIN',
    isActive: true,
    isVerified: false,
    newPassword: '',
  });

  const canManage = hasPermission(PERMISSIONS.MANAGE_USERS);

  const fetchUsersAndRoles = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get<{ success: boolean; data: { users: AdminUser[] } }>('/users'),
        api.get<{ success: boolean; data: { roles: RoleItem[]; availablePermissions: PermissionItem[] } }>('/roles'),
      ]);

      if (usersRes.data?.users) {
        setUsers(usersRes.data.users);
      }
      if (rolesRes.data?.roles) {
        setRoles(rolesRes.data.roles);
      }
      if (rolesRes.data?.availablePermissions) {
        setAvailablePermissions(rolesRes.data.availablePermissions);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load users from database');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage users and roles."
      />
    );
  }

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter ? u.roleName === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const adminCount = users.filter((u) => ['SUPER_ADMIN', 'ADMIN'].includes(u.roleName)).length;

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setActionLoading(true);
    try {
      await api.post('/users', newUser);
      toast.success(`User ${newUser.name} created successfully!`);
      setShowCreate(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        roleName: 'ADMIN',
        password: '',
        isActive: true,
        isVerified: true,
        sendWelcomeEmail: true,
      });
      fetchUsersAndRoles(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      roleName: user.roleName,
      isActive: user.isActive,
      isVerified: user.isVerified,
      newPassword: '',
    });
  };

  // Handle Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setActionLoading(true);
    try {
      await api.put(`/users/${editingUser.id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        roleName: editForm.roleName,
        isActive: editForm.isActive,
        isVerified: editForm.isVerified,
        password: editForm.newPassword || undefined,
      });
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchUsersAndRoles(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await api.post(`/users/${user.id}/toggle-status`);
      toast.success(`${user.name} is now ${user.isActive ? 'Inactive' : 'Active'}`);
      fetchUsersAndRoles(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Handle Resend Gmail Verification OTP
  const handleResendVerification = async (user: AdminUser) => {
    try {
      await api.post(`/users/${user.id}/resend-verification`);
      toast.success(`6-digit Gmail verification OTP sent to ${user.email}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification code');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Are you sure you want to remove ${user.name}? This will deactivate their account.`)) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      toast.success(`User ${user.name} deleted.`);
      fetchUsersAndRoles(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  // Open Edit Role Permissions Modal
  const handleOpenRoleEdit = (role: RoleItem) => {
    setEditingRole(role);
    setRolePermissionKeys([...role.permissions]);
  };

  // Save Role Permissions
  const handleSaveRolePermissions = async () => {
    if (!editingRole) return;
    setActionLoading(true);
    try {
      await api.put(`/roles/${editingRole.id}/permissions`, {
        permissionKeys: rolePermissionKeys,
      });
      toast.success(`Permissions for ${editingRole.name} updated!`);
      setEditingRole(null);
      fetchUsersAndRoles(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role permissions');
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatDate = (date?: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users, Roles & Verification</h1>
          <p className="mt-1 text-sm text-gray-500">Manage administrator accounts, staff roles, and Gmail OTP verification.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchUsersAndRoles()}>
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Add Staff Member
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UsersIcon className="h-4 w-4" /> Team & Staff ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roles' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sliders className="h-4 w-4" /> Role & Permission Matrix ({roles.length})
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Team Members" value={String(users.length)} icon={<UsersIcon className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Active Accounts" value={String(activeCount)} icon={<Leaf className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Gmail Verified" value={String(verifiedCount)} icon={<CheckCircle2 className="h-5 w-5 text-green-600" />} />
        <StatCard title="Admin Privileges" value={String(adminCount)} icon={<Shield className="h-5 w-5 text-amber-600" />} />
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Search by name, email, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Roles' },
                    ...ALL_ROLES_LIST,
                  ]}
                  placeholder="All Roles"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'ACTIVE', label: 'Active Only' },
                    { value: 'INACTIVE', label: 'Inactive / Suspended' },
                  ]}
                  placeholder="All Statuses"
                />
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Email Verification</th>
                  <th className="px-4 py-3.5">Last Login</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <RefreshCw className="h-5 w-5 animate-spin text-primary-600" /> Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={ROLE_BADGES[user.roleName]?.variant || 'secondary'}>
                          {ROLE_BADGES[user.roleName]?.label || user.roleName}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                            user.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Gmail Verified
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                              <XCircle className="h-3.5 w-3.5" /> Unverified
                            </span>
                            <button
                              onClick={() => handleResendVerification(user)}
                              className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1"
                              title="Send Gmail OTP"
                            >
                              <Send className="h-3 w-3" /> Send OTP
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">{formatDate(user.lastLoginAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Edit User & Roles"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{role.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{role.description || 'System Role'}</p>
                  </div>
                  <Badge variant={ROLE_BADGES[role.name]?.variant || 'secondary'}>
                    {role.userCount} User{role.userCount === 1 ? '' : 's'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Permissions ({role.permissions.length}):</p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {role.name === 'SUPER_ADMIN' ? (
                      <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                        * ALL PERMISSIONS (Full Access)
                      </span>
                    ) : role.permissions.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No special permissions</span>
                    ) : (
                      role.permissions.map((perm) => (
                        <span key={perm} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          {perm}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {role.name !== 'SUPER_ADMIN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleOpenRoleEdit(role)}
                  >
                    <Sliders className="h-3.5 w-3.5 mr-1.5" /> Edit Permissions
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add New Staff / Admin User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name *</label>
            <Input
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Ramesh Shrestha"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address *</label>
            <Input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="ramesh@naturesmud.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone (Optional)</label>
            <Input
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Role</label>
            <Select
              value={newUser.roleName}
              onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })}
              options={ALL_ROLES_LIST}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
            <Input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Leave blank to auto-generate secure password"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newUser.sendWelcomeEmail}
                onChange={(e) => setNewUser({ ...newUser, sendWelcomeEmail: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              Send Welcome & Credentials via Gmail
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newUser.isVerified}
                onChange={(e) => setNewUser({ ...newUser, isVerified: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              Mark Email as Verified Immediately
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Edit Staff: ${editingUser?.name}`}
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</label>
            <Input
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
            <Input
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone</label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Role</label>
            <Select
              value={editForm.roleName}
              onChange={(e) => setEditForm({ ...editForm, roleName: e.target.value })}
              options={ALL_ROLES_LIST}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">New Password (Optional)</label>
            <Input
              type="password"
              placeholder="Leave blank to keep existing password"
              value={editForm.newPassword}
              onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              Account Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isVerified}
                onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              Email Verified via Gmail
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT ROLE PERMISSIONS MODAL */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title={`Configure Permissions: ${editingRole?.name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Check the permissions that members with the <strong>{editingRole?.name}</strong> role should have access to:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
            {availablePermissions.map((perm) => {
              const isChecked = rolePermissionKeys.includes(perm.key);
              return (
                <label
                  key={perm.key}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isChecked ? 'border-primary-500 bg-primary-50/50 text-primary-900' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRolePermissionKeys([...rolePermissionKeys, perm.key]);
                      } else {
                        setRolePermissionKeys(rolePermissionKeys.filter((k) => k !== perm.key));
                      }
                    }}
                    className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-semibold">{perm.name}</span>
                    <span className="block text-[10px] text-gray-400">{perm.key}</span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveRolePermissions} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Role Permissions'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}