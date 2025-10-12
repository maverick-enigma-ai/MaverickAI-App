import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  section?: 'services' | 'book' | 'app';
}

/**
 * SEO Head Component - Comprehensive meta tags for search engines and social sharing
 * 
 * Usage:
 * <SEOHead 
 *   title="MaverickAI Enigma Radar™ - Psychological Intelligence Platform"
 *   description="Decode power dynamics and master any situation"
 *   section="app"
 * />
 */
export function SEOHead({
  title = 'MaverickAI Enigma Radar™ - Decode Power Dynamics, Master Strategy',
  description = "The world's first AI-powered psychological intelligence platform. Advisory services, training programs, and the revolutionary Enigma Radar app for strategic decision-making.",
  keywords = 'psychological intelligence, power dynamics, strategic advisory, executive coaching, AI analysis, business strategy, negotiation training, leadership development',
  image = 'https://your-domain.com/og-image.png', // Replace with actual image URL
  url = 'https://maverickenigma.com',
  type = 'website',
  author = 'MaverickAI',
  publishedTime,
  section
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };
    
    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    
    // Open Graph tags (Facebook, LinkedIn)
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'MaverickAI Enigma Radar™', true);
    
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    
    if (section) {
      updateMetaTag('article:section', section, true);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', '@MaverickAI'); // Replace with actual Twitter handle
    
    // Mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
    updateMetaTag('theme-color', '#14123F'); // MaverickAI Navy
    
    // Apple Mobile Web App
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('apple-mobile-web-app-title', 'MaverickAI');
    
    // Google verification (add your actual verification code)
    // updateMetaTag('google-site-verification', 'your-verification-code');
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;
    
    // Structured Data (JSON-LD) for rich snippets
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'SoftwareApplication' : 'Organization',
      name: 'MaverickAI Enigma Radar™',
      description: description,
      url: url,
      logo: image,
      foundingDate: '2024',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'hello@maverickenigma.com'
      },
      sameAs: [
        // Add your social media URLs
        'https://linkedin.com/company/maverickai',
        'https://twitter.com/maverickai'
      ]
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
    
  }, [title, description, keywords, image, url, type, author, publishedTime, section]);
  
  // This component doesn't render anything
  return null;
}

/**
 * Predefined SEO configurations for each section
 */
export const SEO_CONFIGS = {
  services: {
    title: 'Strategic Advisory & Training - MaverickAI Enigma Radar™',
    description: 'Premium psychological intelligence advisory services. Executive coaching, negotiation training, and strategic consulting for high-stakes decision-makers.',
    keywords: 'executive coaching, strategic advisory, negotiation training, leadership development, business consulting, psychological intelligence',
    section: 'services' as const
  },
  
  book: {
    title: 'The Enigma Radar Book - Master Psychological Power Dynamics',
    description: 'Learn the frameworks behind the world\'s first psychological intelligence platform. Pre-order the definitive guide to reading power, gravity, and risk in any situation.',
    keywords: 'psychology book, power dynamics, strategic thinking, negotiation book, leadership book, business strategy',
    section: 'book' as const,
    type: 'product' as const
  },
  
  app: {
    title: 'MaverickAI Enigma Radar™ - AI-Powered Psychological Intelligence',
    description: 'The revolutionary app that decodes power dynamics in real-time. Analyze situations, predict outcomes, and make strategic moves with confidence.',
    keywords: 'AI app, psychological analysis, power dynamics app, strategic intelligence, decision making tool',
    section: 'app' as const,
    type: 'product' as const
  },
  
  home: {
    title: 'MaverickAI Enigma Radar™ - Decode Power Dynamics, Master Strategy',
    description: "The world's first AI-powered psychological intelligence platform. Advisory services, training programs, and the revolutionary Enigma Radar app.",
    keywords: 'psychological intelligence, power dynamics, strategic advisory, AI analysis, executive coaching, business strategy',
    section: undefined
  }
};
