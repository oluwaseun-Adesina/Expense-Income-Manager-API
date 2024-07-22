const Category = require('../models/categoryModel');

const categoryController = {
    async createCategory(req, res) {
        try {
            const { name, type } = req.body;
            const category = new Category({
                user_id: req.user.id,
                name,
                type
            });
            await category.save();
            res.status(201).json({ message: 'Category created successfully', data: category });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    async getCategories(req, res) {
        try {
            const categories = await Category.find({ user_id: req.user.id });
            res.status(200).json({ message: 'All categories fetched successfully', data: categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated successfully', data: category });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = categoryController;
