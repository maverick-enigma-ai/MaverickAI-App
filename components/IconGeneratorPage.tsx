// Icon Generator Page - Export all app icons and splash screens
// Visit this page in your browser, then right-click each icon to "Save As"

import { RadarLogoIcon } from './icons/RadarLogoIcon';
import { MasterAppIcon } from './icons/MasterAppIcon';
import {
  SplashScreen,
  IPhoneXSplash,
  IPhoneXRSplash,
  IPhoneXSMaxSplash,
  IPhone12ProSplash,
  IPhone12ProMaxSplash,
} from './icons/SplashScreen';

export function IconGeneratorPage() {
  const iconSizes = [
    { name: 'icon-72', size: 72 },
    { name: 'icon-96', size: 96 },
    { name: 'icon-128', size: 128 },
    { name: 'icon-144', size: 144 },
    { name: 'icon-152', size: 152 },
    { name: 'icon-192', size: 192 },
    { name: 'icon-384', size: 384 },
    { name: 'icon-512', size: 512 },
  ];

  const faviconSizes = [
    { name: 'favicon-16x16', size: 16 },
    { name: 'favicon-32x32', size: 32 },
  ];

  const splashScreens = [
    { name: 'iPhone X/XS/11 Pro', width: 1125, height: 2436, fileName: 'splash-1125x2436' },
    { name: 'iPhone XR/11', width: 828, height: 1792, fileName: 'splash-828x1792' },
    { name: 'iPhone XS Max/11 Pro Max', width: 1242, height: 2688, fileName: 'splash-1242x2688' },
    { name: 'iPhone 12/13/14 Pro', width: 1170, height: 2532, fileName: 'splash-1170x2532' },
    { name: 'iPhone 12/13/14 Pro Max', width: 1284, height: 2778, fileName: 'splash-1284x2778' },
  ];

  const handleDownloadSVG = (name: string, svgElement: SVGSVGElement | null) => {
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${name}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleDownloadPNG = async (name: string, svgElement: SVGSVGElement | null, width: number, height: number) => {
    if (!svgElement) return;

    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      
      // Convert canvas to PNG
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${name}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white mb-4">
            MaverickAI Enigma Radar™ Icon Generator
          </h1>
          <p className="text-lg text-[#14b8a6] mb-2">
            Right-click any icon below and select "Save image as..." to download
          </p>
          <p className="text-sm text-white/60">
            Or click the download buttons to save SVG/PNG files programmatically
          </p>
        </div>

        {/* PWA Icons */}
        <section className="mb-16">
          <h2 className="text-2xl text-[#00d4ff] mb-6 border-b border-white/10 pb-2">
            PWA Icons (Required)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {iconSizes.map(({ name, size }) => (
              <div
                key={name}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div
                  className="mb-4 flex items-center justify-center"
                  style={{ height: Math.min(size, 200) }}
                >
                  <div
                    id={name}
                    ref={(el) => {
                      if (el) {
                        const svg = el.querySelector('svg');
                        if (svg) {
                          (el as any)._svgElement = svg;
                        }
                      }
                    }}
                  >
                    <RadarLogoIcon size={size} />
                  </div>
                </div>
                <p className="text-white text-center mb-2">{name}.png</p>
                <p className="text-[#14b8a6] text-sm text-center mb-4">{size}x{size}px</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(name);
                      const svg = (container as any)?._svgElement;
                      handleDownloadSVG(name, svg);
                    }}
                    className="flex-1 px-3 py-2 bg-[#8b5cf6] text-white text-xs rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    SVG
                  </button>
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(name);
                      const svg = (container as any)?._svgElement;
                      handleDownloadPNG(name, svg, size, size);
                    }}
                    className="flex-1 px-3 py-2 bg-[#00d4ff] text-[#14123F] text-xs rounded-lg hover:bg-[#14b8a6] transition-colors"
                  >
                    PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Favicons */}
        <section className="mb-16">
          <h2 className="text-2xl text-[#00d4ff] mb-6 border-b border-white/10 pb-2">
            Favicons (Browser Tabs)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {faviconSizes.map(({ name, size }) => (
              <div
                key={name}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div
                  className="mb-4 flex items-center justify-center h-32 bg-white/5 rounded-lg"
                >
                  <div
                    id={name}
                    ref={(el) => {
                      if (el) {
                        const svg = el.querySelector('svg');
                        if (svg) {
                          (el as any)._svgElement = svg;
                        }
                      }
                    }}
                  >
                    <RadarLogoIcon size={size} />
                  </div>
                </div>
                <p className="text-white text-center mb-2">{name}.png</p>
                <p className="text-[#14b8a6] text-sm text-center mb-4">{size}x{size}px</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(name);
                      const svg = (container as any)?._svgElement;
                      handleDownloadSVG(name, svg);
                    }}
                    className="flex-1 px-3 py-2 bg-[#8b5cf6] text-white text-xs rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    SVG
                  </button>
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(name);
                      const svg = (container as any)?._svgElement;
                      handleDownloadPNG(name, svg, size, size);
                    }}
                    className="flex-1 px-3 py-2 bg-[#00d4ff] text-[#14123F] text-xs rounded-lg hover:bg-[#14b8a6] transition-colors"
                  >
                    PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Splash Screens */}
        <section className="mb-16">
          <h2 className="text-2xl text-[#00d4ff] mb-6 border-b border-white/10 pb-2">
            iOS Splash Screens (Launch Screens)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {splashScreens.map(({ name, width, height, fileName }) => (
              <div
                key={fileName}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div className="mb-4 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">
                  <div
                    id={fileName}
                    style={{ width: '100%', height: 'auto', maxHeight: 400 }}
                    ref={(el) => {
                      if (el) {
                        const svg = el.querySelector('svg');
                        if (svg) {
                          (el as any)._svgElement = svg;
                        }
                      }
                    }}
                  >
                    <SplashScreen width={width} height={height} />
                  </div>
                </div>
                <p className="text-white text-center mb-1">{name}</p>
                <p className="text-[#14b8a6] text-sm text-center mb-2">{fileName}.png</p>
                <p className="text-white/60 text-xs text-center mb-4">{width}x{height}px</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(fileName);
                      const svg = (container as any)?._svgElement;
                      handleDownloadSVG(fileName, svg);
                    }}
                    className="flex-1 px-3 py-2 bg-[#8b5cf6] text-white text-xs rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    SVG
                  </button>
                  <button
                    onClick={(e) => {
                      const container = document.getElementById(fileName);
                      const svg = (container as any)?._svgElement;
                      handleDownloadPNG(fileName, svg, width, height);
                    }}
                    className="flex-1 px-3 py-2 bg-[#00d4ff] text-[#14123F] text-xs rounded-lg hover:bg-[#14b8a6] transition-colors"
                  >
                    PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PWA Builder Master Icon - FEATURED (512x512) */}
        <section className="mb-16">
          <h2 className="text-2xl text-[#00d4ff] mb-6 border-b border-white/10 pb-2">
            🎯 PWA Builder Master Icon (RECOMMENDED)
          </h2>
          <div className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 backdrop-blur-md rounded-2xl p-8 border-2 border-[#00d4ff]/50 max-w-2xl mx-auto">
            <div className="bg-[#14123F]/50 rounded-xl p-6 mb-6">
              <div
                className="flex items-center justify-center"
                id="pwa-master-icon"
                ref={(el) => {
                  if (el) {
                    const svg = el.querySelector('svg');
                    if (svg) {
                      (el as any)._svgElement = svg;
                    }
                  }
                }}
              >
                <MasterAppIcon size={512} />
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-white text-2xl mb-2">📱 icon-512.png</p>
              <p className="text-[#00d4ff] text-xl mb-2">512x512px</p>
              <div className="inline-block bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-lg px-4 py-2 mb-4">
                <p className="text-[#00d4ff]">✨ Perfect for PWA Builder</p>
              </div>
              <p className="text-white/80 text-sm max-w-lg mx-auto mb-4">
                This is your radar icon on the MaverickAI gradient background - ready to upload to 
                <a href="https://www.pwabuilder.com/imageGenerator" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline ml-1">
                  pwabuilder.com/imageGenerator
                </a>
              </p>
            </div>
            <div className="flex gap-4 justify-center mb-4">
              <button
                onClick={(e) => {
                  const container = document.getElementById('pwa-master-icon');
                  const svg = (container as any)?._svgElement;
                  handleDownloadSVG('maverick-radar-master-512', svg);
                }}
                className="px-6 py-3 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
              >
                Download SVG
              </button>
              <button
                onClick={(e) => {
                  const container = document.getElementById('pwa-master-icon');
                  const svg = (container as any)?._svgElement;
                  handleDownloadPNG('maverick-radar-master-512', svg, 512, 512);
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#14123F] rounded-lg hover:from-[#14b8a6] hover:to-[#00d4ff] transition-all shadow-lg shadow-[#00d4ff]/30"
              >
                ⬇️ Download PNG (512x512)
              </button>
            </div>
            <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg p-4">
              <p className="text-white/90 text-sm mb-2">📝 <strong>Next Steps:</strong></p>
              <ol className="text-white/80 text-sm space-y-1 ml-6 list-decimal">
                <li>Click "Download PNG (512x512)" above</li>
                <li>Go to <a href="https://www.pwabuilder.com/imageGenerator" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline">pwabuilder.com/imageGenerator</a></li>
                <li>Upload this 512x512 PNG file</li>
                <li>Download the generated ZIP (contains all 15 icon sizes)</li>
                <li>Extract and use in your app! 🚀</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Original Master Icon (1024x1024) */}
        <section className="mb-16">
          <h2 className="text-2xl text-[#00d4ff] mb-6 border-b border-white/10 pb-2">
            Master Icon (App Store - 1024x1024)
          </h2>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            <div
              className="mb-6 flex items-center justify-center"
              id="master-icon-1024"
              ref={(el) => {
                if (el) {
                  const svg = el.querySelector('svg');
                  if (svg) {
                    (el as any)._svgElement = svg;
                  }
                }
              }}
            >
              <MasterAppIcon size={512} />
            </div>
            <p className="text-white text-center text-xl mb-2">icon-1024.png</p>
            <p className="text-[#14b8a6] text-center mb-2">1024x1024px</p>
            <p className="text-white/60 text-sm text-center mb-6">
              Required for iOS App Store submission (Capacitor deployment)
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={(e) => {
                  const container = document.getElementById('master-icon-1024');
                  const svg = (container as any)?._svgElement;
                  handleDownloadSVG('icon-1024', svg);
                }}
                className="px-6 py-3 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
              >
                Download SVG
              </button>
              <button
                onClick={(e) => {
                  const container = document.getElementById('master-icon-1024');
                  const svg = (container as any)?._svgElement;
                  handleDownloadPNG('icon-1024', svg, 1024, 1024);
                }}
                className="px-6 py-3 bg-[#00d4ff] text-[#14123F] rounded-lg hover:bg-[#14b8a6] transition-colors"
              >
                Download PNG (1024x1024)
              </button>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl text-[#00d4ff] mb-6">How to Use These Icons</h2>
            
            <div className="space-y-6 text-white/80">
              <div>
                <h3 className="text-lg text-[#14b8a6] mb-2">Method 1: Right-Click Save (Easiest)</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Right-click on any icon above</li>
                  <li>Select "Save image as..."</li>
                  <li>Save to your <code className="bg-white/10 px-2 py-1 rounded">/public/</code> folder</li>
                  <li>Rename if needed (e.g., icon-192.png)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg text-[#14b8a6] mb-2">Method 2: Download Buttons</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Click the PNG button under each icon</li>
                  <li>Icon downloads automatically with correct name</li>
                  <li>Move to <code className="bg-white/10 px-2 py-1 rounded">/public/</code> folder</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg text-[#14b8a6] mb-2">Method 3: Screenshot (Alternative)</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Use your OS screenshot tool</li>
                  <li>Capture just the icon (crop precisely)</li>
                  <li>Save as PNG with correct dimensions</li>
                </ol>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="text-lg text-[#14b8a6] mb-2">After Downloading</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Place all icons in <code className="bg-white/10 px-2 py-1 rounded">/public/</code> folder</li>
                  <li>Verify filenames match manifest.json references</li>
                  <li>Test PWA installation on mobile device</li>
                  <li>Check that icons display correctly</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Checklist */}
        <section className="mb-16">
          <div className="bg-[#00d4ff]/10 backdrop-blur-md rounded-2xl p-8 border border-[#00d4ff]/30">
            <h2 className="text-2xl text-[#00d4ff] mb-6">✅ Icon Checklist</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-white mb-3">PWA Icons (8 files):</h3>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-72.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-96.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-128.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-144.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-152.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-192.png ⭐ (Required)</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-384.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>icon-512.png ⭐ (Required)</span>
                </label>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white mb-3">Splash Screens (5 files):</h3>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>splash-1125x2436.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>splash-828x1792.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>splash-1242x2688.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>splash-1170x2532.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>splash-1284x2778.png</span>
                </label>
                
                <h3 className="text-white mt-6 mb-3">Favicons (2 files):</h3>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>favicon-16x16.png</span>
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>favicon-32x32.png</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
