import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/create",upload.single("image"), createProduct);
router.put("/update/:id",upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);


export default router;
