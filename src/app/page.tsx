"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowRight, LoaderCircle } from 'lucide-react';

export default function Home() {
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // This single function handles everything: AI generation, task creation, and redirect.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading on form submission
    if (!problem.trim()) {
      setError("Please enter a problem to solve.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Call the API route we built to handle AI generation AND database saving
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again later.');
      }
      
      const result = await response.json();
      console.log(result)
      if (result.success) {
        // On success, redirect the user to their dashboard to see the new tasks
        router.push('/dashboard');
      } else {
        throw new Error('Failed to create tasks from the problem.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <main className="flex min-h-[80vh] w-full flex-col items-center justify-center p-4">
      <div className="flex w-full flex-col items-center text-center">
        <h1 className="text-6xl font-bold sm:text-7xl">
          ZenTask
        </h1>
        <p className="mt-2 text-muted-foreground">Turn complexity into clarity.</p>
        
        {/* A single form handles the entire user interaction */}
        <form onSubmit={handleSubmit} className="mt-12 w-full max-w-xl">
          <div className="relative flex items-center">
            <Input 
              value={problem} 
              onChange={(e) => setProblem(e.target.value)} 
              className="h-16 w-full pr-16 text-center text-lg placeholder:text-base"  
              placeholder="What is your problem?" 
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 h-12 w-12"
              disabled={isLoading}
            >
              {/* Show a loader when processing, otherwise show the arrow */}
              {isLoading ? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ) : (
                <ArrowRight className="h-6 w-6" />
              )}
              <span className="sr-only">Create Task</span>
            </Button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </main>
  );
}