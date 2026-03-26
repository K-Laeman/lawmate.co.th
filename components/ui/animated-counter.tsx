'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  prefix = '', 
  suffix = '',
  className 
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;

    const controls = animate(0, value, {
      duration,
      onUpdate(v) {
        node.textContent = `${prefix}${Math.floor(v).toLocaleString()}${suffix}`;
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [value, duration, prefix, suffix, isInView]);

  return <span ref={nodeRef} className={className} />;
}
