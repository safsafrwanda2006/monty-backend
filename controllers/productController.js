import pool from "../config/db.js";
import supabase from "../config/supabase.js";
import sharp from "sharp";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    console.log("error fetching products", err);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM products WHERE id= $1`, [
      id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.log("error in getting product", err);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, type, instouck, classification, description } =
      req.body;
    const file = req.file;
    if (!file) {
      return res.status(404).json({ message: "image is required" });
    }
    const fileExt = file.originalname.split(".").pop();

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

    const compressedImage = await sharp(file.buffer)
      .resize({width: 800,withoutEnlargement: true})
      .jpeg({quality: 70})
      .toBuffer();

    // Upload to supabase Storage
    const {error}= await supabase.storage
       .from("products")
       .upload(fileName,compressedImage,{
        contentType: file.mimetype,
        cacheControl: "31536000",
       });

       if(error){
        return res.status(500).json({
          message: "storing the image error"
        })
       }
    
    const image = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/products/${fileName}`;


    const result = await pool.query(
      `INSERT INTO products(name,image,price,type,instouck,classification,description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, image, price, type, instouck, classification, description],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error in creating product", err);
    res.status(500).json({ message: "Creating product error" });
  }
};

export const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const result = await pool.query(
      `UPDATE products SET price =$1 WHERE id = $2`,
      [price, id],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error in updating product", err);
  }
};
export const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const result = await pool.query(
      `UPDATE products SET image =$1 WHERE id = $2`,
      [image, id],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error in updating product", err);
  }
};
export const updateProductName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(
      `UPDATE products SET name =$1 WHERE id = $2`,
      [name, id],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error in updating product", err);
  }
};

export const updateProductDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const result = await pool.query(
      `UPDATE products SET description =$1 WHERE id = $2`,
      [description, id],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error in updating product", err);
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const result = await pool.query(
      "UPDATE products SET type = $1 WHERE id = $2",
      [type, id],
    );
  } catch (err) {
    console.log("error in updating the type : ", err);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
    res.json({ message: "deleted successfully" });
  } catch (err) {
    console.log("Error in Deleting ", err);
  }
};
