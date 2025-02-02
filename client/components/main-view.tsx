"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from './data-table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, InfoIcon, Share2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

async function executeQueryApi(query: string) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to execute query');
  }

  return response.json();
}

export function MainView() {
  const [query, setQuery] = useState('SELECT * FROM users');
  const [currentQuery, setCurrentQuery] = useState('');
  const [showHint, setShowHint] = useState(true);
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['query', currentQuery],
    queryFn: () => executeQueryApi(currentQuery),
    enabled: !!currentQuery,
    retry: false,
  });

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }
    setCurrentQuery(query);
  };

  const handleShare = () => {
    if (!currentQuery) {
      toast.error('Execute a query first');
      return;
    }

    const url = new URL(window.location.origin + '/table');
    url.searchParams.set('query', encodeURIComponent(currentQuery));
    
    navigator.clipboard.writeText(url.toString())
      .then(() => toast.success('Share link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy share link'));
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      {showHint && (
        <Alert className="transition-opacity hover:opacity-90 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={() => setShowHint(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Available tables: users, products, orders<br />
            Try: SELECT * FROM users
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border bg-card p-4 transition-opacity hover:opacity-95">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="min-h-[120px] font-mono transition-all duration-200 hover:scale-[1.01]"
        />
        <div className="mt-4 flex justify-end space-x-2">
          {data && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="transition-all duration-200 hover:scale-105"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          <Button 
            onClick={handleExecuteQuery} 
            disabled={isLoading}
            className="transition-all duration-200 hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              'Execute Query'
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive animate-in fade-in-50">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      ) : null}

      {data ? (
        <div className="animate-in fade-in-50">
          <DataTable data={data} />
        </div>
      ) : null}
    </div>
  );
}