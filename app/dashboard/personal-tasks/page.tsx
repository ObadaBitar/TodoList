"use client";
import NavBar from "@/app/dashboard/components/nav-bar";
import ResponsiveTitle from "@/components/responsive-title";
import * as React from "react"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuPortal,
  // DropdownMenuSeparator,
  // DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useUserId from "@/app/dashboard/components/get-userID";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/app/dashboard/components/combo-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2 } from "lucide-react";

// TODO: ADD NOTFICATIONS FOR USER INTERACTIONS LIKE ADDING, DELETING TASKS AND TASKLISTS

const fetchUserTaskLists = async (userId: number) => {
  try {
    const response = await fetch("/api/fetch_user_task_lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.taskLists;
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return null;
  }
}

const fetchUserTasks = async (taskListID: number) => {
  try {
    const response = await fetch("/api/fetch_user_task_list_tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskListID }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
}

const createTaskListFormSchema = (userId: string | null) => z.object({
  taskListName: z.string()
    .min(1, { message: "Task list name is required" })
    .max(200, { message: "Task list name cannot exceed 200 characters" })
    .refine(async (name) => {
      if (!userId) return true;
      return await checkTaskListName(Number(userId), name);
    }, {
      message: "Task list name already exists",
    }),
});

const createTaskFormSchema = () => z.object({
  taskName: z.string()
    .min(1, { message: "Task name is required" })
    .max(100, { message: "Task name cannot exceed 100 characters" }),
  taskDescription: z.string()
    .max(1000, { message: "Task description cannot exceed 1000 characters" }),
});

const createTaskEditFormSchema = () => z.object({
  taskName: z.string()
    .min(1, { message: "Task name is required" })
    .max(100, { message: "Task name cannot exceed 100 characters" }),
  taskDescription: z.string()
    .max(1000, { message: "Task description cannot exceed 1000 characters" }),
  taskStatus: z.number(),
});



const checkTaskListName = async (userID: number, taskListName: string) => {
  try {
    const response = await fetch("/api/check_task_list_name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, taskListName }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking task list name:", error);
    return false;
  }
}

const addTaskList = async (userID: number, taskListName: string) => {
  try {
    const response = await fetch("/api/add_task_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, taskListName }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.taskListID;
  } catch (error) {
    console.error("Error adding task list:", error);
    return null;
  }
}

const addTask = async (taskListID: number, taskName: string, optionalDescription?: string) => {
  try {
    const response = await fetch("/api/add_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskListID, taskName, optionalDescription }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.taskID;
  } catch (error) {
    console.error("Error adding task list:", error);
    return null;
  }
}

const deleteTask = async (taskID: number) => {
  try {
    const response = await fetch("/api/delete_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskID }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting task:", error);
    return null;
  }
}

const deleteTaskList = async (taskListID: number) => {
  try {
    const response = await fetch("/api/delete_task_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskListID }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting task:", error);
    return null;
  }
}

const editTask = async (taskID: number, taskListID: number, taskName: string, taskDescription: string, taskStatus: number) => {
  try {
    const response = await fetch("/api/edit_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskID, taskListID, taskName, taskDescription, taskStatus }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error editing task:", error);
    return false;
  }
}

type TaskListFormValues = z.infer<ReturnType<typeof createTaskListFormSchema>>;
type TaskFormValues = z.infer<ReturnType<typeof createTaskFormSchema>>;
type TaskEditFormValues = z.infer<ReturnType<typeof createTaskEditFormSchema>>;

/////////////////////////////////////////////////////////////////////////////////////////

export default function PersonalTasks() {
  const [loading, setLoading] = useState(true);
  const [taskLists, setTaskLists] = useState<{ taskListID: number; taskListName: string, isSystem: number }[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<{ taskListID: number; taskListName: string }>({ taskListID: 0, taskListName: "Unassigned Tasks" });
  const [selectedTaskTaskList, setSelectedTaskTaskList] = useState<{ taskListID: number; taskListName: string }>({ taskListID: 0, taskListName: "Unassigned Tasks" });
  const [tasks, setTasks] = useState<{
    taskID: number;
    taskListID: string;
    taskName: string;
    taskDescription: string;
    taskStatus: number;
  }[]>([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const userId = useUserId();
  // console.log("User ID:", userId);

  const formSchemas = React.useMemo(() => ({
    taskListSchema: createTaskListFormSchema(userId),
    taskSchema: createTaskFormSchema(),
    taskEditSchema: createTaskEditFormSchema(),
  }), [userId]);

  const taskListForm = useForm<TaskListFormValues>({
    resolver: zodResolver(formSchemas.taskListSchema),
    defaultValues: {
      taskListName: "",
    },
    context: { userId },
  });

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(formSchemas.taskSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
    },
  });

  const taskEditForm = useForm<TaskEditFormValues>({
    resolver: zodResolver(formSchemas.taskEditSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      taskStatus: 0,
    },
  });

  const onTaskListSubmit = async (data: TaskListFormValues) => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    console.log("Creating new task list with name:", data.taskListName);
    const taskListID = await addTaskList(Number(userId), data.taskListName);
    if (taskListID) {
      const newTaskList = {
        taskListID,
        taskListName: data.taskListName,
        isSystem: 0,
      };

      setTaskLists(prev => [...prev, newTaskList]);
      setSelectedTaskList(newTaskList);
      taskListForm.reset();
    }
  }

  const onTaskSubmit = async (data: TaskFormValues) => {
    console.log("Creating new task with name:", data.taskName, selectedTaskTaskList.taskListID);
    if (selectedTaskTaskList.taskListID <= 0) {
      console.error("No task list selected");
      return;
    }
    const taskID = await addTask(selectedTaskTaskList.taskListID, data.taskName, data.taskDescription);

    if (taskID) {
      const newTask = {
        taskID,
        taskListID: selectedTaskTaskList.taskListID.toString(),
        taskName: data.taskName,
        taskDescription: data.taskDescription,
        taskStatus: 0
      };

      setTasks(prev => [...prev, newTask]);
      setSelectedTaskList(selectedTaskTaskList);
      taskForm.reset();
      setTaskDialogOpen(false);
    }
  };

  const onTaskEdit = async (data: TaskEditFormValues, taskID: number) => {
    console.log("Editing task with ID:", taskID);
    const taskListID = selectedTaskTaskList.taskListID;
    const success = await editTask(taskID, taskListID, data.taskName, data.taskDescription, data.taskStatus);
    
    if (success) {
      console.log("Task edited successfully:", taskID);
      setTasks(prev => prev.map(task =>
        task.taskID === taskID
          ? {
            ...task, 
            taskListID: taskListID.toString(),
            taskName: data.taskName, 
            taskDescription: data.taskDescription, 
            taskStatus: data.taskStatus
          }
          : task
      ));
      
      setEditDialogOpen(false);
      
      if (Number(selectedTaskList.taskListID) !== taskListID) {
        const currentListTasks = await fetchUserTasks(selectedTaskList.taskListID);
        if (currentListTasks) {
          setTasks(currentListTasks);
        }
        
        setSelectedTaskList(selectedTaskTaskList);
      }
    }
  }

  const onTaskListDelete = async (taskListID: number) => {
    console.log("Deleting task list with ID:", taskListID);
    const success = await deleteTaskList(taskListID);
    if (success) {
      console.log("Task List deleted successfully:", taskListID);
      setTaskLists(prev => prev.filter(taskList => taskList.taskListID !== taskListID));
      setSelectedTaskList({ taskListID: taskLists[0].taskListID, taskListName: "Unassigned Tasks" });
    }
  }

  const onTaskDelete = async (taskID: number) => {
    console.log("Deleting task with ID:", taskID);
    const success = await deleteTask(taskID);
    if (success) {
      console.log("Task deleted successfully:", taskID);
      setTasks(prev => prev.filter(task => task.taskID !== taskID));
    }
  }

  const openEditDialog = (data: TaskEditFormValues) => {
    taskEditForm.reset({
      taskName: data.taskName,
      taskDescription: data.taskDescription,
      taskStatus: data.taskStatus,
    });

    setEditDialogOpen(true);
  };


  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const lists = await fetchUserTaskLists(Number(userId));
        if (lists) {
          setTaskLists(lists);
          setSelectedTaskList({ taskListID: lists[0].taskListID, taskListName: lists[0].taskListName });
          setSelectedTaskTaskList({ taskListID: lists[0].taskListID, taskListName: lists[0].taskListName });
          console.log("Task Lists:", lists);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedTaskList.taskListID > 0) {
      console.log("Fetching tasks for task list ID:", selectedTaskList.taskListID);
      const fetchData = async () => {
        const fetchedTasks = await fetchUserTasks(selectedTaskList.taskListID)
        if (fetchedTasks) {
          setTasks(fetchedTasks);
          console.log("Tasks:", fetchedTasks);
        }
        setLoading(false);
      }
      fetchData();
    }
  }, [selectedTaskList, selectedTaskTaskList]);

  return (
    <>
      <NavBar pageName="Personal Tasks" />
      <main className="py-4 gap-4.5 overflow-hidden">
        <ResponsiveTitle title="Personal Tasks" />

        {/* TASKLISTS DISPLAY */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg p-6" >
              {selectedTaskList.taskListName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-100 mt-2 p-4 h-100 flex flex-col gap-4.5 border-2 overflow-hidden">
            <div className="flex-1 border-1 rounded-md p-4 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-20">Loading...</div>
              ) : taskLists.length > 1 ? (
                <div className="flex flex-col gap-6 ">
                  <div>
                    <DropdownMenuItem
                      className="border rounded-md p-3 mb-1 max-w-full "
                      key={taskLists[0].taskListID}
                      onClick={() => {
                        setSelectedTaskList(taskLists[0]);
                        console.log("Selected Task List:", taskLists[0]);
                      }}
                    >
                      {taskLists[0].taskListName}
                    </DropdownMenuItem>
                  </div>

                  <div className="flex-1 gap-5 flex flex-col overflow-visible">
                    {taskLists.map((taskList) => (
                      taskList.isSystem === 1 ? null : (
                        <div key={taskList.taskListID} className="flex gap-3">
                          <DropdownMenuItem
                            className="flex-1 border rounded-md p-3 max-w-full "
                            onClick={() => {
                              setSelectedTaskList(taskList);
                              console.log("Selected Task List:", taskList);
                            }}
                          >
                            {taskList.taskListName}
                          </DropdownMenuItem>
                          <Button variant="destructive" className="h-auto"
                            onClick={() => {
                              onTaskListDelete(taskList.taskListID);
                            }}
                          >
                            <Trash2 className="h-500" />
                          </Button>
                        </div>
                      )
                    ))
                    }
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center h-20">
                  No task lists found
                </div>
              )}
            </div>

            {/* TASKLIST CREATION DIALOG */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full px-8 py-6">
                  Create New Task List
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full p-8">
                <DialogHeader>
                  <DialogTitle>Create New Task List</DialogTitle>
                </DialogHeader>
                <Form {...taskListForm}>
                  <form onSubmit={taskListForm.handleSubmit(onTaskListSubmit)} className="space-y-6">
                    <FormField
                      control={taskListForm.control}
                      name="taskListName"
                      render={({ field }) => (
                        <FormItem className="space-y-0.5">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter task list name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="mt-4">
                      <Button type="submit">Create Task List</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

          </DropdownMenuContent>
        </DropdownMenu>

        {/* TASKS DISPLAY */}
        <div className="h-full p-4 rounded-lg border border-input bg-background overflow-auto">
          {loading ? (
            <div className="flex justify-center mt-8">Loading tasks...</div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.taskID} className="hover:shadow-lg transition-shadow rounded-md">
                  <CardHeader>
                    <CardTitle>
                      {task.taskName}
                    </CardTitle>
                    <CardDescription>{task.taskDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex">
                    {task.taskStatus === 1 ? (
                      <p className="text-green-500">Completed</p>)
                      : (
                        <p className="text-red-500">Pending</p>)}
                  </CardContent>
                  <CardFooter className="flex justify-between">


                    {/* EDIT TASk*/}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" onClick={() => { openEditDialog(task); }}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full p-8">
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <Form {...taskEditForm}>
                          <form
                            className="space-y-6"
                            onSubmit={taskEditForm.handleSubmit((data) => {
                              if (task.taskID !== null) {
                                onTaskEdit(data, task.taskID);
                              }
                            })}
                          >
                            <FormField
                              name="taskName"
                              control={taskEditForm.control}
                              render={({ field }) => (
                                <FormItem className="space-y-0.5">
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="taskDescription"
                              render={({ field }) => (
                                <FormItem className="space-y-0.5">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      className="min-h-[100px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex space-y-2 w-full content-center flex-col">
                              <Label>Status</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size={"lg"}
                                className="w-full "
                                onClick={() => {
                                  const currentStatus = taskEditForm.getValues("taskStatus");
                                  const newStatus = currentStatus === 1 ? 0 : 1;
                                  taskEditForm.setValue("taskStatus", newStatus);
                                }}
                              >
                                {taskEditForm.watch("taskStatus") === 1 ? "Mark as Pending" : "Mark as Completed"}
                              </Button>
                            </div>
                            {selectedTaskList && (
                                <div className="space-y-2">
                                <Label>Select Task List</Label>
                                <Combobox
                                  options={taskLists
                                  .map(list => ({
                                    label: list.taskListName,
                                    value: list.taskListID
                                  }))}
                                  placeholder="Select a task list"
                                  defaultValue={selectedTaskList.taskListID}
                                  onChange={(value) => {
                                  const selected = taskLists.find(list => list.taskListID === value);
                                  if (selected) {
                                    setSelectedTaskTaskList(selected);
                                  }
                                  }}
                                />
                                </div>
                            )}
                            <DialogFooter className="mt-4">
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>

                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>


                    <Button variant="destructive" size="lg"
                      onClick={() => onTaskDelete(task.taskID)}
                    >
                      Delete
                    </Button>

                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32 mt-4">
              <p className="text-muted-foreground">No tasks found in this list</p>
            </div>
          )}
        </div>


        {/* TASK CREATION DIALOG */}
        <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full px-8 py-6"
            >
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full p-8">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <Form {...taskForm}>
              <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-6">
                <FormField
                  control={taskForm.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={taskForm.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter task description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTaskList && (
                  <div className="space-y-2">
                    <Label>Select Task List</Label>
                    <Combobox
                      options={taskLists
                        .map(list => ({
                          label: list.taskListName,
                          value: list.taskListID
                        }))}
                      placeholder="Select a task list"
                      defaultValue={selectedTaskList.taskListID}
                      onChange={(value) => {
                        const selected = taskLists.find(list => list.taskListID === value);
                        if (selected) {
                          setSelectedTaskTaskList(selected);
                        }
                      }}
                    />
                  </div>
                )}

                <DialogFooter className="mt-4">
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </main >
    </>
  );
}