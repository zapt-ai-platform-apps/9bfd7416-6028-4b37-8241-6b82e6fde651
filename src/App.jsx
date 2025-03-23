import React from 'react';
import Map from './components/Map';
import ZaptBadge from './components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">World Map Explorer</h1>
        <p className="text-center text-sm mt-1">Click on any country to see details and folk stories</p>
      </header>
      
      <main className="w-full h-[calc(100vh-80px)]">
        <Map />
      </main>
      
      <ZaptBadge />
    </div>
  );
}