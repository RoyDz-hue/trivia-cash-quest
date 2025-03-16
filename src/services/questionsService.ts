
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Question, Category } from '@/types';
import { GeneratedQuestion } from '@/services/deepInfraService';

// Convert generated question format to database format
const formatQuestionForDB = (question: GeneratedQuestion, categoryId: string): Omit<Question, 'id'> => {
  return {
    text: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    timeLimit: 30, // Default time limit
    categoryId: categoryId,
    difficulty: 'medium', // Default difficulty
  };
};

export const questionsService = {
  // Get all questions
  async getQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load questions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestions:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  // Get questions by category
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category_id', categoryId);

      if (error) {
        console.error('Error fetching questions by category:', error);
        toast.error('Failed to load questions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsByCategory:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  // Save a new question
  async saveQuestion(question: Omit<Question, 'id'>): Promise<Question | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select()
        .single();

      if (error) {
        console.error('Error saving question:', error);
        toast.error('Failed to save question');
        return null;
      }

      toast.success('Question saved successfully');
      return data;
    } catch (error) {
      console.error('Error in saveQuestion:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Save multiple questions
  async saveMultipleQuestions(questions: GeneratedQuestion[], categoryId: string): Promise<number> {
    try {
      const formattedQuestions = questions.map(q => formatQuestionForDB(q, categoryId));
      
      const { data, error } = await supabase
        .from('questions')
        .insert(formattedQuestions)
        .select();

      if (error) {
        console.error('Error saving questions:', error);
        toast.error('Failed to save questions');
        return 0;
      }

      toast.success(`${data.length} questions saved successfully`);
      return data.length;
    } catch (error) {
      console.error('Error in saveMultipleQuestions:', error);
      toast.error('An unexpected error occurred');
      return 0;
    }
  },

  // Update a question
  async updateQuestion(id: string, updates: Partial<Question>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating question:', error);
        toast.error('Failed to update question');
        return false;
      }

      toast.success('Question updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateQuestion:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  },

  // Delete a question
  async deleteQuestion(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting question:', error);
        toast.error('Failed to delete question');
        return false;
      }

      toast.success('Question deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteQuestion:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }
};
