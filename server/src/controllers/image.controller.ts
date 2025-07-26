import { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ImageModel, IImage } from '../models/image';
import { uploadToS3, deleteFromS3 } from '../utils/s3';
import { UserModel } from '../models/user';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const { title, description, category, tags, isBlurred, blurIntensity } = req.body;

    // Upload to S3
    const fileUrl = await uploadToS3({
      originalname,
      mimetype,
      buffer,
      size
    }, 'images');

    // Create image record
    const image = new ImageModel({
      url: fileUrl,
      title: title || originalname,
      description,
      category,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      isBlurred: isBlurred ? isBlurred === 'true' : true,
      blurIntensity: blurIntensity ? parseInt(blurIntensity) : 80,
      uploadedBy: req.user._id,
      width: 0, // You might want to extract this from the image
      height: 0, // You might want to extract this from the image
      size,
      mimeType: mimetype,
      unlockPrice: 1 // Default to 1 token per image
    });

    await image.save();
    
    res.status(201).json(image);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, category, search, blurOnly } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (blurOnly === 'true') {
      query.isBlurred = true;
    }
    
    const images = await ImageModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('uploadedBy', 'name username');
    
    const total = await ImageModel.countDocuments(query);
    
    // For each image, check if the current user has unlocked it
    const imagesWithUnlockStatus = await Promise.all(images.map(async (image: IImage) => {
      const imageObj = image.toObject();
      
      if (req.user) {
        const user = await UserModel.findById(req.user._id);
        if (user) {
          const isUnlocked = user.unlockedImages.some(
            (unlocked) => unlocked.imageId.toString() === image._id.toString()
          );
          imageObj.isUnlocked = isUnlocked;
        }
      }
      
      return imageObj;
    }));
    
    res.json({
      images: imagesWithUnlockStatus,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
};

export const getImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = await ImageModel.findById(id).populate('uploadedBy', 'name username');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const imageObj = image.toObject();
    
    // Check if the current user has unlocked this image
    if (req.user) {
      const user = await UserModel.findById(req.user._id);
      if (user) {
        const isUnlocked = user.unlockedImages.some(
          (unlocked) => unlocked.imageId.toString() === image._id.toString()
        );
        imageObj.isUnlocked = isUnlocked;
      }
    }
    
    res.json(imageObj);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Error fetching image' });
  }
};

export const unlockImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const image = await ImageModel.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already unlocked
    const alreadyUnlocked = user.unlockedImages.some(
      (unlocked) => unlocked.imageId.toString() === id
    );
    
    if (alreadyUnlocked) {
      return res.status(400).json({ message: 'Image already unlocked' });
    }
    
    // Check if user has enough tokens
    if (user.tokens < image.unlockPrice) {
      return res.status(400).json({ 
        message: 'Not enough tokens',
        required: image.unlockPrice,
        available: user.tokens
      });
    }
    
    // Deduct tokens
    user.tokens -= image.unlockPrice;
    
    // Add to unlocked images
    user.unlockedImages.push({
      imageId: image._id,
      unlockedAt: new Date()
    });
    
    // Increment unlock count on image
    image.unlockCount += 1;
    
    // Save changes
    await Promise.all([user.save(), image.save()]);
    
    // Create transaction record
    // Note: You might want to create a transaction record here
    
    res.json({ 
      message: 'Image unlocked successfully',
      tokensRemaining: user.tokens,
      image: image.toObject()
    });
  } catch (error) {
    console.error('Unlock image error:', error);
    res.status(500).json({ message: 'Error unlocking image' });
  }
};

export const updateImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, isBlurred, blurIntensity, unlockPrice } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const image = await ImageModel.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user is admin or the uploader
    if (!req.user.isAdmin && image.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;
    if (category !== undefined) image.category = category;
    if (tags !== undefined) image.tags = Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim());
    if (isBlurred !== undefined) image.isBlurred = isBlurred === 'true' || isBlurred === true;
    if (blurIntensity !== undefined) image.blurIntensity = parseInt(blurIntensity);
    if (unlockPrice !== undefined && req.user.isAdmin) image.unlockPrice = parseFloat(unlockPrice);
    
    await image.save();
    
    res.json(image);
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ message: 'Error updating image' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const image = await ImageModel.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user is admin or the uploader
    if (!req.user.isAdmin && image.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete from S3
    await deleteFromS3(image.url);
    
    // Delete the record
    await image.remove();
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
};
