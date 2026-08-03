const queue: any[] = [];

export function addTask(task: any) {
  queue.push(task);
}

export function getTasks() {
  return queue;
}