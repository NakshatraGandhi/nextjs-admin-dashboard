"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, TextField, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Avatar,
  Pagination, Chip, IconButton, CircularProgress, Card,
} from "@mui/material";
import { Search, Visibility } from "@mui/icons-material";
import Link from "next/link";
import { useUsersStore } from "@/store";

export default function UsersPage() {
  const { users, totalUsers, usersPage, fetchUsers } = useUsersStore();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (page: number, q: string) => {
      setLoading(true);
      await fetchUsers(page, q);
      setLoading(false);
    },
    [fetchUsers]
  );

  useEffect(() => {
    load(1, debouncedSearch);
  }, [debouncedSearch, load]);

  const totalPages = Math.ceil(totalUsers / 10);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {totalUsers} total users
      </Typography>

      {/* Search */}
      <Card sx={{ p: 2, mb: 3 }}>
        <TextField
          placeholder="Search users by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                {["User", "Email", "Gender", "Phone", "Company"].map((h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: 700 }}>
                    {h}
                  </TableCell>
                ))}
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, i) => (
                <TableRow
                  key={user.id}
                  sx={{ bgcolor: i % 2 === 0 ? "background.paper" : "grey.50", "&:hover": { bgcolor: "primary.50" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar src={user.image} alt={user.firstName} sx={{ width: 36, height: 36 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.gender}
                      size="small"
                      color={user.gender === "male" ? "info" : "secondary"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.company?.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton component={Link} href={`/dashboard/users/${user.id}`} color="primary" size="small">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={usersPage}
            onChange={(_, p) => load(p, debouncedSearch)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
