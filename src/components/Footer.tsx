import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <footer className="border-t bg-muted/30 mt-16">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Yarn_yantra</h3>
              <p className="text-sm text-muted-foreground">
                Handmade crochet creations with love and care. Every piece tells a story.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <button onClick={handleWhatsAppClick} className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with our latest creations and behind-the-scenes moments!
              </p>
              <a 
                href="https://www.instagram.com/yarn_yantra/" 
                target="_blank"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                @yarn_yantra on Instagram
              </a>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Yarn_yantra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};