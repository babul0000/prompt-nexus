
import React from 'react';
import MyPrompts from './MyPrompts';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMyPrompts } from '@/lib/api/prompt';

const MyPromptPage = async() => {
    const {user} = await auth.api.getSession({headers: await headers()})

    const data = await getMyPrompts(user?.id);
                        console.log(data, 'data');
    
    
    return (
        <div>
            <MyPrompts/>
        </div>
    );
};

export default MyPromptPage;