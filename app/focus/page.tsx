'use client';

import { useState, useEffect, useRef } from 'react';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play alarm sound here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = () => {
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-8 transition-colors duration-1000"
         style={{ backgroundColor: mode === 'focus' ? '#111' : '#1a2e1a' }}>
      
      {/* Audio Element (Hidden) - Using a placeholder URL */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=rain-and-thunder-16023.mp3" />

      <div className="max-w-md w-full text-center space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-light tracking-[0.2em] mb-2 uppercase">
            {mode === 'focus' ? 'Deep Work' : 'Recharge'}
          </h1>
          <p className="text-white/30 text-sm">FocusAI • Daily Driver</p>
        </div>

        {/* Timer */}
        <div className="relative group">
          <div className="text-[8rem] font-mono leading-none tracking-tighter tabular-nums select-none cursor-pointer"
               onClick={toggleTimer}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={toggleTimer} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold uppercase tracking-widest">
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest text-white/50">
              Reset
            </button>
            <button onClick={toggleMode} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest text-white/50">
              {mode === 'focus' ? 'Break Mode' : 'Focus Mode'}
            </button>
          </div>
        </div>

        {/* Ambient Sound */}
        <button 
          onClick={() => {
            if (audioRef.current) {
              audioPlaying ? audioRef.current.pause() : audioRef.current.play();
              setAudioPlaying(!audioPlaying);
            }
          }}
          className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full transition-all ${
            audioPlaying ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/30 hover:bg-white/10'
          }`}
        >
          <span>{audioPlaying ? '🔊' : '🔈'}</span>
          <span className="text-xs font-bold uppercase tracking-widest">Rain Sounds</span>
        </button>

        {/* Tasks */}
        <div className="text-left bg-white/5 p-6 rounded-2xl border border-white/5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Daily Priorities</h2>
          <ul className="space-y-3 mb-4">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-center gap-3 group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-transparent checked:bg-green-500 transition" />
                <span className="text-lg group-hover:text-white transition-colors text-white/70">{task}</span>
              </li>
            ))}
            {tasks.length === 0 && <li className="text-white/20 italic">No tasks yet. Clear mind.</li>}
          </ul>
          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="+ Add a focus task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-white/50 transition text-white placeholder:text-white/20"
            />
          </form>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-center gap-6 text-sm text-white/20">
          <a href="/" className="hover:text-white transition">Cockpit</a>
          <a href="/jobs" className="hover:text-white transition">Jobs</a>
          <a href="/research" className="hover:text-white transition">Trends</a>
        </div>
      </div>
    </div>
  );
}
