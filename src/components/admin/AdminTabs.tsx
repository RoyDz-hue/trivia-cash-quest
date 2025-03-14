
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Users, Award, Settings, Send, CreditCard } from 'lucide-react';
import DashboardTab from './DashboardTab';
import QuestionsTab from './QuestionsTab';
import UsersTab from './UsersTab';
import GamesTab from './GamesTab';
import PaymentsTab from './PaymentsTab';
import SettingsTab from './SettingsTab';
import { Category } from '@/types';
import { GeneratedQuestion } from '@/services/deepInfraService';

interface AdminTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  categories: Category[];
  generatedQuestions: GeneratedQuestion[];
  isGenerating: boolean;
  handleGenerateQuestions: () => Promise<void>;
  formatQuestionText: (question: GeneratedQuestion) => string;
  mockUsers: any[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  selectedCategory,
  setSelectedCategory,
  questionCount,
  setQuestionCount,
  categories,
  generatedQuestions,
  isGenerating,
  handleGenerateQuestions,
  formatQuestionText,
  mockUsers
}) => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart size={16} />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex items-center gap-2">
          <Send size={16} />
          <span>Questions</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users size={16} />
          <span>Users</span>
        </TabsTrigger>
        <TabsTrigger value="games" className="flex items-center gap-2">
          <Award size={16} />
          <span>Games</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard size={16} />
          <span>Payments</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings size={16} />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <DashboardTab />
      </TabsContent>
      
      <TabsContent value="questions">
        <QuestionsTab
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          categories={categories}
          generatedQuestions={generatedQuestions}
          isGenerating={isGenerating}
          handleGenerateQuestions={handleGenerateQuestions}
          formatQuestionText={formatQuestionText}
        />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersTab users={mockUsers} />
      </TabsContent>
      
      <TabsContent value="games">
        <GamesTab 
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          handleGenerateQuestions={handleGenerateQuestions}
        />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
