"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { syncDatabaseStorage } from '@/lib/api';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRequestError(null);
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
    const handleApiError = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setRequestError(detail?.message || 'Échec de synchronisation avec le backend.');
    };
    window.addEventListener('klarity_api_error', handleApiError);
    return () => {
      active = false;
      window.removeEventListener('klarity_api_error', handleApiError);
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Connexion à la base de données...</div>;
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

  return (
    <>
      {requestError && (
        <div role="alert" className="fixed bottom-4 right-4 z-[100] max-w-lg rounded-xl border border-red-300 bg-white p-4 text-sm text-red-800 shadow-xl">
          <p>La synchronisation avec le backend a échoué : {requestError}</p>
          <button type="button" className="mt-2 font-semibold underline" onClick={() => void loadData()}>
            Recharger les données
          </button>
        </div>
      )}
      {children}
    </>
  );
}
