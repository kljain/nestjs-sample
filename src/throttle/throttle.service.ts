import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottleService {
  private activeRequests = new Map<string, number>();
  private queue: Map<string, (() => void)[]> = new Map();
  private lastExecutionTime = new Map<string, number>();

  public async wait(throttleKey: string, throttleDelay = 1000) {
    const now = Date.now();
    const lastExecutionTime = this.lastExecutionTime.get(throttleKey) ?? 0;
    const elapsedTime = now - lastExecutionTime;
    if (
      this.activeRequests.get(throttleKey) >= 1 ||
      elapsedTime < throttleDelay
    ) {
      // If there is already an active request for this throttle key
      // or if the elapsed time is less than the delay between requests,
      // add ourselves to the queue for this throttle key
      if (!this.queue.has(throttleKey)) {
        this.queue.set(throttleKey, []);
      }
      const promise = new Promise<void>((resolve) => {
        this.queue.get(throttleKey)?.push(resolve);
      });
      this.processQueue(throttleKey, throttleDelay);
      await promise;
    }
    this.lastExecutionTime.set(throttleKey, now);
    this.activeRequests.set(
      throttleKey,
      (this.activeRequests.get(throttleKey) ?? 0) + 1,
    );
    const release = () => {
      this.activeRequests.set(
        throttleKey,
        (this.activeRequests.get(throttleKey) ?? 0) - 1,
      );
      this.processQueue(throttleKey, throttleDelay);
    };
    return release;
  }

  private async processQueue(throttleKey: string, throttleDelay: number) {
    while (
      this.activeRequests.get(throttleKey) < 1 &&
      this.queue.get(throttleKey)?.length > 0
    ) {
      const now = Date.now();
      const lastExecutionTime = this.lastExecutionTime.get(throttleKey) ?? 0;
      const elapsedTime = now - lastExecutionTime;
      if (elapsedTime >= throttleDelay) {
        // If the elapsed time is at least the throttleDelay amount, execute the next request
        const next = this.queue.get(throttleKey)?.shift();
        if (next) {
          this.lastExecutionTime.set(throttleKey, now);
          next();
        }
      } else {
        // If the elapsed time is less than the throttleDelay amount, wait before checking again
        const waitTime = throttleDelay - elapsedTime;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
  public getQueueLength(throttleKey: string): number {
    const queueLength = this.queue.get(throttleKey)?.length;
    return queueLength ?? 0;
  }
}
