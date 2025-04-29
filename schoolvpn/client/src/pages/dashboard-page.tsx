import { VPNProvider } from "@/hooks/use-vpn";
import { Navbar } from "@/components/navbar";
import { WorldMap } from "@/components/ui/world-map";
import { ConnectionStats } from "@/components/connection-stats";
import { ServerList } from "@/components/server-list";
import { ConnectionHistoryTable } from "@/components/connection-history-table";

export default function DashboardPage() {
  return (
    <VPNProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Connection Status Card */}
          <ConnectionStats />
          
          {/* World Map and Servers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-card rounded-lg border shadow-lg p-6 relative overflow-hidden">
              <h2 className="text-lg font-bold mb-4">Server Locations</h2>
              <WorldMap />
            </div>
            
            {/* Server List */}
            <ServerList />
          </div>
          
          {/* Connection History */}
          <div className="mt-8 bg-card rounded-lg border shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Connection History</h2>
            <ConnectionHistoryTable />
          </div>
        </main>
      </div>
    </VPNProvider>
  );
}
