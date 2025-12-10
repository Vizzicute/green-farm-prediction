"use client";

import { useTRPC } from '@/lib/trpc/client';
import { subscriptionSchema, SubscriptionType } from '@/schema/subscription';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from "react-hook-form";
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { SubDuration } from '@/generated/prisma';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import LoadingButton from '@/components/loading-button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Duration } from '@/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface iComProps {
  subscriberId: string;
  userId: string;
  subCatId: string;
  duration: SubDuration;
  refetchSubscribers: () => void;
}

const UpdateSubscriberForm = ({ subscriberId, userId, subCatId, duration, refetchSubscribers }: iComProps) => {
    const trpc = useTRPC();
    const [open, setOpen] = useState(false);
     const { mutate, isPending } = useMutation(
       trpc.adminUpdateSubscription.mutationOptions()
  );
  
    
      const { data: users } = useQuery(
        trpc.adminGetUsers.queryOptions({
          filters: {},
          currentPage: 1,
          pageSize: 100,
        })
      );
  const { data: categories, isLoading } = useQuery(trpc.adminGetSubscriptionCategories.queryOptions());
   
     const resolver = zodResolver(
       subscriptionSchema
     ) as unknown as Resolver<SubscriptionType>;
     
     const form = useForm<SubscriptionType>({
       resolver,
       defaultValues: {
         userId,
         duration,
         subscriptionCategoryId: subCatId,
       },
     });
   
     async function onSubmit(data: SubscriptionType) {
       mutate(
         { ...data, id: subscriberId  },
         {
           onSuccess: (data: { status: number; message: string }) => {
             if (data.status === 500) {
               toast.error(data.message);
             }
             toast.success(data.message);
             form.reset();
             refetchSubscribers();
           },
           onError: (error) => {
             toast.error("Something went wrong!");
           },
         }
       );
     }
     return (
       <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
               <FormField
                 control={form.control}
                 name="userId"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>User</FormLabel>
                     <Popover modal={false} open={open} onOpenChange={setOpen}>
                       <PopoverTrigger asChild>
                         <FormControl>
                           <Button
                             type="button"
                             variant="outline"
                             role="combobox"
                             aria-expanded={open}
                             className="w-full justify-between bg-background rounded-none border border-primary/70"
                           >
                             {field.value
                               ? users?.find((user) => user.id === field.value)?.email
                               : "Select user"}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                         </FormControl>
                       </PopoverTrigger>
                       <PopoverContent
                         className="w-full p-0"
                         align="start"
                         side="bottom"
                         sideOffset={4}
                         style={{ zIndex: 1000 }}
                       >
                         <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                           <CommandInput placeholder="search email..." />
                           <CommandList>
                             <CommandEmpty>No results found.</CommandEmpty>
                             <CommandGroup heading="user's email">
                               {users
                                 ?.filter((user) => user.role === "user")
                                 .map((user) => (
                                   <CommandItem
                                     key={user.id}
                                     value={user.email}
                                     onSelect={() => {
                                       form.setValue("userId", user.id);
                                       setOpen(false);
                                     }}
                                   >
                                     <Check
                                       className={cn(
                                         "mr-2 size-4",
                                         field.value === user.id
                                           ? "opacity-100"
                                           : "opacity-0"
                                       )}
                                     />
                                     {user.email}
                                   </CommandItem>
                                 ))}
                             </CommandGroup>
                           </CommandList>
                         </Command>
                       </PopoverContent>
                     </Popover>
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="duration"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Duration</FormLabel>
                     <Select value={field.value} onValueChange={field.onChange}>
                       <SelectTrigger className="w-full focus-none border-primary/70 rounded-none">
                         <SelectValue placeholder="Duration" />
                       </SelectTrigger>
                       <SelectContent className="w-full border-primary/70 rounded-none">
                         <SelectGroup>
                           <SelectLabel>Duration</SelectLabel>
                           {Duration?.map((d, index) => (
                             <SelectItem key={index} value={d.value}>
                               {d.name}
                             </SelectItem>
                           ))}
                         </SelectGroup>
                       </SelectContent>
                     </Select>
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="subscriptionCategoryId"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Subscription Category</FormLabel>
                     <Select value={field.value} onValueChange={field.onChange}>
                       <SelectTrigger className="w-full focus-none border-primary/70 rounded-none">
                         <SelectValue placeholder="Subscription category" />
                       </SelectTrigger>
                       <SelectContent className="w-full border-primary/70 rounded-none">
                         <SelectGroup>
                           <SelectLabel>Plan</SelectLabel>
                           {!isLoading &&
                             categories
                               ?.filter((cat) => cat.name !== "free")
                               .map((category) => (
                                 <SelectItem
                                   key={category.id}
                                   value={category.id}
                                   className="capitalize"
                                 >
                                   {category.name}
                                 </SelectItem>
                               ))}
                         </SelectGroup>
                       </SelectContent>
                     </Select>
                   </FormItem>
                 )}
               />
               <LoadingButton loading={isPending} type="submit" className="w-full">
                 Add Category
               </LoadingButton>
             </form>
           </Form>
     );
}

export default UpdateSubscriberForm
