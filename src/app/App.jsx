import React, { useEffect } from 'react';
import { WorldMap } from '@/modules/map';
import ZaptBadge from '@/modules/ui/ZaptBadge';
import ErrorBoundary from '@/modules/core/ui/ErrorBoundary';
import { initializeModules } from '@/modules';

export default function App() {
  useEffect(() => {
    initializeModules();
  }, []);

  return (
    <div className="min-h-screen h-full bg-gray-100 text-gray-900 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">World Map Explorer</h1>
        <p className="text-center text-sm mt-1">Click on any country to see details and folk stories</p>
      </header>
      
      <main className="flex-grow w-full">
        <ErrorBoundary 
          fallback={
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
                <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
                <p className="text-gray-700 mb-4">We encountered an error while trying to load the map. Please try refreshing the page.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          }
        >
          <WorldMap />
        </ErrorBoundary>
      </main>
      
      <ZaptBadge />
    </div>
  );
}