import { Request, Response } from "express";
import { Role } from "../models";

// Create a new role
export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const role = new Role({ name });
    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all roles
export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a role by ID
export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }
    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
