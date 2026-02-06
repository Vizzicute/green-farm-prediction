"use client";

import LoadingButton from "@/components/loading-button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc/client";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roles } from "@/data";

interface iComProps {
    refetchUsers: () => void;
    role: string;
    userId: string;
}

const UpdateUserRoleForm = ({ refetchUsers, role, userId }: iComProps) => {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.adminUpdateUserRole.mutationOptions()
    );

    const formSchema = z.object({
      role: z.string(),
    });
    
  const resolver = zodResolver(
      formSchema
  ) as unknown as Resolver<z.infer<typeof formSchema>>;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver,
    defaultValues: {
      role,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(
      { role: data.role, id: userId },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          form.reset();
          refetchUsers();
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full focus-none border-primary/70 rounded-none">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent className="w-full border-primary/70 rounded-none">
                  <SelectGroup>
                    <SelectLabel>Available Roles</SelectLabel>
                    {roles.filter((role) => role !== "admin").map((role, index) => (
                        <SelectItem
                          key={index}
                          value={role}
                          className="capitalize"
                        >
                          {role}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Update User Role
        </LoadingButton>
      </form>
    </Form>
  );
}

export default UpdateUserRoleForm
