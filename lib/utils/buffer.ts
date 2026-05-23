/**
 * A fixed-size circular buffer for high-performance tracking of events.
 * Optimized for low-spec phones by avoiding array reallocation.
 */
export class CircularBuffer<T> {
  private buffer: (T | undefined)[];
  private pointer: number = 0;
  private currentSize: number = 0;

  constructor(private readonly maxSize: number) {
    if (maxSize <= 0) throw new Error('Buffer size must be greater than 0');
    this.buffer = new Array(maxSize);
  }

  /**
   * Pushes a new value into the buffer.
   * If the buffer is full, the oldest value is overwritten.
   */
  push(value: T): void {
    this.buffer[this.pointer] = value;
    this.pointer = (this.pointer + 1) % this.maxSize;
    if (this.currentSize < this.maxSize) {
      this.currentSize++;
    }
  }

  /**
   * Returns all items in the buffer, ordered from oldest to newest.
   */
  getItems(): T[] {
    const items: T[] = [];
    for (let i = 0; i < this.currentSize; i++) {
      // Calculate the actual index based on current pointer and size
      const index = (this.pointer - this.currentSize + i + this.maxSize) % this.maxSize;
      items.push(this.buffer[index] as T);
    }
    return items;
  }

  /**
   * Returns the number of items currently in the buffer.
   */
  get size(): number {
    return this.currentSize;
  }

  /**
   * Returns the first (oldest) item in the buffer.
   */
  get first(): T | undefined {
    if (this.currentSize === 0) return undefined;
    const index = (this.pointer - this.currentSize + this.maxSize) % this.maxSize;
    return this.buffer[index];
  }

  /**
   * Returns the last (newest) item in the buffer.
   */
  get last(): T | undefined {
    if (this.currentSize === 0) return undefined;
    const index = (this.pointer - 1 + this.maxSize) % this.maxSize;
    return this.buffer[index];
  }

  /**
   * Clears the buffer.
   */
  clear(): void {
    this.buffer = new Array(this.maxSize);
    this.pointer = 0;
    this.currentSize = 0;
  }
}
