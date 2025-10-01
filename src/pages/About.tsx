import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
          <div className="container text-center">
            <h1 className="text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Welcome to Yarn_yantra, where every stitch tells a story of passion, creativity, and craftsmanship.
            </p>
          </div>
        </section>

        {/* Main Story */}
        <section className="container py-16">
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
            <p>
              Yarn_yantra was born from a love of crochet and a desire to share the joy of handmade creations 
              with the world. What started as a hobby in a small corner of our home has blossomed into a 
              thriving business that brings happiness to customers across the country.
            </p>
            <p>
              Every piece we create is made with carefully selected yarn and meticulous attention to detail. 
              We believe that handmade items carry a special warmth and character that mass-produced goods 
              simply can't match. Each product is a labor of love, crafted to bring comfort, beauty, and 
              functionality to your life.
            </p>
            <p>
              Our journey is guided by three core values: quality craftsmanship, sustainable practices, and 
              customer satisfaction. We're not just selling products – we're creating lasting memories and 
              connections through the art of crochet.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Made with Love</h3>
                  <p className="text-muted-foreground">
                    Every piece is handcrafted with care and attention to detail, ensuring quality in every stitch.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Unique Designs</h3>
                  <p className="text-muted-foreground">
                    Our creations are one-of-a-kind, combining traditional techniques with modern aesthetics.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Community First</h3>
                  <p className="text-muted-foreground">
                    We're building a community of crochet lovers and supporting local artisans.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Journey
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                Follow us on Instagram to see our latest creations, behind-the-scenes moments, 
                and become part of our growing community!
              </p>
              <a 
                href="https://instagram.com/yarn_yantra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Follow @yarn_yantra
                </button>
              </a>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;