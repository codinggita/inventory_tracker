import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Log page view
    console.log(`[Analytics] Page View: ${location.pathname}${location.search}`);
    
    // If Google Analytics was integrated:
    // window.gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: location.pathname + location.search,
    // });
  }, [location]);

  const trackEvent = (eventName, eventParams) => {
    console.log(`[Analytics] Event: ${eventName}`, eventParams);
    // window.gtag('event', eventName, eventParams);
  };

  return { trackEvent };
};
