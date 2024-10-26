import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

export default router;