const adminRoutes = require("./routes/adminRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);
