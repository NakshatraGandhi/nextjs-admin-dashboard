"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box, Typography, Card, CardContent, Grid, CircularProgress,
  Button, Divider, Rating, Chip, Paper,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";
import { Product } from "@/store";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box>
      <Button component={Link} href="/dashboard/products" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Grid container spacing={3}>
        {/* Images */}
        <Grid item xs={12} md={5}>
          <Card>
            <Box
              component="img"
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              sx={{ width: "100%", height: 320, objectFit: "contain", p: 2, bgcolor: "#f9f9f9" }}
            />
            {/* Thumbnail strip */}
            <Box sx={{ display: "flex", gap: 1, p: 2, overflowX: "auto" }}>
              {product.images?.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setSelectedImage(i)}
                  sx={{
                    width: 64, height: 64, objectFit: "contain",
                    border: selectedImage === i ? "2px solid" : "2px solid transparent",
                    borderColor: selectedImage === i ? "primary.main" : "transparent",
                    borderRadius: 1, cursor: "pointer", bgcolor: "#f9f9f9", p: 0.5,
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Chip label={product.category} color="primary" variant="outlined" sx={{ mb: 2, textTransform: "capitalize" }} />
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Brand: <strong>{product.brand}</strong>
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">({product.rating}/5)</Typography>
              </Box>

              <Typography variant="h3" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
                ${product.price}
              </Typography>

              {product.discountPercentage > 0 && (
                <Chip label={`${product.discountPercentage}% OFF`} color="error" size="small" sx={{ mb: 2 }} />
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {[
                  { label: "Stock", value: `${product.stock} units` },
                  { label: "Category", value: product.category },
                  { label: "Brand", value: product.brand },
                  { label: "Rating", value: `${product.rating} / 5` },
                ].map((spec) => (
                  <Grid item xs={6} key={spec.label}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">{spec.label}</Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                        {spec.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
