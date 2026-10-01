/**
 * Simulated Analytics Service
 * In production, this would call your Telemetry endpoint.
 */
export const trackEvent = (eventName, params = {}) => {
  console.log(`[Analytics] Event: ${eventName}`, params);
  
  // Example Production Call:
  // fetch('/api/v1/telemetry', {
  //   method: 'POST',
  //   body: JSON.stringify({ event: eventName, ...params, timestamp: new Date() })
  // });
};

export const analyticsEvents = {
  SESSION_START: 'session_start',
  QUERY_SUBMIT: 'query_submit',
  SCHEME_VIEWED: 'scheme_viewed',
  DOC_CHECKED: 'doc_checked',
  LANGUAGE_SWITCHED: 'language_switched',
  VOICE_USED: 'voice_used',
  FEEDBACK_GIVEN: 'feedback_given',
  ESCALATION_REQUESTED: 'escalation_requested'
};
