import React from 'react'
import PageComponents from './_components/page-component';

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl font-bold tracking-tight">Site Pages Data</h1>
      </div>
      <PageComponents />
    </div>
  );
}

export default page
