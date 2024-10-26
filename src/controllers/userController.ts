import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4, validate as validateUUID } from "uuid";
import { User } from "../common/types";

const users: User[] = [];

const parseJSON = async (req: IncomingMessage): Promise<any> => {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }
  return JSON.parse(body);
};

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(users));
};

export const getUserById = (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url;
  console.log("userId", req.url);

  if (!userId || !validateUUID(userId)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Invalid user ID" }));
    return;
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "User not found" }));
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(user));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { username, age, hobbies } = await parseJSON(req);

    if (!username || !age || !Array.isArray(hobbies)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Invalid request body" }));
      return;
    }

    const newUser: User = { id: uuidv4(), username, age, hobbies };
    users.push(newUser);
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newUser));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "An internal server error occurred" }));
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url;
  if (!userId || !validateUUID(userId)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Invalid user ID" }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "User not found" }));
    return;
  }

  try {
    const { username, age, hobbies } = await parseJSON(req);
    const updatedUser: User = { ...users[userIndex], username, age, hobbies };
    users[userIndex] = updatedUser;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(updatedUser));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "An internal server error occurred" }));
  }
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url;
  if (!userId || !validateUUID(userId)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Invalid user ID" }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "User not found" }));
    return;
  }

  users.splice(userIndex, 1);
  res.statusCode = 204;
  res.end();
};
