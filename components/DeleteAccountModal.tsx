import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BRAND_COLORS } from '../utils/brand-colors';

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
}

export function DeleteAccountModal({ onClose, onConfirm, userEmail }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete' || isDeleting) return;

    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Delete account error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="rounded-3xl p-6 max-w-md w-full border" style={{
        background: BRAND_COLORS.gradients.background,
        borderColor: `${BRAND_COLORS.semantic.error}4D`
      }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Delete Account
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 transition-colors p-2"
            data-name="btn_close_delete_modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
          <p className="text-red-300 text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Warning: This action cannot be undone
          </p>
          <ul className="space-y-2 text-red-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <li>• All your analysis history will be permanently deleted</li>
            <li>• Your subscription will be cancelled immediately</li>
            <li>• You will lose access to all premium features</li>
            <li>• Your account data cannot be recovered</li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-cyan-200 mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Account: <span className="text-white" style={{ fontWeight: 600 }}>{userEmail}</span>
          </p>
          
          <label className="block text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Type "DELETE" to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all min-h-[48px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            data-name="input_confirm_delete"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-4 rounded-full transition-all min-h-[56px]"
            data-name="btn_cancel_delete"
          >
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Cancel
            </span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={confirmText.toLowerCase() !== 'delete' || isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-red-500/50 disabled:to-red-600/50 text-white py-4 rounded-full transition-all shadow-lg shadow-red-500/20 min-h-[56px] disabled:opacity-50"
            data-name="btn_confirm_delete"
          >
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}