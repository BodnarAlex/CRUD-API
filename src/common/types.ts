export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type IPCRequest =
  | { type: "GET_ALL", requestId: string }
  | { type: "GET_ONE", id: string, requestId: string }
  | { type: "CREATE", data: any, requestId: string }
  | { type: "UPDATE", id: string, data: any, requestId: string }
  | { type: "DELETE", id: string, requestId: string };

export type IPCResponse =
  | { status: number, payload: any, requestId: string };
