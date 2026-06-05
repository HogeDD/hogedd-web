import type { Clock, IDGenerator } from "@/app/apps/clean-tasks/_usecases/task-service";

export class SequentialIDGenerator implements IDGenerator {
  private counter = 0;

  constructor(private readonly prefix: string) {}

  async newID(): Promise<string> {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
