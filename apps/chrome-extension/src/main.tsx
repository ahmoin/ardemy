import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@workspace/ui/components/button';
import '@workspace/ui/styles/globals.css';

function Popup() {
  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-lg font-semibold mb-2">Ardemy</h1>
      <Button size="sm" variant="outline">
        Button
      </Button>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
