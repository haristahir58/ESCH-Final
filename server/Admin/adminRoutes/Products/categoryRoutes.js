const express = require('express');
const router = express.Router();
const Category = require('../../model/Products/categorySchema'); // Import the Category model
const Products = require('../../model/Products/productSchema'); // Import the Category model

// Create a new category
router.post('/admin/categories/new', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(422).json({ message: 'Please provide a category name' });
        }

        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all categories
router.get('/admin/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Update a specific category by ID
router.put('/admin/categories/:id', async (req, res) => {
  const categoryId = req.params.id;
  const updatedCategoryData = req.body; // This should contain the updated data

  try {
      // Check if the updated data contains the 'name' property
      if (!updatedCategoryData.name) {
          return res.status(422).json({ message: 'Please provide a category name' });
      }

      const updatedCategory = await Category.findOneAndUpdate(
          { _id: categoryId },
          { $set: updatedCategoryData },
          { new: true } // To return the updated category
      );

      if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }

      res.json(updatedCategory);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
});



// Delete a specific category by ID
router.delete('/admin/categories/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
      const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

      if (!deletedCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
});




// Get a specific category by ID and populate its associated products
router.get('/admin/categories/:id', async (req, res) => {
    try {
      const categoryId = req.params.id;
      
      // Find the category by ID and populate its 'products' field
      const category = await Category.findById(categoryId).populate('products');
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

module.exports = router;
