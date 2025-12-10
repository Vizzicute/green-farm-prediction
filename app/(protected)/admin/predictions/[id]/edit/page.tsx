import { Card, CardContent } from '@/components/ui/card';
import React from 'react'
import EditPredictionForm from './_components/edit-prediction-form';

const page = async ({ params }: {params: Promise<{ id: string }>}) => {
    const { id } = await params;
  return (
    <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Edit Prediction</h1>
          <Card className="rounded-none">
            <CardContent>
              <EditPredictionForm id={id} />
            </CardContent>
          </Card>
        </div>
  )
}

export default page
