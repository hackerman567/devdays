import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllLectures, 
  deleteLecture, 
  clearAllLectures 
} from '../lib/db';
import { SUPPORTED_LANGUAGES } from '../lib/translate';

import StatsCard from '../components/ui/StatsCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { 
  FileText, 
  Sparkles, 
  Trash2, 
  Play, 
  Download, 
  AlertTriangle,
  History,
  BookOpen,
  Languages,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Load lectures from IndexedDB
  const loadLectures = async () => {
    try {
      const data = await getAllLectures();
      setLectures(data);
    } catch (err) {
      console.error('Failed to load lectures:', err);
      toast.error('Failed to access database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  // Delete individual lecture
  const handleDelete = async (id) => {
    try {
      await deleteLecture(id);
      setLectures(prev => prev.filter(l => l.id !== id));
      toast.success('Lecture deleted from history.');
    } catch (err) {
      toast.error('Failed to delete lecture.');
    }
  };

  // Clear all lectures
  const handleClearHistory = async () => {
    try {
      await clearAllLectures();
      setLectures([]);
      setConfirmClearOpen(false);
      toast.success('All history cleared.');
    } catch (err) {
      toast.error('Failed to clear database.');
    }
  };

  // Export all database records as a JSON file
  const handleExportAll = () => {
    if (lectures.length === 0) {
      toast.error('No lectures available to export.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lectures, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `signify-all-lectures-${new Date().toISOString().slice(0, 10)}.json`);
    a.click();
    toast.success('All data exported successfully.');
  };

  // 1. Calculate Stats
  const totalLecturesCount = lectures.length;
  const totalWordsCaptured = lectures.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
  
  // Set of target translation languages used (excluding base English)
  const uniqueLanguagesSet = new Set(
    lectures
      .map(l => l.targetLanguage)
      .filter(lang => lang && lang !== 'en')
  );
  const totalLanguagesUsed = uniqueLanguagesSet.size;

  // Study time calculation
  const totalSeconds = lectures.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const totalStudyTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // 2. Prepare Chart Data (last 7 lectures)
  const getChartData = () => {
    if (lectures.length === 0) {
      // Mock data to demonstrate Recharts beauty on empty state
      return [
        { name: 'Mon', Words: 1200, title: 'Sample: React Components' },
        { name: 'Tue', Words: 1800, title: 'Sample: Cellular Respiration' },
        { name: 'Wed', Words: 900, title: 'Sample: Quantum Physics' },
        { name: 'Thu', Words: 2100, title: 'Sample: Roman Empire' },
        { name: 'Fri', Words: 1500, title: 'Sample: Linear Algebra' },
        { name: 'Sat', Words: 0, title: '' },
        { name: 'Sun', Words: 0, title: '' }
      ];
    }

    return lectures
      .slice(0, 7)
      .reverse()
      .map(l => {
        const date = new Date(l.createdAt);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        return {
          name: day,
          Words: l.wordCount,
          title: l.title
        };
      });
  };

  // Format table durations
  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-elevated border border-border-subtle p-3 rounded-lg text-xs space-y-1">
          <p className="font-bold text-text-primary">{data.title || 'No Lecture'}</p>
          <p className="text-accent-coral">{data.Words.toLocaleString()} words captured</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight font-display">
            Learning Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your transcription statistics, history, and engagement patterns
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/classroom')}
            variant="primary"
            icon={Play}
            className="uppercase tracking-wider text-xs"
          >
            New Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard value={totalLecturesCount} label="Total Lectures Archived" icon={History} />
        <StatsCard value={totalWordsCaptured} label="Total Words Captured" icon={BookOpen} />
        <StatsCard value={totalLanguagesUsed} label="Languages Explored" icon={Languages} />
        {/* Render study duration formatted string using custom string override in StatsCard */}
        <StatsCard value={totalStudyTimeStr} label="Total Study Duration" icon={Clock} />
      </div>

      {/* Two-Column Grid: Recharts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Left 2/3: Engagement Chart */}
        <div className="lg:col-span-1 xl:col-span-2 bg-bg-surface border border-border-subtle rounded-xl p-6 relative">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
            <div>
              <h2 className="font-bold text-text-primary text-base font-display">Student Word Counts</h2>
              <p className="text-[10px] text-text-secondary mt-0.5">
                {lectures.length === 0 
                  ? 'Showing sample stats. Save a lecture to populate.' 
                  : 'Total words captured across your last 7 lectures'}
              </p>
            </div>
            {lectures.length === 0 && (
              <Badge variant="language" className="text-[10px]">Sample Data</Badge>
            )}
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="coralGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4A4A5A" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#4A4A5A" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Words" 
                  stroke="#FF4D4D" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#coralGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1/3: Quick Actions */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-text-primary text-base font-display border-b border-border-subtle pb-3">Quick Utilities</h2>
            <p className="text-xs text-text-secondary">
              Manage your local archives, backup your data, or clean storage spaces safely.
            </p>
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleExportAll}
                disabled={lectures.length === 0}
                variant="ghost"
                className="w-full justify-start text-xs"
                icon={Download}
              >
                Export Database (.json)
              </Button>
              <Button
                onClick={() => setConfirmClearOpen(true)}
                disabled={lectures.length === 0}
                variant="danger"
                className="w-full justify-start text-xs"
                icon={Trash2}
              >
                Clear Lecture History
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border-subtle text-[10px] text-text-muted flex items-center justify-between">
            <span>Powered by Groq API + IndexedDB</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Recent Lectures Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
          <h2 className="font-bold text-text-primary text-base font-display">Recent Archived Sessions</h2>
          <Badge variant="count">{lectures.length} Total</Badge>
        </div>

        {loading ? (
          <div className="py-12 text-center text-text-secondary text-xs">Loading database records...</div>
        ) : lectures.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="p-3 bg-bg-elevated rounded-full border border-border-subtle text-text-muted w-fit mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-primary font-bold">No lecture history found</p>
              <p className="text-[10px] text-text-secondary mt-1">
                Your saved lectures will appear here. Go to the Classroom page to run a live session.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Lecture Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Words Captured</th>
                  <th className="py-3 px-4">Translation Language</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-text-secondary">
                <AnimatePresence>
                  {lectures.slice(0, 5).map((lec) => {
                    const matchedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === lec.targetLanguage);
                    return (
                      <motion.tr 
                        key={lec.id}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="hover:bg-bg-elevated/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-text-primary max-w-[200px] truncate">{lec.title}</td>
                        <td className="py-3 px-4">{new Date(lec.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{formatDuration(lec.duration)}</td>
                        <td className="py-3 px-4">{lec.wordCount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          {matchedLanguage ? `${matchedLanguage.flag} ${matchedLanguage.name}` : 'English (None)'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/history?id=${lec.id}`)}
                              className="p-1.5 rounded-md hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
                              title="Open lecture detail"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(lec.id)}
                              className="p-1.5 rounded-md hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                              title="Delete lecture"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing History */}
      <Modal isOpen={confirmClearOpen} onClose={() => setConfirmClearOpen(false)} title="Clear Lecture History?">
        <div className="space-y-4">
          <div className="flex gap-3 items-start p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Warning: Permanent Action</p>
              <p className="text-[10px] leading-relaxed mt-0.5">
                Clearing history removes all recorded lectures, AI summaries, and Q&A chat transcripts from your local browser IndexedDB storage. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setConfirmClearOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button onClick={handleClearHistory} variant="danger" size="sm">
              Clear All Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
