'use client';

import React from 'react';
import { useApp } from '@/lib/store';

export default function RoleSwitcher() {
  const { isLoggedIn } = useApp();

  // If logged in, NO switching between roles is provided without signing out first
  if (isLoggedIn) {
    return null;
  }

  return null;
}
