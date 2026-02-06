import React from "react";
import AddPredictionForm from "./_components/add-prediction-form";
import { Card, CardContent } from "@/components/ui/card";

const page = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Add Prediction</h1>
      <Card className="rounded-none">
        <CardContent>
          <AddPredictionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
