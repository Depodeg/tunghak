
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-sigma-primary text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">SIGMA Flight Prep</h1>
        </div>
        <div className="text-sm">miniSIGMA БЛА</div>
      </div>
    </header>
  );
};

export default Header;
