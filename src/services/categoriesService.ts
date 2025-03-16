
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from '@/types';

// Type for the database row format
type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  description: string;
  entry_fee: number;
  min_players: number;
  created_at: string;
  updated_at: string;
};

// Convert from database format to our application model
const mapToCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  description: row.description,
  entryFee: row.entry_fee,
  minPlayers: row.min_players
});

// Convert from our application model to database format
const mapToCategoryRow = (category: Omit<Category, 'id'>): Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'> => ({
  name: category.name,
  icon: category.icon,
  description: category.description,
  entry_fee: category.entryFee,
  min_players: category.minPlayers
});

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

      // Map database rows to our Category model
      return (data as CategoryRow[] || []).map(mapToCategory);
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

      return data ? mapToCategory(data as CategoryRow) : null;
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
        .insert(mapToCategoryRow(category))
        .select()
        .single();

      if (error) {
        console.error('Error saving category:', error);
        toast.error('Failed to save category');
        return null;
      }

      toast.success('Category saved successfully');
      return mapToCategory(data as CategoryRow);
    } catch (error) {
      console.error('Error in saveCategory:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Update a category
  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    try {
      // Convert camelCase props to snake_case for the database
      const dbUpdates: Partial<CategoryRow> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.entryFee !== undefined) dbUpdates.entry_fee = updates.entryFee;
      if (updates.minPlayers !== undefined) dbUpdates.min_players = updates.minPlayers;

      const { error } = await supabase
        .from('categories')
        .update(dbUpdates)
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
