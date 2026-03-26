'use client';

import dynamic from 'next/dynamic';

const LawyerSlider = dynamic(
  () => import('./lawyer-slider').then((m) => m.LawyerSlider),
  { ssr: false }
);

export function LawyerSliderClient() {
  return <LawyerSlider />;
}
