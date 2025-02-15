import React, { useEffect, useRef } from 'react';

const EconomicCalendar = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.type = 'text/javascript';
    
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 400,
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "de_DE",
      "importanceFilter": "-1,0,1",
      "currencyFilter": "EUR,USD"
    });

    widgetContainer.appendChild(script);
    container.appendChild(widgetContainer);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} />;
};

export default EconomicCalendar; 