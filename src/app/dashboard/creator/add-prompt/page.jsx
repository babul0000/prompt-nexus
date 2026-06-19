import React from 'react';

// import { getLoggedInRecruiterCompany } from '@/lib/api/companies';
import CreatePromptForm from './CreatePromptForm';

const PostJobsForm = async() => {
    // const company = await getLoggedInRecruiterCompany();
    // console.log(company, "company in post job form");
    return (
        <div>
            <CreatePromptForm  />
        </div>
    );
};

export default PostJobsForm;