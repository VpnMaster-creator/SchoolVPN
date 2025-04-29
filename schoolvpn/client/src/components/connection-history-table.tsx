import { useVPN } from "@/hooks/use-vpn";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function ConnectionHistoryTable() {
  const { connectionHistory, servers } = useVPN();
  
  // Format duration in seconds to readable format
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "-";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Format data used in bytes to readable format
  const formatDataUsed = (bytes: number | null) => {
    if (bytes === null) return "-";
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };
  
  // Get server details by ID
  const getServerById = (id: number) => {
    return servers.find(server => server.id === id);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Server</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Connected At</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Used</th>
          </tr>
        </thead>
        <tbody className="bg-card/50 divide-y divide-border">
          {connectionHistory.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                No connection history available
              </td>
            </tr>
          ) : (
            connectionHistory.map(history => {
              const server = getServerById(history.serverId);
              
              return (
                <tr key={history.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {server ? (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden">
                          <img 
                            src={`https://flagcdn.com/w20/${server.countryCode.toLowerCase()}.png`} 
                            alt={`${server.country} flag`} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{server.name}, {server.country}</div>
                        </div>
                      </div>
                    ) : (
                      <Skeleton className="h-6 w-32" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">{history.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {format(new Date(history.connectedAt), 'MMM d, yyyy, h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatDuration(history.duration)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatDataUsed(history.dataUsed)}</div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
