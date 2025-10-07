import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  sku: string;
  stock_quantity: number;
  sold_count: number;
  created_at: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, categoryFilter, priceFilter, sortBy]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .gt("stock_quantity", 0);

    if (data) setProducts(data);
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      if (priceFilter === "under500") result = result.filter(p => p.price < 500);
      else if (priceFilter === "500-1000") result = result.filter(p => p.price >= 500 && p.price <= 1000);
      else if (priceFilter === "over1000") result = result.filter(p => p.price > 1000);
    }

    // Sort
    if (sortBy === "popularity") {
      result.sort((a, b) => b.sold_count - a.sold_count);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Browse through our handcrafted crochet products
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Apparel">Apparel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under500">Under ₹500</SelectItem>
              <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
              <SelectItem value="over1000">Over ₹1000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-muted relative">
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
                  {product.sold_count > 10 && (
                    <Badge className="absolute top-2 right-2 bg-accent">
                      Bestseller
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                <p className="text-2xl font-bold">₹{product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button className="w-full">Buy Now</Button>
                </Link>
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Add to Cart</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found matching your filters. Try adjusting your search!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;