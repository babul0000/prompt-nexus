import { requireRole } from '@/lib/core/session';
import React from 'react';

const CreatorLayout = async ({ children }) => {
    // রিকোয়ারমেন্ট অনুযায়ী এই লেআউটটি শুধু 'creator' রোলের জন্য প্রটেক্ট করা হলো
    await requireRole('creator');
    
    return children;
};

export default CreatorLayout;