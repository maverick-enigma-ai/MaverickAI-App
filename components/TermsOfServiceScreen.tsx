import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F]">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-[#14123F] to-[#342FA5] border-b border-white/10 p-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors min-h-[48px] min-w-[48px]"
            data-name="btn_back_from_terms"
          >
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h1 className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              By accessing and using MaverickAI Enigma Radar™, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              2. Service Description
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              MaverickAI Enigma Radar™ is a psychological intelligence platform that provides AI-powered analysis of interpersonal dynamics and strategic insights. Our service is intended for informational and educational purposes only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              3. User Responsibilities
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              You agree to:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Provide accurate account information</li>
              <li>• Maintain the security of your account credentials</li>
              <li>• Use the service in compliance with all applicable laws</li>
              <li>• Not share or resell access to the service</li>
              <li>• Not use the service for illegal or harmful purposes</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              4. Subscription and Billing
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Subscription details:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Subscriptions auto-renew unless cancelled</li>
              <li>• You will be charged at the start of each billing period</li>
              <li>• Refunds are provided at our discretion</li>
              <li>• You can cancel your subscription at any time</li>
              <li>• Price changes will be communicated 30 days in advance</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              5. Intellectual Property
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              All content, features, and functionality of MaverickAI Enigma Radar™ are owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our proprietary materials without permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              6. Disclaimer of Warranties
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              MaverickAI Enigma Radar™ is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Accuracy or completeness of analysis results</li>
              <li>• Uninterrupted or error-free service</li>
              <li>• Specific outcomes from using our insights</li>
              <li>• Compatibility with all devices or systems</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              7. Limitation of Liability
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the past 12 months.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              8. Professional Advice Disclaimer
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Our service provides general psychological insights and is not a substitute for professional mental health services, legal advice, or medical consultation. Always consult qualified professionals for serious matters.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              9. Account Termination
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We reserve the right to suspend or terminate your account for:
            </p>
            <ul className="text-cyan-100 space-y-2 pl-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• Violation of these terms</li>
              <li>• Fraudulent or illegal activity</li>
              <li>• Non-payment of subscription fees</li>
              <li>• Abuse of the service or other users</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              10. Changes to Terms
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. Material changes will be communicated via email.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              11. Governing Law
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              These terms are governed by the laws of the jurisdiction in which our company is registered. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              12. Contact Information
            </h2>
            <p className="text-cyan-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-cyan-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              legal@maverickaienigma.com
            </p>
          </section>

          <div className="pt-6 border-t border-white/10">
            <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              By using MaverickAI Enigma Radar™, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}