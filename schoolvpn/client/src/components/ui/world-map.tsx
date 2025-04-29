import { useVPN } from "@/hooks/use-vpn";
import { useState } from "react";

export function WorldMap() {
  const { servers, connectionStatus, selectedServer, selectServer } = useVPN();
  const [hoveredServer, setHoveredServer] = useState<string | null>(null);
  
  // Helper function to determine server status color
  const getServerColor = (serverId: number) => {
    const server = servers.find(s => s.id === serverId);
    
    if (!server) return "bg-slate-500";
    
    if (selectedServer?.id === serverId && connectionStatus === "connected") {
      return "bg-green-500"; // Connected
    }
    
    if (server.status === "maintenance") {
      return "bg-red-500"; // Maintenance
    }
    
    return "bg-primary"; // Available
  };
  
  const handleServerClick = (serverId: number) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      selectServer(server);
    }
  };
  
  return (
    <div className="relative h-[300px] w-full bg-slate-900 rounded-md overflow-hidden">
      {/* Simplified world map using SVG */}
      <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
        <path d="M150,50 L850,50 L850,450 L150,450 Z" fill="none" stroke="#6366F1" strokeWidth="2" />
        {/* Simplified continents */}
        <path
          d="M200,100 Q300,150 250,200 Q200,250 300,300 L400,300 Q450,250 500,300 Q550,350 600,300 L700,300 Q750,250 800,200 Q850,150 800,100 Z"
          fill="#6366F1"
          fillOpacity="0.2"
          stroke="#6366F1"
          strokeWidth="1"
        />
        <path
          d="M250,350 Q300,370 350,350 Q400,330 450,350 L500,350 Q550,330 600,350 L650,350 Q700,370 750,350 Z"
          fill="#6366F1"
          fillOpacity="0.2"
          stroke="#6366F1"
          strokeWidth="1"
        />
      </svg>
      
      {/* Server markers */}
      {servers.map(server => {
        const isActive = selectedServer?.id === server.id && connectionStatus === "connected";
        const isHovered = hoveredServer === `${server.id}`;
        
        // Calculate position based on lat/long
        // This is simplified - you would need to adjust for actual map projection
        const left = `${(parseFloat(server.longitude) + 180) / 360 * 800 + 100}px`;
        const top = `${(90 - parseFloat(server.latitude)) / 180 * 300 + 50}px`;
        
        return (
          <div
            key={server.id}
            className={`absolute h-3 w-3 ${getServerColor(server.id)} rounded-full cursor-pointer transition-all duration-300 ${isActive ? 'h-4 w-4 z-10' : ''} ${isHovered ? 'scale-150 z-20' : ''}`}
            style={{ left, top }}
            onClick={() => handleServerClick(server.id)}
            onMouseEnter={() => setHoveredServer(`${server.id}`)}
            onMouseLeave={() => setHoveredServer(null)}
            data-tooltip-content={`${server.name}, ${server.country}`}
          />
        );
      })}
      
      {/* Tooltip */}
      {hoveredServer && (
        <div className="absolute top-0 left-0 bg-card text-foreground px-2 py-1 text-xs rounded shadow-lg z-30"
             style={{ transform: 'translate(-50%, -130%)' }}>
          {servers.find(s => s.id === parseInt(hoveredServer))?.name}, 
          {servers.find(s => s.id === parseInt(hoveredServer))?.country}
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-foreground">Connected</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-primary rounded-full mr-2"></div>
          <span className="text-sm text-foreground">Available</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-foreground">High Load</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4">
        <span className="text-sm text-muted-foreground">{servers.length} Servers available</span>
      </div>
    </div>
  );
}
