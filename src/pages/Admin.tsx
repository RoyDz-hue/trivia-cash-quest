import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, Award, Settings, Send, Plus, Database, XCircle } from 'lucide-react';
import { Category, Question } from '@/types';
import { toast } from 'sonner';
import { GenerateQuestionParams } from '@/services/deepInfraService';

const Admin = () => {
  const { user, isAdmin, deepInfraService } = useAuth();
  const navigate = useNavigate();
  const [generateQuestionPrompt, setGenerateQuestionPrompt] = useState('Generate a multiple-choice trivia question about finance with 4 answer options, one correct and three misleading but realistic.');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [payHeroKey, setPayHeroKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Finance');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      toast.error('You do not have permission to access the admin dashboard');
    }
  }, [isAdmin, navigate]);

  // Mock categories for the demo
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

  // Mock user data
  const mockUsers = [
    { id: '1', username: 'user1', email: 'user1@example.com', phoneNumber: '+254700000001', status: 'active' },
    { id: '2', username: 'user2', email: 'user2@example.com', phoneNumber: '+254700000002', status: 'active' },
    { id: '3', username: 'user3', email: 'user3@example.com', phoneNumber: '+254700000003', status: 'flagged' },
    { id: '4', username: 'user4', email: 'user4@example.com', phoneNumber: '+254700000004', status: 'active' },
  ];

  const handleGenerateQuestion = async () => {
    if (!deepInfraService) {
      toast.error('DeepInfra service is not initialized');
      return;
    }

    setIsGenerating(true);
    try {
      const params: GenerateQuestionParams = {
        category: selectedCategory,
        difficulty: 'medium',
      };

      const question = await deepInfraService.generateTrivaQuestion(params);
      
      if (question) {
        const formattedQuestion = `Question: ${question.question}\n\nA) ${question.options[0]}\nB) ${question.options[1]}\nC) ${question.options[2]}\nD) ${question.options[3]}\n\nCorrect Answer: ${['A', 'B', 'C', 'D'][question.correctAnswer]}`;
        setGeneratedQuestion(formattedQuestion);
        toast.success('Question generated successfully!');
      } else {
        toast.error('Failed to generate a properly formatted question');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      toast.error('Failed to generate question. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveApiKeys = () => {
    toast.success('API keys saved successfully!');
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">256</div>
                <p className="text-xs text-trivia-muted mt-1">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Ksh. 27,500</div>
                <p className="text-xs text-trivia-muted mt-1">+5% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">432</div>
                <p className="text-xs text-trivia-muted mt-1">+23% from last week</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Overview of the most recent payments and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                  <div>Type</div>
                  <div>User</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-5 p-3">
                    <div>Deposit</div>
                    <div>user1</div>
                    <div>Ksh. 100</div>
                    <div className="text-green-600">Completed</div>
                    <div>Today, 10:30 AM</div>
                  </div>
                  <div className="grid grid-cols-5 p-3">
                    <div>Withdrawal</div>
                    <div>user2</div>
                    <div>Ksh. 250</div>
                    <div className="text-green-600">Completed</div>
                    <div>Today, 9:15 AM</div>
                  </div>
                  <div className="grid grid-cols-5 p-3">
                    <div>Game Entry</div>
                    <div>user3</div>
                    <div>Ksh. 20</div>
                    <div className="text-green-600">Completed</div>
                    <div>Yesterday, 7:22 PM</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Question Generator</CardTitle>
              <CardDescription>
                Generate trivia questions using the DeepInfra API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <Button 
                onClick={handleGenerateQuestion}
                disabled={isGenerating}
                className="bg-trivia-primary hover:bg-trivia-primary/90"
              >
                {isGenerating ? 'Generating...' : 'Generate Question'}
              </Button>
              
              {generatedQuestion && (
                <div className="bg-muted p-4 rounded-md whitespace-pre-line mt-4">
                  <h3 className="font-medium mb-2">Generated Question:</h3>
                  <div className="text-sm">{generatedQuestion}</div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" className="bg-trivia-primary hover:bg-trivia-primary/90">
                      Save to Database
                    </Button>
                  </div>
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
        </TabsContent>
        
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Browse and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search users..." 
                    className="w-64" 
                  />
                  <Button variant="outline" size="sm">Search</Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                  <div>Username</div>
                  <div>Email</div>
                  <div>Phone</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {mockUsers.map(user => (
                    <div key={user.id} className="grid grid-cols-5 p-3">
                      <div>{user.username}</div>
                      <div>{user.email}</div>
                      <div>{user.phoneNumber}</div>
                      <div className={user.status === 'flagged' ? 'text-amber-600' : 'text-green-600'}>
                        {user.status === 'flagged' ? 'Flagged' : 'Active'}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        {user.status === 'flagged' && (
                          <Button variant="outline" size="sm" className="text-red-500">
                            <XCircle size={16} className="mr-1" />
                            <span>Ban</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="games" className="mt-6 space-y-6">
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
                            handleGenerateQuestion();
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
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configurations</CardTitle>
              <CardDescription>
                Configure your API keys for DeepInfra and PayHero
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deepinfra">DeepInfra API Key</Label>
                <Input 
                  id="deepinfra" 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="3ZJE3fsTlDv1pLKVtfdNQbRPvwhmfHfF"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payhero">PayHero API Key</Label>
                <Input 
                  id="payhero" 
                  type="password"
                  value={payHeroKey}
                  onChange={(e) => setPayHeroKey(e.target.value)}
                  placeholder="Enter your PayHero API key"
                />
              </div>
              
              <Button 
                onClick={saveApiKeys}
                className="bg-trivia-primary hover:bg-trivia-primary/90"
              >
                Save API Keys
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
              <CardDescription>
                Configure global game settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionTime">Question Time (seconds)</Label>
                  <Input 
                    id="questionTime" 
                    type="number"
                    defaultValue={30}
                    placeholder="Enter time in seconds"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionsPerGame">Questions Per Game</Label>
                  <Input 
                    id="questionsPerGame" 
                    type="number"
                    defaultValue={10}
                    placeholder="Enter number of questions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultEntryFee">Default Entry Fee (KSH)</Label>
                  <Input 
                    id="defaultEntryFee" 
                    type="number"
                    defaultValue={20}
                    placeholder="Enter default entry fee"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minPlayers">Minimum Players</Label>
                  <Input 
                    id="minPlayers" 
                    type="number"
                    defaultValue={5}
                    placeholder="Enter minimum players"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstPlacePercentage">1st Place Prize (%)</Label>
                  <Input 
                    id="firstPlacePercentage" 
                    type="number"
                    defaultValue={50}
                    placeholder="Enter percentage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondPlacePercentage">2nd Place Prize (%)</Label>
                  <Input 
                    id="secondPlacePercentage" 
                    type="number"
                    defaultValue={30}
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
              
              <Button className="bg-trivia-primary hover:bg-trivia-primary/90">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Admin;
