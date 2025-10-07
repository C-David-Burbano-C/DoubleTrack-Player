import type { Track } from './types';

export class Node<T> {
  public value: T;
  public next: Node<T> | null;
  public prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  public head: Node<T> | null;
  public tail: Node<T> | null;
  public length: number;

  constructor(initialValues: T[] = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;
    initialValues.forEach((value) => this.append(value));
  }

  append(value: T): Node<T> {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
    return newNode;
  }

  find(callback: (value: T) => boolean): Node<T> | null {
    let currentNode = this.head;
    while (currentNode) {
      if (callback(currentNode.value)) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  toArray(): T[] {
    const array: T[] = [];
    let currentNode = this.head;
    while(currentNode) {
        array.push(currentNode.value);
        currentNode = currentNode.next;
    }
    return array;
  }
}
