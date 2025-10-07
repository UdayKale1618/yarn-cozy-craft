import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import all product images
import seaTurtle from "@/assets/crochet-sea-turtle.jpg";
import tulipBouquet from "@/assets/crochet-tulip-bouquet.jpg";
import mushroomShrug from "@/assets/mushroom-sleeve-shrug.jpg";
import bucketHat from "@/assets/crochet-bucket-hat.jpg";
import loveBirds from "@/assets/amigurumi-love-birds.jpg";
import lion from "@/assets/amigurumi-lion.jpg";
import spideyKeychain from "@/assets/spidey-keychain.jpg";
import bookmark from "@/assets/crochet-bookmark.jpg";

const imageMap: Record<string, string> = {
  "crochet-sea-turtle.jpg": seaTurtle,
  "crochet-tulip-bouquet.jpg": tulipBouquet,
  "mushroom-sleeve-shrug.jpg": mushroomShrug,
  "crochet-bucket-hat.jpg": bucketHat,
  "amigurumi-love-birds.jpg": loveBirds,
  "amigurumi-lion.jpg": lion,
  "spidey-keychain.jpg": spideyKeychain,
  "crochet-bookmark.jpg": bookmark,
};

export default function MigrateImages() {
  const [migrating, setMigrating] = useState(false);

  const migrateImages = async () => {
    setMigrating(true);
    try {
      // Get all products
      const { data: products, error: fetchError } = await supabase
        .from("products")
        .select("id, name, image_url");

      if (fetchError) throw fetchError;

      for (const product of products || []) {
        if (!product.image_url) continue;

        // Extract filename from path
        const filename = product.image_url.split("/").pop();
        if (!filename || !imageMap[filename]) continue;

        // Fetch the image as a blob
        const response = await fetch(imageMap[filename]);
        const blob = await response.blob();

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, blob, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Error uploading ${filename}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);

        // Update product with new URL
        const { error: updateError } = await supabase
          .from("products")
          .update({ image_url: publicUrl })
          .eq("id", product.id);

        if (updateError) {
          console.error(`Error updating product ${product.name}:`, updateError);
        }
      }

      toast.success("Images migrated successfully!");
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to migrate images");
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Migrate Product Images</h1>
        <p className="text-muted-foreground">
          Click the button below to upload product images to storage and update the database.
        </p>
        <Button onClick={migrateImages} disabled={migrating}>
          {migrating ? "Migrating..." : "Migrate Images"}
        </Button>
      </div>
    </div>
  );
}
