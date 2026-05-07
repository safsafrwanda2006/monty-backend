import express from "express";
import {
  adminLogin,
  createAdmin,
  deleteAdmin,
  getAdmins,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", createAdmin);
router.post("/login", adminLogin);
router.get("/list", getAdmins);
router.delete("/delete/:id", deleteAdmin);

export default router;
