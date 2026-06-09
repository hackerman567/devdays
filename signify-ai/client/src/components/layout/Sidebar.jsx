import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, History, Settings, HelpCircle, Accessibility } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function Sidebar() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, tooltip: 'Overview & Stats' },
    { name: 'Classroom', path: '/classroom', icon: Video, tooltip: 'Live Captions & AI Tutor' },
    { name: 'AI Avatar', path: '/avatar', icon: Accessibility, tooltip: 'Sign Language Avatar' },
    { name: 'History', path: '/history', icon: History, tooltip: 'Saved Lecture Archives' },
    { name: 'Settings', path: '/settings', icon: Settings, tooltip: 'App Configurations' },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-30 w-16 hover:w-56 bg-bg-surface border-r border-border-subtle transition-all duration-300 group overflow-x-hidden">
        {/* Navigation Section */}
        <nav className="flex-1 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={
                  `flex items-center h-12 px-5 transition-all relative ${
                    isActive 
                      ? 'text-accent-coral bg-accent-coral/5 border-l-2 border-accent-coral' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 min-w-5 shrink-0" />
                <span className="ml-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.name}
                </span>

                {/* Collapsed Tooltip */}
                <div className="absolute left-16 bg-bg-elevated text-text-primary border border-border-subtle text-xs font-semibold py-1.5 px-3 rounded shadow-lg opacity-0 pointer-events-none group-hover:group-hover:opacity-0 group-hover:group-hover:pointer-events-none group-hover:hover:opacity-0 transition-opacity duration-200 block md:group-hover:opacity-0 group-hover:block md:hidden">
                  {item.tooltip}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Help */}
        <div className="py-6 border-t border-border-subtle">
          <button
            onClick={() => setHelpOpen(true)}
            className="flex items-center w-full h-12 px-5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 transition-all focus:outline-none"
          >
            <HelpCircle className="w-5 h-5 min-w-5 shrink-0 text-text-secondary" />
            <span className="ml-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Help & Tips
            </span>
          </button>
        </div>
      </aside>

      {/* Help Modal */}
      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Signify AI Help & Documentation">
        <div className="space-y-4">
          <p className="text-text-primary font-semibold">Welcome to Signify AI!</p>
          <p>This application is built as a classroom companion for deaf and hard-of-hearing students. Here is how to get the most out of it:</p>
          
          <div className="space-y-3 mt-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-accent-coral/10 text-accent-coral flex items-center justify-center shrink-0 text-xs font-bold">1</div>
              <div>
                <strong className="text-text-primary">Microphone Streaming</strong>
                <p className="text-xs text-text-secondary mt-0.5">Go to the Classroom page, click "Start Session", and grant microphone access. Speech will be transcribed word-by-word.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-accent-coral/10 text-accent-coral flex items-center justify-center shrink-0 text-xs font-bold">2</div>
              <div>
                <strong className="text-text-primary">Try Demo (No Mic Mode)</strong>
                <p className="text-xs text-text-secondary mt-0.5">Don't have a mic, or using a browser other than Chrome? Click the "Try Demo" button on the classroom bottom bar. It simulates an active classroom session.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-accent-coral/10 text-accent-coral flex items-center justify-center shrink-0 text-xs font-bold">3</div>
              <div>
                <strong className="text-text-primary">Real-time Translations</strong>
                <p className="text-xs text-text-secondary mt-0.5">Select your native language and turn on "Auto-Translate". The system translates each completed sentence after a brief speech pause.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-accent-coral/10 text-accent-coral flex items-center justify-center shrink-0 text-xs font-bold">4</div>
              <div>
                <strong className="text-text-primary">AI Lecture Tutor & Summary</strong>
                <p className="text-xs text-text-secondary mt-0.5">Click "Generate Summary" at the end of a lecture to review key concepts. Use the chat input to ask the AI tutor specific questions about the lecture material.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setHelpOpen(false)} variant="primary" size="sm">
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
