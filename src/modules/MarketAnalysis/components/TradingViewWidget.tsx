import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const TradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedInstrument = useSelector((state: RootState) => 
    state.marketAnalysis.selectedInstrument
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          "width": "100%",
          "height": 500,
          "symbol": selectedInstrument || "CME_MINI:ES1!",
          "interval": "D",
          "timezone": "Europe/Berlin",
          "theme": "dark",
          "style": "1",
          "locale": "de_DE",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": "tradingview-widget"
        });
      }
    };

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [selectedInstrument]);

  return <div id="tradingview-widget" ref={containerRef} />;
};

export default TradingViewWidget; 