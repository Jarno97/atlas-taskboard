import { createClient } from "redis";

let redis: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (redis) return redis;
  
  redis = createClient({
    url: process.env.REDIS_URL || "redis://default:P2Q1XmboSQVYACJ0amyaiWqs7ffzAAK8@redis-14675.c14.us-east-1-2.ec2.cloud.redislabs.com:14675"
  });
  
  redis.on("error", (err) => console.error("Redis error:", err));
  
  await redis.connect();
  return redis;
}

const TASK_KEY = "tasks";
const ACTIVITY_KEY = "activity";

export async function getTasks() {
  const client = await getRedisClient();
  const tasks = await client.get(TASK_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

export async function setTasks(tasks: any[]) {
  const client = await getRedisClient();
  await client.set(TASK_KEY, JSON.stringify(tasks));
}

export async function getActivity() {
  const client = await getRedisClient();
  const activity = await client.get(ACTIVITY_KEY);
  return activity ? JSON.parse(activity) : [];
}

export async function addActivity(action: string, taskId: string, taskTitle: string, details: string) {
  const client = await getRedisClient();
  const activity = await getActivity();
  
  activity.unshift({
    id: Date.now().toString(),
    action,
    taskId,
    taskTitle,
    details,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 50
  if (activity.length > 50) activity.pop();
  
  await client.set(ACTIVITY_KEY, JSON.stringify(activity));
}
