import { ArrowLeft, Shield } from 'lucide-react';
import { BRAND_COLORS } from '../utils/brand-colors';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <div className="w-full min-h-screen" style={{ background: BRAND_COLORS.gradients.background }}>
      {/* Header */}
      <div className="sticky top-0 border-b p-4 z-10" style={{ 
        background: BRAND_COLORS.gradients.backgroundHorizontal,
        borderColor: BRAND_COLORS.borders.normal
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors min-h-[48px] min-w-[48px]"
            data-name="btn_back_from_privacy"
          >
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h1 className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Privacy Policy
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-24">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 space-y-6">
          <div className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Last Updated: September 30, 2025
          </div>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              1. Information We Collect
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              MaverickAI Enigma Radar™ collects information you provide directly to us, including:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Account information (email, name, password)</li>
              <li>• Analysis input data and uploaded documents</li>
              <li>• Payment and billing information</li>
              <li>• Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              2. How We Use Your Information
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We use the collected information to:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Provide psychological intelligence analysis services</li>
              <li>• Process payments and manage subscriptions</li>
              <li>• Improve our AI models and service quality</li>
              <li>• Send important updates and notifications</li>
              <li>• Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              3. Data Security
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We implement industry-standard security measures including encryption, secure cloud storage, and regular security audits. Your analysis data is processed securely and never shared with third parties without your consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              4. Third-Party Services
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We use trusted third-party services for:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Payment processing (Stripe)</li>
              <li>• Authentication (Firebase)</li>
              <li>• AI analysis (OpenAI)</li>
              <li>• Cloud storage and hosting</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              5. Data Retention
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We retain your data as long as your account is active or as needed to provide services. You can request deletion of your data at any time through the "Delete Account" feature in your profile.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              6. Your Rights
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              You have the right to:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Access your personal data</li>
              <li>• Request data correction or deletion</li>
              <li>• Export your data</li>
              <li>• Opt out of marketing communications</li>
              <li>• Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              7. Children's Privacy
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              8. Changes to This Policy
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              9. Contact Us
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p className="text-cyan-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              privacy@maverickaienigma.com
            </p>
          </section>

          <div className="pt-6 border-t border-white/10">
            <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              MaverickAI Enigma Radar™ is committed to protecting your privacy and ensuring the security of your personal information. We comply with GDPR, CCPA, and other applicable data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}