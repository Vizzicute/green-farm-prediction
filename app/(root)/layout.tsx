import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
