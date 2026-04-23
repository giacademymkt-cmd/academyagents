import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SaaSChaosDashboard from './components/experiences/SaaSChaosDashboard';
import BiometricScanner from './components/experiences/BiometricScanner';
import IPhoneCollapse from './components/experiences/IPhoneCollapse';
import RadarSonar from './components/experiences/RadarSonar';
import ParticleHourglass from './components/experiences/ParticleHourglass';

const EXPERIENCES: Record<string, React.FC<any>> = {
  'saas': SaaSChaosDashboard,
  'biometric': BiometricScanner,
  'iphone': IPhoneCollapse,
  'radar': RadarSonar,
  'hourglass': ParticleHourglass
};

// Select ALL roots in case there are multiple shortcodes on the same page
const wpRoots = document.querySelectorAll('.premium-gallery-root');

if (wpRoots.length > 0) {
  wpRoots.forEach((rootNode) => {
    const expName = rootNode.getAttribute('data-exp');
    const Component = expName && EXPERIENCES[expName] ? EXPERIENCES[expName] : App;
    
    ReactDOM.createRoot(rootNode as HTMLElement).render(
      <React.StrictMode>
        <div className="w-full h-full min-h-[600px] rounded-xl overflow-hidden shadow-2xl relative">
          <Component onComplete={() => window.location.href = 'https://gestaoimpacto.com/masterclass'} />
        </div>
      </React.StrictMode>
    );
  });
} else {
  // Standalone mode
  const root = document.getElementById('root');
  if(root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
