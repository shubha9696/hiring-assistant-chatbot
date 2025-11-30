import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import { Shield } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="fixed top-4 right-4 z-50 shadow-lg backdrop-blur-sm"
            data-testid="button-admin"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </Link>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
