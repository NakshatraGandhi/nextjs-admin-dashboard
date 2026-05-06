"use client";
import { useEffect, useState, useCallback, memo } from "react";
import {
  Box, Typography, TextField, InputAdornment, Grid, Card, CardContent,
  CardMedia, CardActions, Button, Pagination, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, Rating, Chip,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Link from "next/link";
import { useProductsStore } from "@/store";

// React.memo to avoid re-rendering unchanged product cards
const ProductCard = memo(({ product }: { product: any }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", "&:hover": { transform: "translateY(-4px)", transition: "transform 0.2s", boxShadow: 6 } }}>
    <CardMedia
      component="img"
      height="180"
      image={product.thumbnail}
      alt={product.title}
      sx={{ objectFit: "contain", p: 1, bgcolor: "#f9f9f9" }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Chip label={product.category} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
      <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
        {product.title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Rating value={product.rating} precision={0.1} size="small" readOnly />
        <Typography variant="caption" color="text.secondary">({product.rating})</Typography>
      </Box>
      <Typography variant="h6" color="primary.main" fontWeight={700}>
        ${product.price}
      </Typography>
    </CardContent>
    <CardActions>
      <Button component={Link} href={`/dashboard/products/${product.id}`} size="small" variant="contained" fullWidth>
        View Details
      </Button>
    </CardActions>
  </Card>
));
ProductCard.displayName = "ProductCard";

export default function ProductsPage() {
  const { products, totalProducts, productsPage, categories, fetchProducts, fetchCategories } = useProductsStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const load = useCallback(
    async (page: number, q: string, cat: string) => {
      setLoading(true);
      await fetchProducts(page, q, cat);
      setLoading(false);
    },
    [fetchProducts]
  );

  useEffect(() => {
    load(1, debouncedSearch, category);
  }, [debouncedSearch, category, load]);

  const totalPages = Math.ceil(totalProducts / 12);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {totalProducts} total products
      </Typography>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ textTransform: "capitalize" }}>
                    {cat.replace(/-/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={productsPage}
            onChange={(_, p) => load(p, debouncedSearch, category)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
