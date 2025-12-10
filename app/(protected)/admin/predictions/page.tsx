import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import PredictionComponents from "./_components/prediction-components";

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Predictions</h1>
        <Link
          href="/admin/predictions/add"
          className={buttonVariants({ className: "hover:bg-primary/80" })}
        >
          <Plus className="mr-2 size-4" /> Add Prediction
        </Link>
      </div>
      <PredictionComponents />
    </div>
  );
};

export default page;
