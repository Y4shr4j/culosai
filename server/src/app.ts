import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { UserModel, IUser } from "./models/user";
import cookieParser from "cookie-parser";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import session from "cookie-session";
import passport from "./config/auth";
import authRoutes from "./routes/auth.routes";
import imageRoutes from './routes/image.routes';

// Add MulterRequest interface for type safety
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Load env
dotenv.config();

// Init app
const app = express();

app.use(cors({
  origin: "http://localhost:8080", // Use your frontend's URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration for OAuth
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET || 'fallback-session-secret'],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDB();

// Use auth routes
app.use("/api/auth", authRoutes);
app.use('/api/images', imageRoutes);

// Add direct callback routes for OAuth (in case Google redirects to /auth instead of /api/auth)
app.get("/auth/google/callback", passport.authenticate('google', { 
  failureRedirect: '/login',
  session: false 
}), (req, res) => {
  // Import the socialAuthCallback function
  const { socialAuthCallback } = require('./controllers/auth.controller');
  socialAuthCallback(req, res);
});

app.get("/auth/facebook/callback", passport.authenticate('facebook', { 
  failureRedirect: '/login',
  session: false 
}), (req, res) => {
  // Import the socialAuthCallback function
  const { socialAuthCallback } = require('./controllers/auth.controller');
  socialAuthCallback(req, res);
});

// JWT generator
const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-jwt-secret';
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Check for token in cookies first, then in Authorization header
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-jwt-secret';
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running!");
});

// Register
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const usernameExists = await UserModel.findOne({ username });
  if (usernameExists) return res.status(400).json({ message: "Username already taken" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name,
    username,
    email,
    password: hashedPassword,
    tokens: 0,
  });

  await newUser.save();
  res.status(201).json({ token: generateToken(String(newUser._id)), user: newUser });
});

// Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.password) {
    return res.status(400).json({ message: "User password not set" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  const token = generateToken(String(user._id));
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or "strict"
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        tokens: user.tokens,
      },
    });
});

// Profile
app.get("/api/auth/me", authMiddleware, (req: Request, res: Response) => {
  res.json((req as any).user);
});

// Get Tokens
app.get("/api/auth/tokens", authMiddleware, (req: Request, res: Response) => {
  res.json({ tokens: (req as any).user.tokens });
});

// Add Tokens
app.post("/api/auth/tokens/add", authMiddleware, async (req: Request, res: Response) => {
  const { amount } = req.body;
  const user = (req as any).user;

  user.tokens += amount;
  await user.save();

  res.json({ tokens: user.tokens });
});

// Use Tokens
app.post("/api/auth/tokens/use", authMiddleware, async (req: Request, res: Response) => {
  const { amount } = req.body;
  const user = (req as any).user;

  if (user.tokens < amount) {
    return res.status(400).json({ message: "Not enough tokens" });
  }

  user.tokens -= amount;
  await user.save();

  res.json({ tokens: user.tokens });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

// Generate Image
app.post("/api/generate", authMiddleware, async (req, res) => {
  try {
    const { prompt, aspectRatio, category, type } = req.body;
    const user = (req as any).user;

    // 1. Check tokens
    if (user.tokens < 1) {
      return res.status(400).json({ message: "Not enough tokens" });
    }

    // 2. Deduct 1 token
    user.tokens -= 1;
    await user.save();

    // 3. Call Stability AI API
    const apiKey = process.env.STABILITY_API_KEY || "sk-YCIPirgXVCGX78tvpT4o7DHA81UgxXg5f5XqAtUt6KCCwR2k";
    if (!apiKey) {
      return res.status(500).json({ message: "Stability API key not set" });
    }

    // Determine width/height from aspectRatio
    let width = 1024;
    let height = 1024;
    if (aspectRatio) {
      if (aspectRatio === "2:3") {
        width = 832; height = 1216;
      } else if (aspectRatio === "3:2") {
        width = 1216; height = 832;
      } else if (aspectRatio === "3:4") {
        width = 896; height = 1152;
      } else if (aspectRatio === "4:3") {
        width = 1152; height = 896;
      } else if (aspectRatio === "1:1") {
        width = 1024; height = 1024;
      } else if (aspectRatio === "16:9") {
        width = 1344; height = 768;
      } else if (aspectRatio === "9:16") {
        width = 768; height = 1344;
      }
    }

    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height,
        width,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const base64 = response.data.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error((err as any)?.response?.data || err);
    res.status(500).json({ message: "Failed to generate image" });
  }
});

// Generate Video
const upload = multer();
app.post(
  "/api/generate-video",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.tokens < 1) {
        return res.status(400).json({ message: "Not enough tokens" });
      }
      user.tokens -= 1;
      await user.save();

      let imageBuffer: Buffer | null = null;
      let imageName = "uploaded.png";

      if (req.file) {
        imageBuffer = req.file.buffer;
        imageName = req.file.originalname;
      } else if (req.body.prompt) {
        // Generate image from prompt (force supported dimension: 1024x576)
        const apiKey = process.env.STABILITY_API_KEY || "sk-YCIPirgXVCGX78tvpT4o7DHA81UgxXg5f5XqAtUt6KCCwR2k";
        const imgRes = await axios.post(
          "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
          {
            text_prompts: [{ text: req.body.prompt }],
            cfg_scale: 7,
            height: 576, // <-- use 576 or 1024 or 768
            width: 1024, // <-- use 1024 or 576 or 768
            samples: 1,
            steps: 30,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const base64 = imgRes.data.artifacts[0].base64;
        imageBuffer = Buffer.from(base64, "base64");
        imageName = "generated.png";
      } else {
        return res.status(400).json({ message: "No image file or prompt provided" });
      }

      const apiKey = process.env.STABILITY_API_KEY || "sk-YCIPirgXVCGX78tvpT4o7DHA81UgxXg5f5XqAtUt6KCCwR2k";
      const form = new FormData();
      form.append("image", imageBuffer, { filename: imageName });
      form.append("model", "stable-video-alpha-256x256");
      form.append("output_format", "mp4");
      const headers = {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      };
      const startRes = await axios.post(
        "https://api.stability.ai/v2beta/image-to-video",
        form,
        { headers }
      );
      const generationId = startRes.data.id;
      let videoUrl = null;
      for (let i = 0; i < 60; i++) { // try for up to 60 seconds
        await new Promise((r) => setTimeout(r, 1000));
        const pollRes = await axios.get(
          `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`,
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        console.log('Polling status:', pollRes.data); // <-- Add this line
        if (pollRes.data.status === "succeeded") {
          if (pollRes.data.video_url) {
            videoUrl = pollRes.data.video_url;
            break;
          } else if (pollRes.data.video) {
            // Return base64 video as a data URL
            videoUrl = `data:video/mp4;base64,${pollRes.data.video}`;
            break;
          }
        }
        if (pollRes.data.status === "failed") {
          return res
            .status(500)
            .json({ message: "Video generation failed", error: pollRes.data });
        }
      }
      if (!videoUrl) {
        return res
          .status(500)
          .json({ message: "Failed to generate video: No video URL returned" });
      }
      res.json({ videoUrl });
    } catch (err) {
      const errorData = (err as any)?.response?.data || err;
      console.error(errorData);
      res
        .status(500)
        .json({ message: "Failed to generate video", error: JSON.stringify(errorData) });
    }
  }
);

// Start server after DB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
