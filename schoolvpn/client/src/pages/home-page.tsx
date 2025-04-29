import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function HomePage() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to dashboard
    setLocation('/');
  }, [setLocation]);
  
  return null;
}
