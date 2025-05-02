
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="rounded-full bg-kpc-soft-purple p-6 mb-6">
          <div className="text-6xl font-bold text-kpc-purple">404</div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="bg-kpc-purple hover:bg-kpc-light-purple"
          asChild
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
