import React, { Suspense } from "react";
import TabView from "./_components/tab-view";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabView />
    </Suspense>
  );
};

export default page;
