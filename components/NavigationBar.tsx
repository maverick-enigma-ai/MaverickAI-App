import { Home, Clock, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRadarScan: () => void;
}

export function NavigationBar({ activeTab, onTabChange, onRadarScan }: NavigationBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'moves', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] backdrop-blur-md border-t border-white/10 px-6 py-4">
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ 
                scale: 0.92,
                borderColor: "rgba(34, 211, 238, 0.6)"
              }}
              className="w-[72px] h-[72px] rounded-[24px] flex items-center justify-center transition-all bg-gradient-to-br from-[#4A46B8] to-[#342FA5] border border-white/10"
              data-name={`nav_${tab.id}`}
            >
              <Icon className={`w-8 h-8 ${activeTab === tab.id ? 'text-cyan-400' : 'text-cyan-300/70'}`} strokeWidth={1.5} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}