import { 
  createContext, 
  ReactNode, 
  useContext, 
  useState, 
  useEffect, 
  useCallback 
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";
import { Server, ConnectionHistory } from "@shared/schema";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "disconnecting";

interface VPNContextType {
  connectionStatus: ConnectionStatus;
  selectedServer: Server | null;
  servers: Server[];
  isLoadingServers: boolean;
  connectionHistory: ConnectionHistory[];
  currentConnectionId: number | null;
  connectionTime: number;
  ipAddress: string | null;
  downloadSpeed: number;
  uploadSpeed: number;
  dataUsed: number;
  connectToServer: (serverId: number) => Promise<void>;
  disconnectFromServer: () => Promise<void>;
  selectServer: (server: Server) => void;
}

const VPNContext = createContext<VPNContextType | null>(null);

export function VPNProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // VPN state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [connectionTime, setConnectionTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [currentConnectionId, setCurrentConnectionId] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [dataUsed, setDataUsed] = useState(0);
  
  // Query for servers
  const { 
    data: servers = [], 
    isLoading: isLoadingServers 
  } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
    enabled: !!user,
  });
  
  // Query for connection history
  const { 
    data: connectionHistory = [] 
  } = useQuery<ConnectionHistory[]>({
    queryKey: ["/api/connection-history"],
    enabled: !!user,
  });
  
  // Connect mutation
  const connectMutation = useMutation({
    mutationFn: async ({ serverId, ipAddress }: { serverId: number, ipAddress: string }) => {
      const res = await apiRequest("POST", "/api/connect", { serverId, ipAddress });
      return await res.json();
    },
    onSuccess: (data: ConnectionHistory) => {
      setCurrentConnectionId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/connection-history"] });
    },
    onError: (error: Error) => {
      setConnectionStatus("disconnected");
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: async ({ connectionId, dataUsed }: { connectionId: number, dataUsed: number }) => {
      const res = await apiRequest("POST", "/api/disconnect", { connectionId, dataUsed });
      return await res.json();
    },
    onSuccess: () => {
      setCurrentConnectionId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/connection-history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Disconnect failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Effect to initialize selected server
  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      const defaultServer = servers.find(s => s.status === "available");
      if (defaultServer) {
        setSelectedServer(defaultServer);
      }
    }
  }, [servers, selectedServer]);
  
  // Connect to a server
  const connectToServer = async (serverId: number) => {
    if (!user) return;
    
    try {
      setConnectionStatus("connecting");
      
      // Generate random IP address
      const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      setIpAddress(randomIp);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Connect to server
      await connectMutation.mutateAsync({ serverId, ipAddress: randomIp });
      
      // Set connected state
      setConnectionStatus("connected");
      startConnectionTimer();
      
      // Set initial speeds
      setDownloadSpeed(Math.floor(Math.random() * 40) + 60); // 60-100 Mbps
      setUploadSpeed(Math.floor(Math.random() * 20) + 30);   // 30-50 Mbps
      
      toast({
        title: "Connected",
        description: `You are now connected to ${selectedServer?.name}, ${selectedServer?.country}`,
      });
    } catch (error) {
      setConnectionStatus("disconnected");
      console.error(error);
    }
  };
  
  // Disconnect from server
  const disconnectFromServer = async () => {
    if (!currentConnectionId) return;
    
    try {
      setConnectionStatus("disconnecting");
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Disconnect from server
      await disconnectMutation.mutateAsync({ 
        connectionId: currentConnectionId, 
        dataUsed 
      });
      
      // Reset state
      setConnectionStatus("disconnected");
      stopConnectionTimer();
      setIpAddress(null);
      setDownloadSpeed(0);
      setUploadSpeed(0);
      setDataUsed(0);
      
      toast({
        title: "Disconnected",
        description: "VPN connection has been terminated",
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  // Start connection timer
  const startConnectionTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
    }
    
    const newTimer = setInterval(() => {
      setConnectionTime(prev => prev + 1);
      
      // Simulate data usage (increase by 10-50 KB per second)
      setDataUsed(prev => prev + Math.floor(Math.random() * 40) + 10);
      
      // Occasionally vary the speed a bit for realism
      if (Math.random() > 0.8) {
        setDownloadSpeed(prev => {
          const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
          return Math.max(30, Math.min(100, prev + variation));
        });
        
        setUploadSpeed(prev => {
          const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
          return Math.max(20, Math.min(60, prev + variation));
        });
      }
    }, 1000);
    
    setTimer(newTimer);
  }, [timer]);
  
  // Stop connection timer
  const stopConnectionTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setConnectionTime(0);
  }, [timer]);
  
  // Select a server
  const selectServer = (server: Server) => {
    if (connectionStatus === "connected" || connectionStatus === "connecting") {
      toast({
        title: "Cannot change server",
        description: "Please disconnect first before changing servers",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedServer(server);
    toast({
      title: "Server selected",
      description: `Selected ${server.name}, ${server.country}`,
    });
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);
  
  return (
    <VPNContext.Provider value={{
      connectionStatus,
      selectedServer,
      servers,
      isLoadingServers,
      connectionHistory,
      currentConnectionId,
      connectionTime,
      ipAddress,
      downloadSpeed,
      uploadSpeed,
      dataUsed,
      connectToServer,
      disconnectFromServer,
      selectServer
    }}>
      {children}
    </VPNContext.Provider>
  );
}

export function useVPN() {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error("useVPN must be used within a VPNProvider");
  }
  return context;
}
