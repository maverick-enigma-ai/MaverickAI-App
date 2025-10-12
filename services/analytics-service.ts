/**
 * MaverickAI Enigma Radar™ - Analytics Service
 * 
 * Tracks key user events for:
 * - Google Analytics 4
 * - BravoStudio analytics
 * - Custom event logging
 * 
 * BravoStudio-compliant event tracking
 */

export type AnalyticsEvent = 
  // Authentication Events
  | 'user_sign_up'
  | 'user_sign_in'
  | 'user_sign_out'
  | 'auth_error'
  
  // Core User Journey Events
  | 'home_screen_viewed'
  | 'radar_scan_started'
  | 'text_input_entered'
  | 'file_uploaded'
  | 'analysis_submitted'
  | 'processing_started'
  | 'analysis_completed'
  | 'dashboard_viewed'
  
  // Navigation Events
  | 'nav_home'
  | 'nav_radar'
  | 'nav_profile'
  | 'nav_history'
  | 'nav_settings'
  
  // History Events
  | 'historical_scan_viewed'
  | 'history_screen_viewed'
  
  // Payment Events
  | 'payment_screen_viewed'
  | 'upgrade_initiated'
  | 'subscription_completed'
  
  // Error Events
  | 'submission_error'
  | 'polling_timeout'
  | 'webhook_error'
  
  // Performance Events
  | 'time_to_dashboard'
  | 'processing_duration';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  timestamp: string;
  userId?: string;
  email?: string;
  properties?: Record<string, any>;
  duration?: number; // For timing events
}

class AnalyticsService {
  private startTimes: Map<string, number> = new Map();
  private eventLog: AnalyticsEventData[] = [];
  private readonly MAX_LOG_SIZE = 100;

  /**
   * Track a user event
   */
  track(event: AnalyticsEvent, properties?: Record<string, any>): void {
    const eventData: AnalyticsEventData = {
      event,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        // Add default properties
        platform: 'web',
        app_version: '1.0.0',
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      },
    };

    // Add to local event log
    this.eventLog.unshift(eventData);
    if (this.eventLog.length > this.MAX_LOG_SIZE) {
      this.eventLog.pop();
    }

    // Console log for debugging
    console.log(`📊 Analytics: ${event}`, properties);

    // Send to Google Analytics 4 (if configured)
    this.sendToGA4(event, eventData.properties);

    // Send to Bravo Analytics (if in Bravo environment)
    this.sendToBravo(event, eventData.properties);

    // Store in localStorage for debugging
    this.storeEvent(eventData);
  }

  /**
   * Track an event with user context
   */
  trackWithUser(
    event: AnalyticsEvent,
    userId: string,
    email: string,
    properties?: Record<string, any>
  ): void {
    this.track(event, {
      ...properties,
      userId,
      email,
    });
  }

  /**
   * Start a timer for measuring duration
   */
  startTimer(timerName: string): void {
    this.startTimes.set(timerName, Date.now());
    console.log(`⏱️ Timer started: ${timerName}`);
  }

  /**
   * End a timer and track the duration
   */
  endTimer(timerName: string, event: AnalyticsEvent, properties?: Record<string, any>): number {
    const startTime = this.startTimes.get(timerName);
    if (!startTime) {
      console.warn(`⚠️ Timer "${timerName}" was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.startTimes.delete(timerName);

    const durationSeconds = (duration / 1000).toFixed(2);
    console.log(`⏱️ Timer ended: ${timerName} = ${durationSeconds}s`);

    this.track(event, {
      ...properties,
      duration_ms: duration,
      duration_seconds: parseFloat(durationSeconds),
      timer_name: timerName,
    });

    return duration;
  }

  /**
   * Track the critical "Time to Dashboard" metric
   * This answers: "Can user get to dashboard within 3 minutes?"
   */
  trackTimeToDashboard(userId: string, email: string): void {
    const duration = this.endTimer('time_to_dashboard', 'time_to_dashboard', {
      userId,
      email,
    });

    const durationMinutes = (duration / 1000 / 60).toFixed(2);
    const isUnder3Minutes = duration < 180000; // 3 minutes in ms

    console.log(`🎯 TIME TO DASHBOARD: ${durationMinutes} minutes`);
    console.log(`✅ Under 3 minutes: ${isUnder3Minutes ? 'YES ✓' : 'NO ✗'}`);

    // Alert if over 3 minutes
    if (!isUnder3Minutes) {
      console.warn(`⚠️ PERFORMANCE ISSUE: Time to dashboard exceeded 3 minutes!`);
      this.track('polling_timeout', {
        duration_minutes: parseFloat(durationMinutes),
        userId,
        email,
      });
    }
  }

  /**
   * Get recent event log for debugging
   */
  getEventLog(): AnalyticsEventData[] {
    return [...this.eventLog];
  }

  /**
   * Export events as JSON for analysis
   */
  exportEvents(): string {
    return JSON.stringify(this.eventLog, null, 2);
  }

  /**
   * Clear event log
   */
  clearLog(): void {
    this.eventLog = [];
    localStorage.removeItem('maverick_analytics_events');
    console.log('📊 Analytics log cleared');
  }

  /**
   * Send to Google Analytics 4
   */
  private sendToGA4(event: string, properties?: Record<string, any>): void {
    // Check if gtag is available (Google Analytics 4)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
  }

  /**
   * Send to Bravo Analytics
   */
  private sendToBravo(event: string, properties?: Record<string, any>): void {
    // BravoStudio has a built-in analytics bridge
    // Check if we're running in Bravo environment
    if (typeof window !== 'undefined' && (window as any).BravoAnalytics) {
      (window as any).BravoAnalytics.track(event, properties);
    }
  }

  /**
   * Store event in localStorage for debugging
   */
  private storeEvent(event: AnalyticsEventData): void {
    try {
      const stored = localStorage.getItem('maverick_analytics_events');
      const events = stored ? JSON.parse(stored) : [];
      events.unshift(event);
      
      // Keep only last 50 events in localStorage
      const trimmed = events.slice(0, 50);
      localStorage.setItem('maverick_analytics_events', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalEvents: number;
    timeToDashboardEvents: AnalyticsEventData[];
    averageTimeToDashboard?: number;
    under3MinutesCount: number;
    over3MinutesCount: number;
  } {
    const timeToDashboardEvents = this.eventLog.filter(
      e => e.event === 'time_to_dashboard'
    );

    const durations = timeToDashboardEvents
      .map(e => e.properties?.duration_seconds)
      .filter((d): d is number => typeof d === 'number');

    const under3Min = durations.filter(d => d < 180).length;
    const over3Min = durations.filter(d => d >= 180).length;

    return {
      totalEvents: this.eventLog.length,
      timeToDashboardEvents,
      averageTimeToDashboard: durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : undefined,
      under3MinutesCount: under3Min,
      over3MinutesCount: over3Min,
    };
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Convenience functions
export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => 
  analytics.track(event, properties);

export const trackWithUser = (
  event: AnalyticsEvent,
  userId: string,
  email: string,
  properties?: Record<string, any>
) => analytics.trackWithUser(event, userId, email, properties);

export const startTimer = (timerName: string) => analytics.startTimer(timerName);

export const endTimer = (
  timerName: string,
  event: AnalyticsEvent,
  properties?: Record<string, any>
) => analytics.endTimer(timerName, event, properties);
