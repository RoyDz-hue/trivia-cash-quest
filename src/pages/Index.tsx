
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, DollarSign, Clock, Award, ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-hero-pattern py-16 md:py-28">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Win Real Cash by Answering Trivia
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-2xl">
            Just Ksh. 20 to start. Test your knowledge, compete with others, and win instant payouts to M-Pesa/Airtel Money!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-trivia-primary hover:bg-opacity-90 hover:text-trivia-secondary">
                  Go to Dashboard <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-trivia-primary hover:bg-opacity-90 hover:text-trivia-secondary">
                    Register Now <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-trivia-primary">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-trivia-text">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-trivia-background rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-trivia-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-trivia-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Register</h3>
              <p className="text-trivia-muted">Create an account with your phone number, username, and email to get started.</p>
            </div>
            <div className="bg-trivia-background rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-trivia-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-trivia-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Join a Trivia Game</h3>
              <p className="text-trivia-muted">Pay Ksh. 20 to join a game in your favorite category and test your knowledge.</p>
            </div>
            <div className="bg-trivia-background rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-trivia-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-trivia-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Win Cash</h3>
              <p className="text-trivia-muted">Answer correctly and quickly to climb the leaderboard and win real cash prizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16 bg-trivia-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-trivia-text">Play in Various Topics</h2>
          <p className="text-center text-trivia-muted mb-12 max-w-2xl mx-auto">Challenge yourself with trivia in different categories and showcase your knowledge</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Finance 🏦', 'Crypto 💰', 'Politics 🏛️', 'Education 📚', 'Sports ⚽', 'Business 📈', 'Elections 🗳️', 'Health 🏥'].map((topic, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="font-medium">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-trivia-text">Why Choose TriviaCash</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-trivia-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-trivia-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Payouts</h3>
              <p className="text-trivia-muted">Receive your winnings directly to your M-Pesa or Airtel Money account.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-trivia-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-trivia-secondary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Games</h3>
              <p className="text-trivia-muted">Each game takes just 5 minutes with 10 questions and 30 seconds per answer.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-trivia-accent bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Award className="text-trivia-accent" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fair Competition</h3>
              <p className="text-trivia-muted">AI-powered questions ensure equal opportunity for all players.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-trivia-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-trivia-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-trivia-muted">Advanced security measures prevent cheating and ensure fair play.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-trivia-primary to-trivia-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of players already winning cash prizes on TriviaCash!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-trivia-primary hover:bg-opacity-90">
                  Start Playing Now <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-trivia-primary hover:bg-opacity-90">
                    Register Now <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-trivia-primary">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trivia-text py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white opacity-80 text-sm mb-4 md:mb-0">
              © 2023 TriviaCash. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white opacity-80 hover:opacity-100 text-sm">Terms of Service</a>
              <a href="#" className="text-white opacity-80 hover:opacity-100 text-sm">Privacy Policy</a>
              <a href="#" className="text-white opacity-80 hover:opacity-100 text-sm">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
