"use client";
import NavBar from "@/app/dashboard/components/nav-bar";
import ResponsiveTitle from "@/components/responsive-title";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUserId from "@/app/dashboard/components/get-userID";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Group form schema
const groupFormSchema = z.object({
  groupName: z.string()
    .min(1,
      { message: "Group name is required" })
    .max(100,
      { message: "Group name cannot exceed 100 characters" }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function GroupTasks() {
  const [createdGroups, setCreatedGroups] = useState<{ groupID: number; groupName: string; groupDescription: string }[]>([]);

  const [memberGroups, setMemberGroups] = useState<{ groupID: number; groupName: string; groupDescription: string }[]>([]);

  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const userId = useUserId();

  const groupForm = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  useEffect(() => {
    if (userId) {
      setLoading(true);

      // Load created groups
      const fetchCreatedGroups = async () => {
        try {
          const response = await fetch("/api/fetch_user_created_groups", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: Number(userId) }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch created groups");
          }

          const data = await response.json();
          setCreatedGroups(data.groups || []);
        } catch (error) {
          console.error("Error fetching created groups:", error);
        }
      };

      // Load member groups
      const fetchMemberGroups = async () => {
        try {
          const response = await fetch("/api/fetch_user_member_groups", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: Number(userId) }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch member groups");
          }

          const data = await response.json();
          setMemberGroups(data.groups || []);
        } catch (error) {
          console.error("Error fetching member groups:", error);
        }
      };

      // Run both fetches in parallel
      Promise.all([fetchCreatedGroups(), fetchMemberGroups()])
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const onGroupSubmit = async (data: GroupFormValues) => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    console.log("Creating group with data:", data);
  };

  return (
    <>
      <NavBar pageName="Group Tasks" />
      <main className=" space-y-6">
        <ResponsiveTitle title="Group Tasks" />

        {/* Created Groups */}
        <section className="space-y-4 brder-2 p-4 rounded-md">
          <h2 className="text-xl font-semibold">Groups You Created</h2>

          {/* Created Groups Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">Loading your groups...</div>
            ) : createdGroups.length > 0 ? (
              createdGroups.map((group) => (
                <Card key={group.groupID} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{group.groupName}</CardTitle>
                    <CardDescription>{group.groupDescription || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">You are the admin of this group</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                    >
                      View Tasks
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                    >
                      Manage Members
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-10">
                <p className="text">You haven&apos;t created any groups yet</p>
              </div>
            )}
          </div>

          {/* Create Group Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size={"lg"} className="w-full">Create New Group</Button>
            </DialogTrigger>
            <DialogContent className="w-full p-6">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <Form {...groupForm}>
                <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4">
                  <FormField
                    control={groupForm.control}
                    name="groupName"
                    render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter group name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-4">
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </section>

        {/* Member Groups Section */}
        <section className="space-y-4 pt-6 border-t">
          <h2 className="text-xl font-semibold">Groups You&apos;re Member Of</h2>

          {/* Member Groups Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">Loading groups...</div>
            ) : memberGroups.length > 0 ? (
              memberGroups.map((group) => (
                <Card key={group.groupID} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{group.groupName}</CardTitle>
                    <CardDescription>{group.groupDescription || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">You are a member of this group</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      View Tasks
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-10">
                <p>You&apos;re not a member of any groups</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}