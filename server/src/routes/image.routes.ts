import express from 'express';
import multer from 'multer';
import { 
  uploadImage, 
  getImages, 
  getImageById, 
  unlockImage, 
  updateImage, 
  deleteImage 
} from '../controllers/image.controller';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', getImages);
router.get('/:id', getImageById);

// Protected routes (require authentication)
router.post('/unlock/:id', isAuthenticated, unlockImage);

// Admin routes
router.post(
  '/upload', 
  isAuthenticated, 
  // isAdmin, // Uncomment if you implement this
  upload.single('file'), // <-- changed from 'image' to 'file'
  uploadImage
);

router.put('/:id', isAuthenticated, /* isAdmin, */ updateImage);
router.delete('/:id', isAuthenticated, /* isAdmin, */ deleteImage);

export default router;
