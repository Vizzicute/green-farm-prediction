"use client";

import LoadingButton from "@/components/loading-button";
import { TextEditor } from "@/components/text-editor/editor";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { mailSchema, MailSchemaType } from "@/schema/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronsUpDown,
  CreditCard,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const MailForm = () => {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  const { data: regularUsers, isLoading: isLoadingUsers } = useQuery(
    trpc.adminGetUsers.queryOptions({
      filters: { role: "user" },
      pageSize: 1000,
      currentPage: 1,
    })
  );

  const {
    data: subscriptionCategories,
    isLoading: isLoadingSubscriptionCategories,
  } = useQuery(trpc.adminGetSubscriptionCategories.queryOptions());

  const { mutate: sendMail, isPending: isSendingMail } = useMutation(
    trpc.sendMailWithRecipientType.mutationOptions()
  );

  const form = useForm<MailSchemaType>({
    resolver: zodResolver(mailSchema),
    defaultValues: {
      recipientType: "single-user",
      recipient: "",
      subscriptionId: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: MailSchemaType) => {
    sendMail(data, {
      onSuccess: (data: { status: number, message: string }) => {
        if (data.status === 200) {
          toast.success(data.message);
          form.reset();
        }
        toast.error(data.message);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recipientType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single-user">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Single User
                    </div>
                  </SelectItem>
                  <SelectItem value="all-users">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      All Users
                    </div>
                  </SelectItem>
                  <SelectItem value="all-subscribers">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      All Subscribers
                    </div>
                  </SelectItem>
                  <SelectItem value="non-subscribers">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Non-Subscribers
                    </div>
                  </SelectItem>
                  <SelectItem value="with-subscription-type">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      By Subscription Type
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("recipientType") === "single-user" && (
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("recipientType") === "single-user"
                    ? "Select User"
                    : "Select Subscription Type"}
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? regularUsers?.find(
                              (user) => user.email === field.value
                            )?.email
                          : "Select user"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {regularUsers?.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.email}
                            onSelect={() => {
                              form.setValue("recipient", user.email);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === user.email
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("recipientType") === "with-subscription-type" && (
          <FormField
            control={form.control}
            name="subscriptionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subscriptionCategories
                      ?.filter((cat) => cat.name !== "free")
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter email subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <div className="border rounded-md">
                  <TextEditor field={field} contentType={"html"} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isSendingMail} type="submit" className="w-full">
          Send Email
        </LoadingButton>
      </form>
    </Form>
  );
};

export default MailForm;
