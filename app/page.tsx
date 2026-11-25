import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PartnerMarquee from '@/components/home/PartnerMarquee';
import StakeholderGateways from '@/components/home/StakeholderGateways';
import TelemetryDashboard from '@/components/home/TelemetryDashboard';
import WorkflowBanner from '@/components/home/WorkflowBanner';

export default function HomePage() {
  return (
    <div className="w-full space-y-12 pb-12 transition-colors">
      <HeroSection />
      <PartnerMarquee />
      <StakeholderGateways />
      <TelemetryDashboard />
      <WorkflowBanner />
    </div>
  );
}
