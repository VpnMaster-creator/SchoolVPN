import { useVPN } from "@/hooks/use-vpn";
import { ServerItem } from "./server-item";
import { Button } from "@/components/ui/button";
import { Globe, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ServerList() {
  const { servers, isLoadingServers } = useVPN();
  
  // Get recommended servers (lower ping, lower load)
  const getRecommendedServers = () => {
    return servers
      .filter(server => server.status === "available")
      .sort((a, b) => {
        // Combined score of ping and load (lower is better)
        const scoreA = a.ping * 0.7 + a.load * 0.3;
        const scoreB = b.ping * 0.7 + b.load * 0.3;
        return scoreA - scoreB;
      })
      .slice(0, 5);
  };
  
  const recommendedServers = getRecommendedServers();
  
  return (
    <div className="bg-card rounded-lg border shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recommended Servers</h2>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4 max-h-[300px] overflow-y-auto server-list">
          {isLoadingServers ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-3 rounded-full" />
              </div>
            ))
          ) : recommendedServers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No servers available
            </div>
          ) : (
            recommendedServers.map(server => (
              <ServerItem key={server.id} server={server} />
            ))
          )}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <Globe className="mr-2 h-4 w-4" />
            <span>View All Locations</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
