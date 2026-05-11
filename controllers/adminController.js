import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const createAdmin = async (req, res) => {
  try {
    const { admin_name, email, password, admin_role } = req.body;

    // check if the email exists
    const checkUser = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email],
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "This admin alredy exists" });
    }

    // hashing the password
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO admins (admin_name,email,password,admin_role) VALUES ($1,$2,$3,$4) RETURNING *",
      [admin_name, email, hash, admin_role],
    );

    const newAdmin = result.rows[0];

    const token = generateToken(newAdmin.admin_id);

    res.json({
      status: "success",
      user: newAdmin,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "server error",err})
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM admins WHERE email = $1", [
    email,
  ]);
  // checking if the admin exists
  if (user.rows.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  // storign the admin data
  const admin = user.rows[0];

  // verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  // Generate the JWT Token
  const token = generateToken(admin);

  // returing success response
  res.status(201).json({
    status: "success",
    user: admin,
    token: token,
  });
};

export const getAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM admins'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({error: "Getting users errors"})
  }
};
export const deleteAdmin = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await pool.query(
      'DELETE FROM admins WHERE admin_id=$1',
      [id]
    )
    res.json({message: "user deleted"})
  } catch (err) {
    res.status(500).json({error: "Deleting user Error"})
  }
};
