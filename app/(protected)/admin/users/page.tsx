import React from 'react'
import UserComponent from './_components/user-component';

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      </div>
      <UserComponent />
    </div>
  );
}

export default page
