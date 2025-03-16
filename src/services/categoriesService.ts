
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types';

export const categoriesService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  // Get a single category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching category:', error);
        toast.error('Failed to load category');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Save a new category
  async saveCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) {
        console.error('Error saving category:', error);
        toast.error('Failed to save category');
        return null;
      }

      toast.success('Category saved successfully');
      return data;
    } catch (error) {
      console.error('Error in saveCategory:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Update a category
  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
        return false;
      }

      toast.success('Category updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  },

  // Delete a category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
        return false;
      }

      toast.success('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }
};
