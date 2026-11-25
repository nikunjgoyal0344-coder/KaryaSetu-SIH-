import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import HeroSection from '@/components/home/HeroSection';
import PartnerMarquee from '@/components/home/PartnerMarquee';
import StakeholderGateways from '@/components/home/StakeholderGateways';
import TelemetryDashboard from '@/components/home/TelemetryDashboard';
import WorkflowBanner from '@/components/home/WorkflowBanner';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import ScrollReveal from '@/components/ScrollReveal';
import WhyMatchModal from '@/components/WhyMatchModal';
import CompetencyRadarCard from '@/components/dashboard/CompetencyRadarCard';
import SkillGapsCard from '@/components/dashboard/SkillGapsCard';
import { INITIAL_STUDENT, INITIAL_OPPORTUNITIES } from '@/lib/seedData';
import { computeOpportunityMatch } from '@/lib/matchingEngine';

test('Home sections render semantic landmarks, headings, SVG aria labels, and reduced-motion scroll wrappers', () => {
  const heroHtml = renderToStaticMarkup(React.createElement(HeroSection));
  assert.ok(heroHtml.includes('<h1'), 'HeroSection must render primary H1 landmark');
  assert.ok(heroHtml.includes('id="hero-heading"'));
  assert.ok(heroHtml.includes('role="img"'));
  assert.ok(heroHtml.includes('/login?role=student'));

  const marqueeHtml = renderToStaticMarkup(React.createElement(PartnerMarquee));
  assert.ok(marqueeHtml.includes('Ministry of Ayush'));
  assert.ok(marqueeHtml.includes('motion-reduce:transition-none'));

  const gatewaysHtml = renderToStaticMarkup(React.createElement(StakeholderGateways));
  assert.ok(gatewaysHtml.includes('id="gateways-heading"'));
  for (const role of ['student', 'industry', 'faculty', 'institution']) {
    assert.ok(gatewaysHtml.includes(`/login?role=${role}`));
    assert.ok(gatewaysHtml.includes(`/register?role=${role}`));
  }

  const telemetryHtml = renderToStaticMarkup(React.createElement(TelemetryDashboard));
  assert.ok(telemetryHtml.includes('aria-pressed="true"'));
  assert.ok(telemetryHtml.includes('id="telemetry-heading"'));

  const workflowHtml = renderToStaticMarkup(React.createElement(WorkflowBanner));
  assert.ok(workflowHtml.includes('/workflow'));
  assert.ok(workflowHtml.includes('id="workflow-banner-heading"'));
});

test('Scroll components, dashboard cards, and WhyMatchModal render with WCAG accessibility attributes', () => {
  const progressHtml = renderToStaticMarkup(React.createElement(ScrollProgressBar));
  assert.ok(progressHtml.includes('aria-hidden="true"'));
  assert.ok(progressHtml.includes('motion-reduce:hidden'));

  const revealHtml = renderToStaticMarkup(
    React.createElement(ScrollReveal, {
      variant: 'fade-up',
      delayMs: 120,
      children: React.createElement('p', null, 'Accessible Block'),
    })
  );
  assert.ok(revealHtml.includes('Accessible Block'));
  assert.ok(revealHtml.includes('motion-reduce:opacity-100'));

  const closedModalHtml = renderToStaticMarkup(
    React.createElement(WhyMatchModal, {
      isOpen: false,
      onClose: () => {},
      opportunityTitle: 'Test Role',
      companyName: 'Test Org',
      match: computeOpportunityMatch(INITIAL_STUDENT, INITIAL_OPPORTUNITIES[0]),
    })
  );
  assert.strictEqual(closedModalHtml, '');

  const openModalHtml = renderToStaticMarkup(
    React.createElement(WhyMatchModal, {
      isOpen: true,
      onClose: () => {},
      opportunityTitle: INITIAL_OPPORTUNITIES[0].title,
      companyName: INITIAL_OPPORTUNITIES[0].company,
      match: computeOpportunityMatch(INITIAL_STUDENT, INITIAL_OPPORTUNITIES[0]),
      onApply: () => {},
      isApplied: false,
    })
  );
  assert.ok(openModalHtml.includes('role="dialog"'));
  assert.ok(openModalHtml.includes('aria-modal="true"'));
  assert.ok(openModalHtml.includes('aria-labelledby="why-match-modal-title"'));
  assert.ok(openModalHtml.includes('aria-label="Close modal"'));

  const radarHtml = renderToStaticMarkup(
    React.createElement(CompetencyRadarCard, {
      student: INITIAL_STUDENT,
      enrolledBridges: [],
    })
  );
  assert.ok(radarHtml.includes('8-Axis Clinical Competency Radar'));

  const gapsHtml = renderToStaticMarkup(
    React.createElement(SkillGapsCard, {
      rasashastraLvl: 1,
      herbLvl: 2,
      ehrLvl: 2,
      enrolledBridges: ['rasashastra-qa'],
      onEnrollBridge: () => {},
    })
  );
  assert.ok(gapsHtml.includes('Rasashastra'));
  assert.ok(gapsHtml.includes('Enrolled (Lvl 2)'));
});
