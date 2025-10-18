import { useState, useEffect } from 'react';
import { Save, X, Edit2, Eye, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';

interface ContentConfig {
  meta: {
    siteName: string;
    tagline: string;
    domain: string;
  };
  header: {
    logo: {
      size: string;
      text: string;
      subtitle: string;
    };
    signInButton: string;
  };
  services: any;
  book: any;
  app: any;
  waitlist: any;
  footer: any;
}

export function ContentEditor({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<ContentConfig | null>(null);
  const [activeSection, setActiveSection] = useState<string>('meta');
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'json'>('edit');

  // Load content config on mount
  useEffect(() => {
    fetch('/content-config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load content config:', err));
  }, []);

  const handleSave = () => {
    if (!config) return;
    
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-config.json';
    a.click();
    URL.revokeObjectURL(url);
    
    setHasChanges(false);
    alert('✅ Content saved! Download the file and replace /content-config.json in your project.');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setConfig(json);
        setHasChanges(false);
        alert('✅ Content loaded successfully!');
      } catch (err) {
        alert('❌ Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const updateValue = (path: string[], value: any) => {
    if (!config) return;
    
    const newConfig = JSON.parse(JSON.stringify(config));
    let current = newConfig;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setConfig(newConfig);
    setHasChanges(true);
  };

  if (!config) {
    return (
      <div className="fixed inset-0 bg-navy/95 backdrop-blur-md flex items-center justify-center z-50">
        <div className="text-white">Loading content editor...</div>
      </div>
    );
  }

  const sections = [
    { id: 'meta', name: 'Site Info', icon: '🌐' },
    { id: 'header', name: 'Header', icon: '📍' },
    { id: 'services', name: 'Services Tab', icon: '💼' },
    { id: 'book', name: 'Book Tab', icon: '📚' },
    { id: 'app', name: 'App Tab', icon: '📱' },
    { id: 'waitlist', name: 'Waitlist', icon: '📧' },
    { id: 'footer', name: 'Footer', icon: '🔗' },
  ];

  return (
    <div className="fixed inset-0 bg-navy/95 backdrop-blur-md z-50 overflow-hidden">
      <div className="size-full flex flex-col">
        {/* Header */}
        <div className="bg-glass-strong border-b border-border-cyan p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl flex items-center gap-2">
                <Edit2 className="w-6 h-6 text-cyan" />
                Landing Page Content Editor
              </h1>
              <p className="text-white/60 text-sm">Edit your landing page content without touching code</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-glass rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'edit' ? 'bg-cyan text-navy' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('json')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'json' ? 'bg-purple text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Upload Config */}
              <label className="px-4 py-2 rounded-lg bg-glass border border-border text-white hover:bg-glass-strong transition-all cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
              
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-6 py-2 rounded-lg transition-all ${
                  hasChanges
                    ? 'bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg'
                    : 'bg-glass text-white/40 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 inline mr-2" />
                {hasChanges ? 'Download Changes' : 'No Changes'}
              </button>
              
              {/* Close */}
              <Button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-glass border border-border text-white hover:bg-glass-strong transition-all"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Section Navigation */}
          <div className="w-64 bg-glass border-r border-border overflow-y-auto">
            <div className="p-4 space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-cyan text-navy'
                      : 'text-white/80 hover:bg-glass-strong hover:text-white'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {viewMode === 'edit' ? (
                <EditView
                  section={activeSection}
                  config={config}
                  onUpdate={updateValue}
                />
              ) : (
                <JsonView config={config} />
              )}
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="bg-glass-strong border-t border-border p-3">
          <div className="max-w-7xl mx-auto text-center text-white/60 text-sm">
            💡 <strong>Tip:</strong> Edit content → Click "Download Changes" → Replace /content-config.json in your project → Refresh page to see changes
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit View Component
function EditView({ section, config, onUpdate }: any) {
  const renderField = (label: string, path: string[], value: any, type: 'text' | 'textarea' | 'number' = 'text') => {
    const Component = type === 'textarea' ? 'textarea' : 'input';
    
    return (
      <div className="mb-6">
        <label className="block text-white/80 mb-2">{label}</label>
        <Component
          type={type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(e: any) => onUpdate(path, e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-glass border border-border text-white placeholder:text-white/40 focus:border-cyan focus:outline-none"
          rows={type === 'textarea' ? 4 : undefined}
        />
      </div>
    );
  };

  switch (section) {
    case 'meta':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Site Information</h2>
          {renderField('Site Name', ['meta', 'siteName'], config.meta.siteName)}
          {renderField('Tagline', ['meta', 'tagline'], config.meta.tagline)}
          {renderField('Domain', ['meta', 'domain'], config.meta.domain)}
        </div>
      );
      
    case 'header':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Header Content</h2>
          {renderField('Logo Text', ['header', 'logo', 'text'], config.header.logo.text)}
          {renderField('Logo Subtitle', ['header', 'logo', 'subtitle'], config.header.logo.subtitle)}
          {renderField('Sign In Button', ['header', 'signInButton'], config.header.signInButton)}
          
          <div className="mt-6 p-4 rounded-xl bg-glass-strong border border-border-cyan">
            <p className="text-cyan text-sm mb-2">💡 Logo Size</p>
            <p className="text-white/70 text-sm">
              The logo in the header is currently <strong>40px × 40px</strong> (small). 
              To change the size, you'll need to edit the component code directly.
            </p>
          </div>
        </div>
      );
      
    case 'services':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Services Tab</h2>
          {renderField('Badge Text', ['services', 'badge'], config.services.badge)}
          {renderField('Main Headline', ['services', 'headline'], config.services.headline, 'textarea')}
          {renderField('Sub-headline', ['services', 'subheadline'], config.services.subheadline, 'textarea')}
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {renderField('Primary CTA', ['services', 'cta', 'primary'], config.services.cta.primary)}
            {renderField('Secondary CTA', ['services', 'cta', 'secondary'], config.services.cta.secondary)}
          </div>
          
          <h3 className="text-white/80 mt-8 mb-4">Service Cards</h3>
          {config.services.offerings.cards.map((card: any, idx: number) => (
            <div key={idx} className="mb-6 p-4 rounded-xl bg-glass border border-border">
              <p className="text-cyan text-sm mb-3">Card {idx + 1}: {card.title}</p>
              {renderField('Title', ['services', 'offerings', 'cards', idx, 'title'], card.title)}
              {renderField('Description', ['services', 'offerings', 'cards', idx, 'description'], card.description, 'textarea')}
              {renderField('CTA Button', ['services', 'offerings', 'cards', idx, 'cta'], card.cta)}
            </div>
          ))}
        </div>
      );
      
    case 'book':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Book Tab</h2>
          {renderField('Badge Text', ['book', 'badge'], config.book.badge)}
          {renderField('Main Headline', ['book', 'headline'], config.book.headline, 'textarea')}
          {renderField('Sub-headline', ['book', 'subheadline'], config.book.subheadline, 'textarea')}
          
          <h3 className="text-white/80 mt-8 mb-4">Book Details</h3>
          {renderField('Release Date', ['book', 'details', 'releaseDate'], config.book.details.releaseDate)}
          {renderField('Pages', ['book', 'details', 'pages'], config.book.details.pages)}
          {renderField('Format', ['book', 'details', 'format'], config.book.details.format)}
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {renderField('Primary CTA', ['book', 'cta', 'primary'], config.book.cta.primary)}
            {renderField('Secondary CTA', ['book', 'cta', 'secondary'], config.book.cta.secondary)}
          </div>
        </div>
      );
      
    case 'app':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">App Tab</h2>
          {renderField('Badge Text', ['app', 'badge'], config.app.badge)}
          {renderField('Main Headline', ['app', 'headline'], config.app.headline, 'textarea')}
          {renderField('Sub-headline', ['app', 'subheadline'], config.app.subheadline, 'textarea')}
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {renderField('Primary CTA', ['app', 'cta', 'primary'], config.app.cta.primary)}
            {renderField('Secondary CTA', ['app', 'cta', 'secondary'], config.app.cta.secondary)}
          </div>
          
          <h3 className="text-white/80 mt-8 mb-4">Stats</h3>
          {config.app.stats.map((stat: any, idx: number) => (
            <div key={idx} className="grid md:grid-cols-2 gap-4 mb-4">
              {renderField(`Stat ${idx + 1} Number`, ['app', 'stats', idx, 'number'], stat.number)}
              {renderField(`Stat ${idx + 1} Label`, ['app', 'stats', idx, 'label'], stat.label)}
            </div>
          ))}
        </div>
      );
      
    case 'waitlist':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Waitlist Section</h2>
          {renderField('Headline', ['waitlist', 'headline'], config.waitlist.headline)}
          {renderField('Sub-headline', ['waitlist', 'subheadline'], config.waitlist.subheadline, 'textarea')}
          {renderField('Email Placeholder', ['waitlist', 'emailPlaceholder'], config.waitlist.emailPlaceholder)}
          {renderField('Submit Button', ['waitlist', 'submitButton'], config.waitlist.submitButton)}
          {renderField('Success Message', ['waitlist', 'successMessage'], config.waitlist.successMessage)}
          {renderField('Success Subtext', ['waitlist', 'successSubtext'], config.waitlist.successSubtext)}
          {renderField('Disclaimer', ['waitlist', 'disclaimer'], config.waitlist.disclaimer, 'textarea')}
        </div>
      );
      
    case 'footer':
      return (
        <div>
          <h2 className="text-white text-xl mb-6">Footer</h2>
          {renderField('Description', ['footer', 'description'], config.footer.description, 'textarea')}
          {renderField('Email', ['footer', 'email'], config.footer.email)}
          {renderField('Copyright', ['footer', 'copyright'], config.footer.copyright)}
        </div>
      );
      
    default:
      return <div className="text-white">Select a section to edit</div>;
  }
}

// JSON View Component
function JsonView({ config }: { config: any }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl">JSON View</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-glass border border-border text-white hover:bg-glass-strong transition-all"
        >
          {copied ? '✅ Copied!' : '📋 Copy JSON'}
        </button>
      </div>
      
      <pre className="bg-navy/50 border border-border rounded-xl p-6 overflow-x-auto">
        <code className="text-cyan text-sm">
          {JSON.stringify(config, null, 2)}
        </code>
      </pre>
    </div>
  );
}
