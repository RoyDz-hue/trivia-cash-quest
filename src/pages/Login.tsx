
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log('Login component rendered, user:', user?.email, 'isAdmin:', isAdmin, 'isLoading:', isLoading);

  // Handle redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User is logged in, redirecting to:', isAdmin ? '/admin' : '/dashboard');
      
      // Use timeout to ensure state is fully updated before navigation
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('Submitting login form for:', email);
      await login(email, password);
      
      toast.success('Login successful!');
      
      // Wait a moment for the auth state to update before redirection
      setTimeout(() => {
        // Check for admin email to redirect appropriately
        if (email === 'cyntoremix@gmail.com') {
          console.log('Admin login detected, navigating to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Regular user login, navigating to /dashboard');
          navigate('/dashboard', { replace: true });
        }
      }, 500);
    } catch (error: any) {
      console.error('Login form submission error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-trivia-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login to TriviaCash
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm text-trivia-primary hover:text-trivia-secondary">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-trivia-primary to-trivia-secondary hover:from-trivia-primary/90 hover:to-trivia-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">For testing, use: </span>
            <code className="bg-muted p-1 rounded text-xs">admin@example.com</code> / 
            <code className="bg-muted p-1 rounded text-xs">password</code>
            <p className="mt-1">
              <span className="text-muted-foreground">Or for admin access: </span>
              <code className="bg-muted p-1 rounded text-xs">cyntoremix@gmail.com</code>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-trivia-primary hover:text-trivia-secondary">
              Register now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
