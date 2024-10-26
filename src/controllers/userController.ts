import { Request, Response } from "express";
import { v4 as uuidv4, validate as validateUUID } from "uuid";
import { User } from "../common/types";

const users: User[] = [];

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!validateUUID(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { username, age, hobbies } = req.body;
  console.log(req);

  if (!username || !age || !Array.isArray(hobbies)) {
    return res.status(400).json({ message: "Invalid request body" });
  }


  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  if (!validateUUID(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const updatedUser = { ...users[userIndex], username, age, hobbies };
  users[userIndex] = updatedUser;
  res.status(200).json(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!validateUUID(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  users.splice(userIndex, 1);
  res.status(204).send();
};
