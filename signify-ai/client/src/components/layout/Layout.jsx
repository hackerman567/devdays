import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function Layout() {
  const location = useLocation();
  const { reduceMotion } = useSettingsStore();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-accent-coral/25 selection:text-text-primary text-text-primary">
      {/* Top Navbar */}
      <Navbar />

      {/* Content wrapper */}
      <div className="flex-1 flex relative">
        {/* Sidebar - Collapsed/expanded left rail, only on non-landing pages */}
        {!isLanding && <Sidebar />}

        {/* Main section */}
        <main className={`flex-1 min-w-0 ${!isLanding ? 'md:pl-16' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
