import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PartnerMarquee from '@/components/home/PartnerMarquee';
import StakeholderGateways from '@/components/home/StakeholderGateways';
import TelemetryDashboard from '@/components/home/TelemetryDashboard';
import WorkflowBanner from '@/components/home/WorkflowBanner';
import FloatingLandingTaskbar from '@/components/home/FloatingLandingTaskbar';

export default function HomePage() {
  return (
    <div className="w-full space-y-12 pb-20 transition-colors">
      <FloatingLandingTaskbar />
      <HeroSection />
      <PartnerMarquee />
      <StakeholderGateways />
      <TelemetryDashboard />
      <WorkflowBanner />
    </div>
  );
}
