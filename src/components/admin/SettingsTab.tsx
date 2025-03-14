
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SettingsTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [payHeroKey, setPayHeroKey] = useState('');

  const saveApiKeys = () => {
    toast.success('API keys saved successfully!');
  };

  return (
    <div className="mt-6 space-y-6">
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
    </div>
  );
};

export default SettingsTab;
