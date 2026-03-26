"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-up" | "scale-up";
  delay?: number;
}

export default function AnimationWrapper({
  children,
  className,
  animation = "fade-in",
  delay = 0,
  ...props
}: AnimationWrapperProps) {
  const variants = {
    "fade-in": {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, delay } },
    },
    "fade-in-up": {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
    },
    "scale-up": {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay, ease: "easeOut" } },
    },
  };

  return (
    <motion.div
      variants={variants[animation]}
      initial="hidden"
      animate="visible"
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: delayChildren }}
    >
      {children}
    </motion.div>
  );
}