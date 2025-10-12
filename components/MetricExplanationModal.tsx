import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: 'power' | 'gravity' | 'risk' | 'confidence' | null;
}

export function MetricExplanationModal({ isOpen, onClose, metric }: MetricExplanationModalProps) {
  if (!isOpen || !metric) return null;

  const getMetricInfo = () => {
    switch (metric) {
      case 'power':
        return {
          title: 'Power Score',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20',
          description: 'Measures the psychological influence strength and dominance patterns detected in the interaction.',
          details: [
            'Analyzes language patterns that indicate authority',
            'Detects subtle manipulation techniques',
            'Identifies power positioning strategies',
            'Measures confidence and assertiveness levels'
          ],
          scale: 'Scale: 1-10 (Higher = More Dominant Power Position)'
        };
      case 'gravity':
        return {
          title: 'Gravity Score', 
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          description: 'Quantifies emotional pull, attachment dynamics, and psychological magnetism in relationships.',
          details: [
            'Measures emotional dependency patterns',
            'Identifies attachment and bonding signals',
            'Analyzes psychological magnetism factors',
            'Detects emotional manipulation tactics'
          ],
          scale: 'Scale: 1-10 (Higher = Stronger Emotional Pull)'
        };
      case 'risk':
        return {
          title: 'Risk Score',
          color: 'text-red-400', 
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          description: 'Evaluates potential negative outcomes and psychological hazards if current dynamics continue unchecked.',
          details: [
            'Identifies toxic behavioral patterns',
            'Predicts escalation probabilities', 
            'Flags psychological red flags',
            'Assesses long-term relationship stability'
          ],
          scale: 'Scale: 1-10 (Higher = Greater Risk Level)'
        };
      case 'confidence':
        return {
          title: 'Analysis Confidence',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10', 
          borderColor: 'border-green-500/20',
          description: 'Indicates how confident our AI models are in the accuracy of this psychological analysis.',
          details: [
            'Based on data quality and completeness',
            'Considers model consensus across algorithms',
            'Factors in contextual information availability',
            'Accounts for behavioral pattern clarity'
          ],
          scale: 'Scale: 0-100% (Higher = More Reliable Analysis)'
        };
    }
  };

  const info = getMetricInfo();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-md bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] rounded-3xl border ${info.borderColor} backdrop-blur-md overflow-hidden`}
        data-name={`modal_${metric}_explanation`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className={`text-lg ${info.color}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              {info.title}
            </h2>
            <p className="text-white/70 text-sm mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Psychological Intelligence Metric
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-300 min-h-[48px] min-w-[48px] shadow-lg hover:shadow-cyan-500/30 group relative overflow-hidden"
            data-name="btn_close_metric_modal"
          >
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
            <X className="w-6 h-6 text-white/70 group-hover:text-white relative z-10 transition-colors" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`${info.bgColor} rounded-2xl p-4 border ${info.borderColor} mb-6`}>
            <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {info.description}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              What This Measures:
            </h3>
            {info.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${info.color.replace('text-', 'bg-')} mt-2 shrink-0`} />
                <p className="text-cyan-100 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className={`${info.color} text-sm`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              {info.scale}
            </p>
          </div>
        </div>

        {/* Footer - Award-Winning Button */}
        <div className="p-6 pt-0">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 btn-press-strong relative overflow-hidden group min-h-[60px]"
            data-name="btn_close_metric_explanation"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 opacity-0 group-hover:opacity-100"
              style={{ backgroundSize: '200% 100%' }}
            />
            
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
            
            <span className="relative flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✓
              </motion.span>
              Got It
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}