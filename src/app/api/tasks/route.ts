import { NextResponse } from "next/server";
import { getTasks, setTasks, getActivity, addActivity } from "@/lib/redis";

const TASK_KEY = "tasks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  
  if (type === "activity") {
    const activity = await getActivity();
    return NextResponse.json(activity);
  }
  
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tasks = await getTasks();
  
  const newTask = {
    id: Date.now().toString(),
    title: body.title,
    description: body.description || "",
    status: "todo",
    priority: body.priority || "medium",
    category: body.category || "general",
    assignee: body.assignee || null,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  await setTasks(tasks);
  
  await addActivity("created", newTask.id, newTask.title, `Created with priority ${newTask.priority}`);
  
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  let tasks = await getTasks();
  
  const index = tasks.findIndex((t: any) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  const oldTask = tasks[index];
  tasks[index] = {
    ...tasks[index],
    ...body,
    updated: new Date().toISOString(),
  };
  
  await setTasks(tasks);
  
  // Log activity
  if (body.status && body.status !== oldTask.status) {
    await addActivity("status_changed", oldTask.id, oldTask.title, `${oldTask.status} → ${body.status}`);
  } else if (body.assignee !== undefined) {
    const assignee = body.assignee || "unassigned";
    await addActivity("assigned", oldTask.id, oldTask.title, `Assigned to ${assignee}`);
  } else if (body.title || body.priority || body.category) {
    await addActivity("updated", oldTask.id, oldTask.title, "Task updated");
  }
  
  return NextResponse.json(tasks[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  let tasks = await getTasks();
  const task = tasks.find((t: any) => t.id === id);
  tasks = tasks.filter((t: any) => t.id !== id);
  await setTasks(tasks);
  
  if (task) {
    await addActivity("deleted", id, task.title, "Task deleted");
  }
  
  return NextResponse.json({ success: true });
}
