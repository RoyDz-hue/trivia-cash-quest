
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/types';
import { toast } from 'sonner';
import { GenerateQuestionParams, GeneratedQuestion } from '@/services/deepInfraService';
import AdminTabs from '@/components/admin/AdminTabs';

const Admin = () => {
  const { user, isAdmin, deepInfraService } = useAuth();
  const navigate = useNavigate();
  const [generateQuestionPrompt, setGenerateQuestionPrompt] = useState('Generate a multiple-choice trivia question about finance with 4 answer options, one correct and three misleading but realistic.');
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [payHeroKey, setPayHeroKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Finance');
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      toast.error('You do not have permission to access the admin dashboard');
    }
  }, [isAdmin, navigate]);

  const categories: Category[] = [
    {
      id: '1',
      name: 'Finance',
      icon: '🏦',
      description: 'Test your knowledge of financial concepts, markets, and economics.',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '2',
      name: 'Crypto',
      icon: '💰',
      description: 'How much do you know about cryptocurrencies, blockchain, and the digital economy?',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '3',
      name: 'Politics',
      icon: '🏛️',
      description: 'Test your knowledge of local and global politics, governments, and policies.',
      entryFee: 20,
      minPlayers: 5,
    },
  ];

  const mockUsers = [
    { id: '1', username: 'user1', email: 'user1@example.com', phoneNumber: '+254700000001', status: 'active' },
    { id: '2', username: 'user2', email: 'user2@example.com', phoneNumber: '+254700000002', status: 'active' },
    { id: '3', username: 'user3', email: 'user3@example.com', phoneNumber: '+254700000003', status: 'flagged' },
    { id: '4', username: 'user4', email: 'user4@example.com', phoneNumber: '+254700000004', status: 'active' },
  ];

  const handleGenerateQuestions = async () => {
    if (!deepInfraService) {
      toast.error('DeepInfra service is not initialized');
      return;
    }

    setIsGenerating(true);
    try {
      const params: GenerateQuestionParams = {
        category: selectedCategory,
        difficulty: 'medium',
        count: questionCount
      };

      const questions = await deepInfraService.generateMultipleQuestions(params);
      
      if (questions && questions.length > 0) {
        setGeneratedQuestions(questions);
        toast.success(`${questions.length} questions generated successfully!`);
      } else {
        toast.error('Failed to generate properly formatted questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatQuestionText = (question: GeneratedQuestion) => {
    return `Question: ${question.question}\n\nA) ${question.options[0]}\nB) ${question.options[1]}\nC) ${question.options[2]}\nD) ${question.options[3]}\n\nCorrect Answer: ${['A', 'B', 'C', 'D'][question.correctAnswer]}`;
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        categories={categories}
        generatedQuestions={generatedQuestions}
        isGenerating={isGenerating}
        handleGenerateQuestions={handleGenerateQuestions}
        formatQuestionText={formatQuestionText}
        mockUsers={mockUsers}
      />
    </Layout>
  );
};

export default Admin;
