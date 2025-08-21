import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// @route   GET /auth/google
// @desc    Auth with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @route   GET /auth/google/callback
// @desc    Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Create JWT token
    const accessToken = jwt.sign(
      {
        id: req.user._id,
        isAdmin: req.user.isAdmin,
      },
      process.env.JWT_PASSWORD,
      { expiresIn: "3d" }
    );
    
    // Redirect to client with token
    // You might want to modify this to match your frontend URL and method of handling tokens
    const redirectUrl = `${process.env.CLIENT_URL}/auth/success?token=${accessToken}`;
    res.redirect(redirectUrl);
  }
);

export default router;