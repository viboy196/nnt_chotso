export class Node<T> {
  public next: Node<T> | null = null;
  public prev: Node<T> | null = null;
  constructor(public data: T) {}
}

interface ILinkedList<T> {
  insertInBegin(data: T): Node<T>;
  insertAtEnd(data: T): Node<T>;
  deleteNode(node: Node<T>): void;
  traverse(): T[];
  size(): number;
  search(comparator: (data: T) => boolean): Node<T> | null;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null = null;
  constructor(list: T[]) {
    const node = new Node(list[0]);
    this.head = node;
    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        this.insertAtEnd(list[i]);
      }
    }
  }
  insertInBegin(data: T): Node<T> {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }
  insertAtEnd(data: T): Node<T> {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
    } else {
      const getLast = (node: Node<T>): Node<T> => {
        return node.next ? getLast(node.next) : node;
      };
      const lastNode = getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
    }
    return node;
  }

  deleteNode(node: Node<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      prevNode.next = node.next;
    }
  }
  traverse(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }
    const addToArray = (node: Node<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }
  size(): number {
    return this.traverse().length;
  }
  search(comparator: (data: T) => boolean): Node<T> | null {
    const checkNext = (node: Node<T>): Node<T> | null => {
      if (comparator(node.data)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };
    return this.head ? checkNext(this.head) : null;
  }

  insertAfter(prev_node: Node<T>, data: T): Node<T> | null {
    const node = new Node(data);
    const next_prev_node = prev_node.next;
    if (next_prev_node) {
      next_prev_node.prev = node;
    }
    node.next = next_prev_node;
    node.prev = prev_node;
    prev_node.next = node;

    return node;
  }

  insertBefore(before_node: Node<T>, data: T): Node<T> | null {
    const node = new Node(data);
    const prev_before_node = before_node.prev;
    if (prev_before_node) {
      prev_before_node.next = node;
    }
    node.prev = prev_before_node;
    node.next = before_node;
    before_node.prev = node;

    return node;
  }
}
