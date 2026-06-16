import React from 'react';
import GrowthAnalyticsDashboard from '@/components/live/GrowthAnalyticsDashboard';

export default function Analytics() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-serif text-stone-900 leading-tight">Growth & Performance Analytics</h1>
        <p className="text-stone-500">
          Visualize parenting development progress, habits compliance, streak metrics, and direct database sync statuses.
        </p>
      </header>
      
      {/* Dedicate Analytics Panel */}
      <section className="space-y-6">
        <GrowthAnalyticsDashboard />
      </section>
    </div>
  );
}
