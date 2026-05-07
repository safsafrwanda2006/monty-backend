import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProductPrice,
  updateProductName,
  updateProductImage,
  updateProductType,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/create",upload.single("image"), createProduct);
router.put("/price/:id", updateProductPrice);
router.put("/image/:id", updateProductImage);
router.put("/name/:id", updateProductName);
router.put("/type/:id", updateProductType);
router.delete("/:id", deleteProduct);


export default router;
