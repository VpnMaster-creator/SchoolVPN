import { Server } from "@shared/schema";
import { useVPN } from "@/hooks/use-vpn";
import { Signal, Users } from "lucide-react";

interface ServerItemProps {
  server: Server;
}

export function ServerItem({ server }: ServerItemProps) {
  const { selectedServer, connectionStatus, selectServer } = useVPN();
  
  const isSelected = selectedServer?.id === server.id;
  const isConnected = isSelected && connectionStatus === "connected";
  
  const handleServerClick = () => {
    selectServer(server);
  };
  
  // Determine server status indicator color
  const getStatusColor = () => {
    if (isConnected) return "bg-green-500";
    if (server.status === "maintenance") return "bg-red-500";
    return "bg-blue-500";
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer ${isSelected ? 'bg-muted' : 'bg-card/80'}`}
      onClick={handleServerClick}
    >
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={`https://flagcdn.com/w40/${server.countryCode.toLowerCase()}.png`} 
            alt={`${server.country} flag`} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{server.name}, {server.country}</h3>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center mr-2">
              <Signal className="h-3 w-3 mr-1" /> {server.ping}ms
            </span>
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" /> {server.load}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className={`h-3 w-3 ${getStatusColor()} rounded-full`}></div>
      </div>
    </div>
  );
}
