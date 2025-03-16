
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { Category, Question } from '@/types';
import { GeneratedQuestion } from '@/services/deepInfraService';
import { questionsService } from '@/services/questionsService';
import { categoriesService } from '@/services/categoriesService';
import { toast } from 'sonner';

interface QuestionsTabProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  categories: Category[];
  generatedQuestions: GeneratedQuestion[];
  isGenerating: boolean;
  handleGenerateQuestions: () => Promise<void>;
  formatQuestionText: (question: GeneratedQuestion) => string;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({
  selectedCategory,
  setSelectedCategory,
  questionCount,
  setQuestionCount,
  categories,
  generatedQuestions,
  isGenerating,
  handleGenerateQuestions,
  formatQuestionText
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionsService.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const success = await questionsService.deleteQuestion(id);
      if (success) {
        setQuestions(questions.filter(q => q.id !== id));
      }
    }
  };

  const handleSaveToDatabase = async (question: GeneratedQuestion) => {
    // Find category ID from name
    const category = categories.find(c => c.name === selectedCategory);
    if (!category) {
      toast.error('Category not found');
      return;
    }

    setIsSaving(true);
    try {
      const formattedQuestion = {
        text: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        timeLimit: 30,
        categoryId: category.id,
        difficulty: 'medium'
      };

      const savedQuestion = await questionsService.saveQuestion(formattedQuestion);
      if (savedQuestion) {
        setQuestions([savedQuestion, ...questions]);
      }
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllQuestions = async () => {
    if (generatedQuestions.length === 0) return;
    
    // Find category ID from name
    const category = categories.find(c => c.name === selectedCategory);
    if (!category) {
      toast.error('Category not found');
      return;
    }

    setIsSaving(true);
    try {
      const saveCount = await questionsService.saveMultipleQuestions(generatedQuestions, category.id);
      if (saveCount > 0) {
        await fetchQuestions(); // Refresh the questions list
      }
    } catch (error) {
      console.error('Error saving questions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Question Generator</CardTitle>
          <CardDescription>
            Generate multiple trivia questions using the DeepInfra API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category"
                className="w-full px-3 py-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name} {category.icon}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input 
                id="questionCount" 
                type="number" 
                min="1" 
                max="20" 
                value={questionCount} 
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="bg-trivia-primary hover:bg-trivia-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              `Generate ${questionCount} Questions`
            )}
          </Button>
          
          {generatedQuestions.length > 0 && (
            <div className="mt-4 border rounded-md divide-y">
              <div className="p-3 bg-muted font-medium flex items-center justify-between">
                <span>Generated Questions</span>
                {generatedQuestions.length > 1 && (
                  <Button 
                    onClick={handleSaveAllQuestions}
                    disabled={isSaving}
                    size="sm" 
                    className="bg-trivia-primary hover:bg-trivia-primary/90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="mr-1 animate-spin" />
                        Saving All...
                      </>
                    ) : (
                      <>
                        <Save size={14} className="mr-1" />
                        Save All Questions
                      </>
                    )}
                  </Button>
                )}
              </div>
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">Question {index + 1}:</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.info('Edit functionality will be implemented soon')}
                      >
                        <Pencil size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-trivia-primary hover:bg-trivia-primary/90"
                        onClick={() => handleSaveToDatabase(question)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={14} className="mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={14} className="mr-1" />
                            Save to Database
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-md whitespace-pre-line text-sm">
                    {formatQuestionText(question)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Question Library</CardTitle>
          <CardDescription>
            Browse and manage your collection of trivia questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search questions..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="sm">Search</Button>
            </div>
            <Button className="flex items-center gap-1 bg-trivia-primary hover:bg-trivia-primary/90"
              onClick={() => toast.info('Add question functionality will be implemented soon')}
            >
              <Plus size={16} />
              <span>Add Question</span>
            </Button>
          </div>
          
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-3 font-medium">
              <div className="col-span-2">Question</div>
              <div>Category</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>Loading questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery ? 'No questions match your search' : 'No questions found. Generate some!'}
                </div>
              ) : (
                filteredQuestions.map(question => (
                  <div key={question.id} className="grid grid-cols-5 p-3">
                    <div className="col-span-2 truncate pr-4">{question.text}</div>
                    <div>{question.categoryId}</div>
                    <div className="text-green-600">Active</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info('Edit functionality will be implemented soon')}
                      >
                        <Pencil size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsTab;
