
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { Category } from '@/types';
import { GeneratedQuestion } from '@/services/deepInfraService';

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
              <div className="p-3 bg-muted font-medium">Generated Questions</div>
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">Question {index + 1}:</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" className="bg-trivia-primary hover:bg-trivia-primary/90">
                        Save to Database
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
              />
              <Button variant="outline" size="sm">Search</Button>
            </div>
            <Button className="flex items-center gap-1 bg-trivia-primary hover:bg-trivia-primary/90">
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
              <div className="grid grid-cols-5 p-3">
                <div className="col-span-2 truncate pr-4">What is the largest stock exchange in the world by market capitalization?</div>
                <div>Finance 🏦</div>
                <div className="text-green-600">Active</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-5 p-3">
                <div className="col-span-2 truncate pr-4">Which cryptocurrency was the first to implement smart contracts?</div>
                <div>Crypto 💰</div>
                <div className="text-green-600">Active</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-5 p-3">
                <div className="col-span-2 truncate pr-4">Who is the current Cabinet Secretary for Treasury in Kenya?</div>
                <div>Politics 🏛️</div>
                <div className="text-green-600">Active</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsTab;
