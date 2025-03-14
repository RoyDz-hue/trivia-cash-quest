
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { Category } from '@/types';

interface GamesTabProps {
  categories: Category[];
  setSelectedCategory: (category: string) => void;
  handleGenerateQuestions: () => Promise<void>;
}

const GamesTab: React.FC<GamesTabProps> = ({ 
  categories, 
  setSelectedCategory,
  handleGenerateQuestions 
}) => {
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Categories</CardTitle>
          <CardDescription>
            Manage your game categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button className="flex items-center gap-1 bg-trivia-primary hover:bg-trivia-primary/90">
              <Plus size={16} />
              <span>Add Category</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card key={category.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {category.name} <span>{category.icon}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry Fee:</span>
                      <p className="font-medium">Ksh. {category.entryFee}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Players:</span>
                      <p className="font-medium">{category.minPlayers}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        handleGenerateQuestions();
                      }}
                    >
                      <Database size={14} />
                      <span>Generate Questions</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamesTab;
