"use client";

import { useQuery } from '@tanstack/react-query';
import { DataTable } from './data-table';
import { useRouter } from 'next/navigation';
import { Loader2, Code } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useEffect } from 'react';

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

export function TableView({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['shared-query', initialQuery],
    queryFn: () => executeQueryApi(initialQuery),
    retry: false,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      router.push('/');
    }
  });

  useEffect(() => {
    if (!initialQuery) {
      toast.error('No query provided');
      router.push('/');
    }
  }, [initialQuery, router]);

  if (!initialQuery) {
    return null;
  }

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <Alert className="transition-opacity hover:opacity-90">
        <Code className="h-4 w-4" />
        <AlertDescription className="font-mono">
          {initialQuery}
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      ) : !data ? (
        <div className="text-center py-8 text-muted-foreground">
          No results found.
        </div>
      ) : (
        <DataTable data={data} />
      )}
    </div>
  );
}