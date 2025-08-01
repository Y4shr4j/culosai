import { Request, Response } from 'express';
import { CategoryModel } from '../models/category';

// Get all categories with optional filtering
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { type, isActive } = req.query;
    let query: any = {};
    
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const categories = await CategoryModel.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ categories });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, description, items } = req.body;
    
    const category = await CategoryModel.create({
      name,
      type,
      description,
      items: items || [],
      createdBy: req.user?._id
    });
    
    res.status(201).json({ 
      message: 'Category created successfully', 
      category 
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, description, items, isActive } = req.body;
    
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (name) category.name = name;
    if (type) category.type = type;
    if (description !== undefined) category.description = description;
    if (items) category.items = items;
    if (typeof isActive === 'boolean') category.isActive = isActive;
    
    await category.save();
    
    res.json({ 
      message: 'Category updated successfully', 
      category 
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await CategoryModel.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// Add item to category
export const addItemToCategory = async (req: Request, res: Response) => {
  try {
    const { name, value, description } = req.body;
    
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.items.push({
      name,
      value,
      description,
      isActive: true
    });
    
    await category.save();
    
    res.json({ 
      message: 'Item added successfully', 
      category 
    });
  } catch (error) {
    console.error('Add item to category error:', error);
    res.status(500).json({ message: 'Error adding item' });
  }
};

// Update item in category
export const updateItemInCategory = async (req: Request, res: Response) => {
  try {
    const { name, value, description, isActive } = req.body;
    const { itemId } = req.params;
    
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const item = category.items.find(item => item._id?.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (name) item.name = name;
    if (value) item.value = value;
    if (description !== undefined) item.description = description;
    if (typeof isActive === 'boolean') item.isActive = isActive;
    
    await category.save();
    
    res.json({ 
      message: 'Item updated successfully', 
      category 
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
};

// Delete item from category
export const deleteItemFromCategory = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.items = category.items.filter(item => item._id?.toString() !== itemId);
    await category.save();
    
    res.json({ 
      message: 'Item deleted successfully', 
      category 
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
}; 