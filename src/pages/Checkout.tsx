import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    name: string;
    price: number;
    image_url: string;
    sku: string;
    stock_quantity: number;
  };
}

interface Profile {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderConfirmationId, setOrderConfirmationId] = useState("");

  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: ""
  });

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const [cartResult, profileResult] = await Promise.all([
      supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          product_id,
          products (
            name,
            price,
            image_url,
            sku,
            stock_quantity
          )
        `)
        .eq("user_id", user.id),
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    ]);

    if (cartResult.error || !cartResult.data || cartResult.data.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setCartItems(cartResult.data as CartItem[]);

    if (profileResult.data) {
      setProfile(profileResult.data);
      setShippingData({
        name: profileResult.data.full_name || "",
        phone: profileResult.data.phone || "",
        address_line_1: profileResult.data.address_line_1 || "",
        address_line_2: profileResult.data.address_line_2 || "",
        city: profileResult.data.city || "",
        state: profileResult.data.state || "",
        zip_code: profileResult.data.zip_code || ""
      });
    }

    setLoading(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleNextStep = () => {
    if (step === 1) {
      if (!shippingData.name || !shippingData.phone || !shippingData.address_line_1 || !shippingData.city || !shippingData.state || !shippingData.zip_code) {
        toast.error("Please fill in all required shipping information");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const orderNumber = `ORD-${Date.now()}`;
    const shippingAddress = `${shippingData.address_line_1}, ${shippingData.address_line_2 ? shippingData.address_line_2 + ', ' : ''}${shippingData.city}, ${shippingData.state} - ${shippingData.zip_code}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: user.id,
        order_number: orderNumber,
        total_amount: total,
        status: "pending",
        shipping_name: shippingData.name,
        shipping_phone: shippingData.phone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      }])
      .select()
      .single();

    if (orderError || !order) {
      toast.error("Failed to create order");
      setLoading(false);
      return;
    }

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products.name,
      product_sku: item.products.sku,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      toast.error("Failed to save order items");
      setLoading(false);
      return;
    }

    for (const item of cartItems) {
      await supabase
        .from("products")
        .update({
          stock_quantity: item.products.stock_quantity - item.quantity,
          sold_count: item.products.stock_quantity + item.quantity
        })
        .eq("id", item.product_id);
    }

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    setOrderConfirmationId(order.id);
    setLoading(false);
    setStep(4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Confirmation ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-mono font-bold text-primary">{orderConfirmationId}</p>
              </CardContent>
            </Card>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate("/profile")}>View Orders</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 text-center ${s <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {s}
                </div>
                <p className="text-sm">
                  {s === 1 ? 'Shipping' : s === 2 ? 'Review' : 'Payment'}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Enter your delivery address</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={shippingData.name}
                          onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={shippingData.address_line_1}
                        onChange={(e) => setShippingData({...shippingData, address_line_1: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={shippingData.address_line_2}
                        onChange={(e) => setShippingData({...shippingData, address_line_2: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input
                          id="zip"
                          value={shippingData.zip_code}
                          onChange={(e) => setShippingData({...shippingData, zip_code: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                    <CardDescription>Review your items before payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.products.name}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          <p className="font-bold">₹{item.products.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <h3 className="font-semibold mb-2">Shipping Address:</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingData.name}<br />
                        {shippingData.phone}<br />
                        {shippingData.address_line_1}<br />
                        {shippingData.address_line_2 && <>{shippingData.address_line_2}<br /></>}
                        {shippingData.city}, {shippingData.state} - {shippingData.zip_code}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select your preferred payment option</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Smartphone className="h-5 w-5" />
                          UPI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Wallet className="h-5 w-5" />
                          Wallets
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    {step > 1 && (
                      <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button onClick={handleNextStep} className="flex-1">
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={handlePlaceOrder} className="flex-1" disabled={loading}>
                        {loading ? "Processing..." : "Place Order"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;