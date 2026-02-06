"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'
import MailForm from './mail-form';
import LoadingButton from '@/components/loading-button';
import { useTRPC } from '@/lib/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const MailTabView = () => {
    const trpc = useTRPC();

    const { mutate: sendPredictionsToAllSubscribers, isPending } = useMutation(
      trpc.sendPredictionsToAllSubscribers.mutationOptions()
    );
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General Mail</TabsTrigger>
        <TabsTrigger value="predictions">Prediction Games</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Send Email</CardTitle>
          </CardHeader>
          <CardContent>
            <MailForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="predictions">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <CardTitle>Send Prediction Games</CardTitle>
              <LoadingButton
                loading={isPending}
                type="button"
                onClick={() =>
                  sendPredictionsToAllSubscribers(undefined, {
                    onSuccess: (data: { status: number, message: string }) => {
                      if (data.status === 200) {
                        toast.success(data.message);
                      }
                      toast.error(data.message);
                    },
                    onError: (error) => {
                      toast.error(`Error: ${error.message}`);
                    }
                  })
                }
              >
                {isPending
                  ? "Sending..."
                  : "Send Predictions to All Subscribers"}
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default MailTabView
