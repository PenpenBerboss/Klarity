"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { syncDatabaseStorage } from '@/lib/api';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await syncDatabaseStorage();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void syncDatabaseStorage()
      .then(() => {
        if (active) setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : String(loadError));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950"
        role="status"
        aria-label="Chargement des données depuis le serveur"
      >
        <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/25 motion-reduce:animate-none">
          K
        </div>
        <span className="sr-only">Chargement des données...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto mt-16 max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-gray-900 shadow-sm">
        <h1 className="text-lg font-semibold">Connexion au backend impossible</h1>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
        <p className="mt-2 text-sm text-gray-600">
          Vérifiez que l’API Express et MySQL sont démarrés, puis réessayez.
        </p>
        <button
          type="button"
          onClick={() => void loadData()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Réessayer
        </button>
      </main>
    );
  }

  return children;
}
