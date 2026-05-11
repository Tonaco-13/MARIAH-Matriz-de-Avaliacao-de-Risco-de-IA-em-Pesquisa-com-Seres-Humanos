'use client';

import { AnimatePresence, motion } from 'framer-motion';

type PageTransitionProps = {
  stepKey: string;
  children: React.ReactNode;
};

export default function PageTransition({ stepKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
