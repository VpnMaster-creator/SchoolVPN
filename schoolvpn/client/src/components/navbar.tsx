import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Shield, User, Menu } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <nav className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">MasterVPN</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="border-b-2 border-primary text-foreground px-1 pt-1 font-medium">Dashboard</a>
              <a href="#" className="border-transparent border-b-2 hover:border-muted text-muted-foreground hover:text-foreground px-1 pt-1 font-medium">Servers</a>
              <a href="#" className="border-transparent border-b-2 hover:border-muted text-muted-foreground hover:text-foreground px-1 pt-1 font-medium">Settings</a>
              <a href="#" className="border-transparent border-b-2 hover:border-muted text-muted-foreground hover:text-foreground px-1 pt-1 font-medium">Support</a>
            </div>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted p-1 flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="ml-4 md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="bg-primary/10 text-primary block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-primary">
              Dashboard
            </a>
            <a href="#" className="text-muted-foreground hover:bg-muted hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
              Servers
            </a>
            <a href="#" className="text-muted-foreground hover:bg-muted hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
              Settings
            </a>
            <a href="#" className="text-muted-foreground hover:bg-muted hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent">
              Support
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
