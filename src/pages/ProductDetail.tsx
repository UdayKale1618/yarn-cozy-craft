import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
    checkUser();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setProduct(data);
  };

  const loadReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles(full_name)
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    if (data) setReviews(data);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    setLoading(true);

    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (error) toast.error(error.message);
      else toast.success("Cart updated!");
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: id,
          quantity,
        });

      if (error) toast.error(error.message);
      else toast.success("Added to cart!");
    }

    setLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to leave a review");
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .insert({
        product_id: id,
        user_id: user.id,
        rating: parseInt(rating),
        comment,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("You have already reviewed this product");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Review submitted!");
      setComment("");
      loadReviews();
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-4">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-4xl font-bold mb-6">₹{product.price}</p>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-6">
              <Label className="mb-2 block">Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {product.stock_quantity} items in stock
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={loading || product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            
            {user && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select value={rating} onValueChange={setRating}>
                        <SelectTrigger id="rating">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit">Submit Review</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">
                        {review.profiles?.full_name || "Anonymous"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {reviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;