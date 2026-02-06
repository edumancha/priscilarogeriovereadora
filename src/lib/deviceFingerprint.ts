// Generate a simple device fingerprint based on browser characteristics
export function generateDeviceFingerprint(): string {
  const stored = localStorage.getItem('device_fingerprint');
  if (stored) return stored;

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    // Canvas fingerprint (simplified)
    (() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'no-canvas';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
        return canvas.toDataURL().slice(-50);
      } catch {
        return 'canvas-error';
      }
    })(),
  ];

  // Create a hash from components
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const fingerprint = `fp_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
  localStorage.setItem('device_fingerprint', fingerprint);
  
  return fingerprint;
}

export function getDeviceFingerprint(): string {
  return localStorage.getItem('device_fingerprint') || generateDeviceFingerprint();
}
