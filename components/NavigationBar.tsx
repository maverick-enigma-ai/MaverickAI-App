import { Home, Clock, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/brand-colors';

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
    <div style={{
      background: BRAND_COLORS.gradients.background,
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${BRAND_COLORS.borders.normal}`,
      padding: '1rem 1.5rem'
    }}>
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ 
                scale: 0.92,
                borderColor: BRAND_COLORS.borders.cyan
              }}
              className="w-[72px] h-[72px] rounded-[24px] flex items-center justify-center transition-all"
              style={{
                background: `linear-gradient(to bottom right, ${BRAND_COLORS.deepBlue}, ${BRAND_COLORS.navy})`,
                border: `1px solid ${BRAND_COLORS.borders.normal}`
              }}
              data-name={`nav_${tab.id}`}
            >
              <Icon 
                className="w-8 h-8" 
                strokeWidth={1.5}
                style={{
                  color: activeTab === tab.id ? BRAND_COLORS.cyan : `${BRAND_COLORS.cyan}B3`  // 70% opacity
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
