import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  sku: string;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(4);

    if (data) setFeaturedProducts(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src={heroImage} 
            alt="Handmade crochet products" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
          
          <div className="relative z-10 container text-center md:text-left max-w-2xl">
            <Badge className="mb-4 text-base px-4 py-1">Handcrafted with Love</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Discover Unique Crochet Creations
            </h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-xl">
              From cozy accessories to beautiful apparel, each piece is lovingly handmade just for you.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button size="lg" className="text-lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="text-lg">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Bestsellers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Customer favorites, handpicked for their beauty and quality
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-2xl font-bold">₹{product.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link to={`/product/${product.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No featured products yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Instagram Section */}
        <section className="bg-muted/30 py-16">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4">Follow Our Journey</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              See our latest creations, behind-the-scenes moments, and happy customers on Instagram
            </p>
            <a 
              href="https://www.instagram.com/yarn_yantra/" 
              target="_blank"
            >
              <Button size="lg" variant="default">
                Follow @yarn_yantra on Instagram
              </Button>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                We love custom orders! Chat with us on WhatsApp to bring your crochet dreams to life.
              </p>
              <Button 
                size="lg" 
                onClick={() => window.open("https://wa.me/1234567890", "_blank")}
              >
                Chat with Us
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;