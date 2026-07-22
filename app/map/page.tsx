"use client";

import React from "react";
import InteractiveMapCanvas from "@/components/InteractiveMapCanvas";

export default function MapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <InteractiveMapCanvas />
    </div>
  );
}
