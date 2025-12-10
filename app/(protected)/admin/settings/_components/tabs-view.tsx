"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Mail, Share2, Tag, TrendingDown } from 'lucide-react';
import React, { useState } from 'react'
import EmailSettingForm from './email-setting-form';
import GoogleTagForm from './google-tag-form';
import SocialSettingForm from './social-setting-form';
import PricesForm from './prices-form';
import DiscountsForm from './discounts-form';

const TabsView = () => {
    const [activeTab, setActiveTab] = useState("email");
  return (
    <Tabs
      defaultValue="email"
      className="space-y-4"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="w-full">
        <TabsTrigger value="email">
          <Mail className="size-4 mr-2" />
          Email
        </TabsTrigger>
        <TabsTrigger value="google-tags">
          <Tag className="size-4 mr-2" />
          Google Tags
        </TabsTrigger>
        <TabsTrigger value="social-links">
          <Share2 className="size-4 mr-2" />
          Socials
        </TabsTrigger>
        <TabsTrigger value="prices">
          <DollarSign className="size-4 mr-2" />
          Prices
        </TabsTrigger>
        <TabsTrigger value="discounts">
          <TrendingDown className="size-4 mr-2" />
          Discounts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailSettingForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="google-tags">
        <Card>
          <CardHeader>
            <CardTitle>Google Tag Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleTagForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="social-links">
        <Card>
          <CardHeader>
            <CardTitle>Social Links & Contact Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialSettingForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="prices">
        <Card>
          <CardHeader>
            <CardTitle>Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <PricesForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="discounts">
        <Card>
          <CardHeader>
            <CardTitle>Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DiscountsForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default TabsView
