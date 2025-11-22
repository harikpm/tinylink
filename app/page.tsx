"use client";

import React, { useEffect, useState, FormEvent } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  TableContainer,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Link = {
  code: string;
  totalClicks: number;
  targetUrl: string;
};

export default function Page() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [editing, setEditing] = useState<Link | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [creating, setCreating] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };

  async function load() {
    const res = await fetch("/api/links");
    setLinks(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setCreating(true);
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code }),
      });

      if (!res.ok) {
        const err = await res.json();
        showSnackbar(err.error || "Failed to create link", "error");
        return;
      }

      showSnackbar("Short link created!", "success");
      setUrl("");
      setCode("");
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(c: string) {
    const res = await fetch(`/api/links/${c}`, { method: "DELETE" });

    if (!res.ok) {
      showSnackbar("Failed to delete link", "error");
      return;
    }

    await load();
    showSnackbar("Link deleted successfully", "success");
  }

  async function openShort(link: Link) {
    await fetch(`/api/links/${link.code}`, { method: "POST" });
    window.open(link.targetUrl, "_blank");
    await load();
  }

  function viewStats(c: string) {
    window.location.href = `/code/${c}`;
  }

  function startEdit(link: Link) {
    setEditing(link);
    setEditUrl(link.targetUrl);
    setEditCode(link.code);
    setEditError("");
  }

  async function handleSaveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    setSavingEdit(true);
    setEditError("");

    const res = await fetch(`/api/links/${editing.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: editUrl, code: editCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      setEditError(data.error || "Failed to update");
      showSnackbar(data.error || "Failed to Update", "error");
      setSavingEdit(false);
      return;
    }

    setSavingEdit(false);
    setEditing(null);
    await load();
    showSnackbar("Link updated successfully!", "success");
  }

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6", py: 6 }}>
        <Container maxWidth="md">
          <Stack spacing={1} mb={4}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ fontSize: 12, color: "text.secondary" }}
            >
              <LinkIcon fontSize="small" />
              <Typography variant="body2">URL shortener dashboard</Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "flex-end" }}
              spacing={1}
            >
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Short links
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create, manage and track your short URLs.
                </Typography>
              </Box>

              {links.length > 0 && (
                <Chip
                  label={`${links.length} links active`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>

          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleCreate}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AddIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Create a new short link
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ md: "flex-end" }}
                >
                  <TextField
                    label="Destination URL"
                    size="small"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very/long/link"
                  />

                  <TextField
                    label="Custom code"
                    size="small"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="my-custom"
                    sx={{ minWidth: { md: 180 } }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={!url.trim() || creating}
                    sx={{
                      whiteSpace: "nowrap",
                      px: 3,
                      borderRadius: "10px",
                      mt: { xs: 1, md: 0 },
                      alignSelf: { md: "flex-start" },
                    }}
                  >
                    {creating ? "Creating..." : "Shorten"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>

          <Paper elevation={1} sx={{ mb: 3 }}>
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2">Your links</Typography>
              <Typography variant="caption" color="text.secondary">
                Click a code to open the URL
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {links.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="caption" color="text.secondary">
                          No links yet. Create your first one above.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {links.map((l) => (
                    <TableRow key={l.code} hover>
                      <TableCell>
                        <Chip
                          label={l.code}
                          size="small"
                          onClick={() => openShort(l)}
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>

                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          title={l.targetUrl}
                        >
                          {l.targetUrl}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">{l.totalClicks}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => viewStats(l.code)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => startEdit(l)}
                          sx={{ ml: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(l.code)}
                          sx={{ ml: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {editing && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <form onSubmit={handleSaveEdit}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">Edit link</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current code: <code>{editing.code}</code>
                    </Typography>
                  </Box>

                  <Divider />

                  <TextField
                    label="Target URL"
                    size="small"
                    fullWidth
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />

                  <TextField
                    label="Custom code"
                    size="small"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    placeholder="my-custom"
                    sx={{ maxWidth: 260 }}
                  />

                  {editError && (
                    <Typography variant="caption" color="error">
                      {editError}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={savingEdit}
                      sx={{
                        borderRadius: "10px",
                        px: 3,
                      }}
                    >
                      {savingEdit ? "Saving..." : "Save"}
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setEditing(null)}
                      sx={{
                        borderRadius: "10px",
                        px: 3,
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Paper>
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
