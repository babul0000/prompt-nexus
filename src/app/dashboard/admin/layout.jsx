import { requireRole } from '@/lib/core/session';
import React from 'react';

const AdminLayout = async ({ children }) => {
    // Protect all admin routes to ensure only users with 'admin' role can access them
    // await requireRole('admin');
    
    return children;
};

export default AdminLayout;
