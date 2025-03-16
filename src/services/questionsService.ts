
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Question, Category } from '@/types';
import { GeneratedQuestion } from '@/services/deepInfraService';
import { Json } from '@/integrations/supabase/types';

// Type for the database row format
type QuestionRow = {
  id: string;
  text: string;
  options: Json;
  correct_answer: number;
  time_limit: number;
  category_id: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
};

// Convert from database format to our application model
const mapToQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  text: row.text,
  // Explicitly convert each option to string to satisfy TypeScript
  options: Array.isArray(row.options) ? row.options.map(opt => String(opt)) : [],
  correctAnswer: row.correct_answer,
  timeLimit: row.time_limit,
  categoryId: row.category_id,
  difficulty: row.difficulty
});

// Convert from our application model to database format
const mapToQuestionRow = (question: Omit<Question, 'id'>): Omit<QuestionRow, 'id' | 'created_at' | 'updated_at'> => ({
  text: question.text,
  options: question.options,
  correct_answer: question.correctAnswer,
  time_limit: question.timeLimit,
  category_id: question.categoryId,
  difficulty: question.difficulty
});

// Convert generated question format to database format
const formatQuestionForDB = (question: GeneratedQuestion, categoryId: string): Omit<QuestionRow, 'id' | 'created_at' | 'updated_at'> => {
  return {
    text: question.question,
    options: question.options,
    correct_answer: question.correctAnswer,
    time_limit: 30, // Default time limit
    category_id: categoryId,
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

      return (data as QuestionRow[] || []).map(mapToQuestion);
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

      return (data as QuestionRow[] || []).map(mapToQuestion);
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
        .insert(mapToQuestionRow(question))
        .select()
        .single();

      if (error) {
        console.error('Error saving question:', error);
        toast.error('Failed to save question');
        return null;
      }

      toast.success('Question saved successfully');
      return mapToQuestion(data as QuestionRow);
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
      // Convert camelCase props to snake_case for the database
      const dbUpdates: Partial<QuestionRow> = {};
      if (updates.text !== undefined) dbUpdates.text = updates.text;
      if (updates.options !== undefined) dbUpdates.options = updates.options;
      if (updates.correctAnswer !== undefined) dbUpdates.correct_answer = updates.correctAnswer;
      if (updates.timeLimit !== undefined) dbUpdates.time_limit = updates.timeLimit;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;

      const { error } = await supabase
        .from('questions')
        .update(dbUpdates)
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
