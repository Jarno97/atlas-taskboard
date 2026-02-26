import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "tasks.json");

function readTasks() {
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data).tasks;
}

function writeTasks(tasks: any[]) {
  fs.writeFileSync(dataFile, JSON.stringify({ tasks }, null, 2));
}

export async function GET() {
  const tasks = readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tasks = readTasks();
  
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
  writeTasks(tasks);
  
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const tasks = readTasks();
  
  const index = tasks.findIndex((t: any) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  
  tasks[index] = {
    ...tasks[index],
    ...body,
    updated: new Date().toISOString(),
  };
  
  writeTasks(tasks);
  return NextResponse.json(tasks[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  let tasks = readTasks();
  tasks = tasks.filter((t: any) => t.id !== id);
  writeTasks(tasks);
  
  return NextResponse.json({ success: true });
}
