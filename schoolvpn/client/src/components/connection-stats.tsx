import { useVPN } from "@/hooks/use-vpn";
import { Button } from "@/components/ui/button";
import { Shield, ArrowDown, ArrowUp, Power } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function ConnectionStats() {
  const { 
    connectionStatus, 
    selectedServer, 
    connectionTime, 
    ipAddress,
    downloadSpeed,
    uploadSpeed,
    connectToServer,
    disconnectFromServer
  } = useVPN();
  
  // Format connection time
  const formatConnectionTime = () => {
    if (connectionStatus !== "connected") return "Not connected";
    
    const hours = Math.floor(connectionTime / 3600);
    const minutes = Math.floor((connectionTime % 3600) / 60);
    const seconds = connectionTime % 60;
    
    let timeString = '';
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
    if (!hours && !minutes) timeString += `${seconds}s`;
    
    return `Connected for: ${timeString}`;
  };
  
  // Handle connect/disconnect
  const handleConnectionToggle = () => {
    if (connectionStatus === "connected") {
      disconnectFromServer();
    } else if (connectionStatus === "disconnected" && selectedServer) {
      connectToServer(selectedServer.id);
    }
  };
  
  // Get status classes
  const getStatusClasses = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          ring: "border-green-500",
          icon: "bg-green-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
          text: "text-green-500",
          button: "bg-green-500 hover:bg-green-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
          buttonText: "Disconnect"
        };
      case "connecting":
        return {
          ring: "border-amber-500",
          icon: "bg-amber-500",
          text: "text-amber-500",
          button: "bg-amber-500 hover:bg-amber-600",
          buttonText: "Connecting..."
        };
      case "disconnecting":
        return {
          ring: "border-amber-500",
          icon: "bg-amber-500",
          text: "text-amber-500",
          button: "bg-amber-500 hover:bg-amber-600",
          buttonText: "Disconnecting..."
        };
      default:
        return {
          ring: "border-red-500",
          icon: "bg-red-500",
          text: "text-red-500",
          button: "bg-slate-700 hover:bg-slate-600",
          buttonText: "Connect"
        };
    }
  };
  
  const statusClasses = getStatusClasses();
  
  return (
    <div className="bg-card rounded-lg border shadow-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className={`relative h-40 w-40 flex items-center justify-center rounded-full border-4 ${statusClasses.ring}`}>
            <div className={`h-24 w-24 rounded-full ${statusClasses.icon} flex items-center justify-center`}>
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className={`mt-4 text-xl font-bold ${statusClasses.text} capitalize`}>
            {connectionStatus}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {formatConnectionTime()}
          </p>
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Current server</h3>
              {selectedServer && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  Optimal
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center">
              {selectedServer ? (
                <>
                  <div className="mr-2 flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <img 
                      src={`https://flagcdn.com/w20/${selectedServer.countryCode.toLowerCase()}.png`} 
                      alt={`${selectedServer.country} flag`} 
                      className="h-4 w-4 rounded-full"
                    />
                  </div>
                  <span className="text-lg font-medium">
                    {selectedServer.name}, {selectedServer.country}
                  </span>
                </>
              ) : (
                <span className="text-lg font-medium text-muted-foreground">
                  No server selected
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
            <div className="mt-1 flex items-center space-x-2">
              <code className="text-lg font-medium font-mono">
                {ipAddress || "Not connected"}
              </code>
              {ipAddress && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">VPN Protocol</h3>
            <div className="mt-1 flex items-center space-x-2">
              <Select defaultValue="wireguard">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openvpn">OpenVPN</SelectItem>
                  <SelectItem value="wireguard">WireGuard</SelectItem>
                  <SelectItem value="ipsec">IPSec</SelectItem>
                  <SelectItem value="sstp">SSTP</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">Recommended</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <Button 
              className={`w-full py-6 ${statusClasses.button} text-white font-medium rounded-md flex items-center justify-center`}
              onClick={handleConnectionToggle}
              disabled={connectionStatus === "connecting" || connectionStatus === "disconnecting" || !selectedServer}
            >
              {connectionStatus === "connecting" || connectionStatus === "disconnecting" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Power className="mr-2 h-5 w-5" />
              )}
              <span>{statusClasses.buttonText}</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/10 p-3 rounded-lg border">
              <h4 className="text-xs text-muted-foreground font-medium mb-1">Download</h4>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-lg font-mono font-medium">
                  {connectionStatus === "connected" ? `${downloadSpeed.toFixed(1)} Mbps` : "--"}
                </span>
              </div>
            </div>
            
            <div className="bg-secondary/10 p-3 rounded-lg border">
              <h4 className="text-xs text-muted-foreground font-medium mb-1">Upload</h4>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-lg font-mono font-medium">
                  {connectionStatus === "connected" ? `${uploadSpeed.toFixed(1)} Mbps` : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
