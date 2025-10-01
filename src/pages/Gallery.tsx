import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const galleryItems = [
  {
    id: 1,
    title: "Cozy Winter Collection",
    description: "Warm scarves and mittens perfect for the cold season",
    cta: "Shop Winter Items",
  },
  {
    id: 2,
    title: "Spring Accessories",
    description: "Light and colorful bags and headbands for spring",
    cta: "Browse Accessories",
  },
  {
    id: 3,
    title: "Baby Collection",
    description: "Soft and gentle items perfect for little ones",
    cta: "Shop for Baby",
  },
  {
    id: 4,
    title: "Home Decor",
    description: "Beautiful crochet pieces to brighten your space",
    cta: "View Home Items",
  },
  {
    id: 5,
    title: "Custom Orders",
    description: "Personalized creations made just for you",
    cta: "Order Custom",
  },
  {
    id: 6,
    title: "Gift Sets",
    description: "Curated bundles perfect for gifting",
    cta: "See Gift Ideas",
  },
];

const Gallery = () => {
  const handleWhatsAppOrder = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Lookbook</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our curated collections and get inspired by our handcrafted creations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary/10">
                    {item.id}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <Button 
                  className="w-full"
                  onClick={handleWhatsAppOrder}
                >
                  {item.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instagram CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              See more of our daily creations, behind-the-scenes content, and happy customers!
            </p>
            <a 
              href="https://instagram.com/yarn_yantra" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg">
                @yarn_yantra
              </Button>
            </a>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;