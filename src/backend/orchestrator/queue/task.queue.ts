export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface AITask {
  id: string;
  employeeId: string;
  title: string;
  payload?: any;
  status: TaskStatus;
  createdAt: Date;
}

class TaskQueue {
  private tasks: AITask[] = [];

  addTask(task: AITask) {
    this.tasks.push(task);

    console.log(`✅ Task Added: ${task.title}`);
  }

  getTasks(employeeId?: string) {
    if (!employeeId) return this.tasks;

    return this.tasks.filter(
      task => task.employeeId === employeeId
    );
  }

  updateStatus(taskId: string, status: TaskStatus) {
    const task = this.tasks.find(t => t.id === taskId);

    if (task) {
      task.status = status;
    }
  }

  removeTask(taskId: string) {
    this.tasks = this.tasks.filter(
      task => task.id !== taskId
    );
  }
}

export const taskQueue = new TaskQueue();