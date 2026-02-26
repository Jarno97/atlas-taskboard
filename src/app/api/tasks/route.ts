import { NextResponse } from "next/server";
import { getTasks, setTasks } from "@/lib/redis";

export async function GET() {
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
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  await setTasks(tasks);
  
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  let tasks = await getTasks();
  
  const index = tasks.findIndex((t: any) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  tasks[index] = {
    ...tasks[index],
    ...body,
    updated: new Date().toISOString(),
  };
  
  await setTasks(tasks);
  return NextResponse.json(tasks[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  let tasks = await getTasks();
  tasks = tasks.filter((t: any) => t.id !== id);
  await setTasks(tasks);
  
  return NextResponse.json({ success: true });
}
