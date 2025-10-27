'use client';

import { useEffect } from 'react';

type PageKey = 'home' | 'showroom' | 'details' | 'dashboard' | 'test-drive';

const IMAGE_VARIABLES: Record<PageKey, string> = {
  home: 'var(--page-bg-home)',
  showroom: 'var(--page-bg-showroom)',
  details: 'var(--page-bg-details)',
  dashboard: 'var(--page-bg-dashboard)',
  'test-drive': 'var(--page-bg-test-drive)'
};

const OVERLAY_VARIABLES: Record<PageKey, string> = {
  home: 'var(--page-overlay-home)',
  showroom: 'var(--page-overlay-showroom)',
  details: 'var(--page-overlay-details)',
  dashboard: 'var(--page-overlay-dashboard)',
  'test-drive': 'var(--page-overlay-test-drive)'
};

export default function PageBackground({ page }: { page: PageKey }) {
  useEffect(() => {
    const body = document.body;
    if (!body) return;

    const previousPage = body.dataset.page ?? null;
    const previousImage = body.style.getPropertyValue('--page-bg-image');
    const previousOverlay = body.style.getPropertyValue('--page-overlay-strength');

    // tie the selected page to CSS custom properties so the background image stays static per view
    body.dataset.page = page;
    body.style.setProperty('--page-bg-image', IMAGE_VARIABLES[page] ?? IMAGE_VARIABLES.home);
    body.style.setProperty('--page-overlay-strength', OVERLAY_VARIABLES[page] ?? OVERLAY_VARIABLES.home);

    return () => {
      if (previousPage) {
        body.dataset.page = previousPage;
      } else {
        delete body.dataset.page;
      }

      if (previousImage) {
        body.style.setProperty('--page-bg-image', previousImage);
      } else {
        body.style.removeProperty('--page-bg-image');
      }

      if (previousOverlay) {
        body.style.setProperty('--page-overlay-strength', previousOverlay);
      } else {
        body.style.removeProperty('--page-overlay-strength');
      }
    };
  }, [page]);

  return null;
}

// REQUIRED ASSETS (not included):
// public/images/backgrounds/home.jpg
// public/images/backgrounds/showroom.jpg
// public/images/backgrounds/details.jpg
// public/images/backgrounds/test-drive.jpg
// public/images/backgrounds/dashboard.jpg
