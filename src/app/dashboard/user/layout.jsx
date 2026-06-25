import { requireRole } from '@/lib/core/session';
import React from 'react';

const UserLayout = async ({ children }) => {
    // Protect all user routes to ensure only users with 'user' role can access them
    await requireRole('user');
    
    return children;
};

export default UserLayout;
