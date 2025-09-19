import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Toaster } from "@workspace/ui/components/sonner";
import "@workspace/ui/styles/globals.css";

function Popup() {
  const handleClick = () => {
    if ("Translator" in self) {
      toast("The Translator API is supported.");
    } else {
      toast("The Translator API is not supported.");
    }
  };
  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-lg font-semibold mb-2">Ardemy</h1>
      <Button size="sm" variant="outline" onClick={handleClick}>
        Button
      </Button>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
      <Toaster position="top-center" richColors />
    </React.StrictMode>,
  );
}
