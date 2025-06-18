const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // ⬅️ this hides password by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });


// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   console.log("✅ Password hashed:", this.password);
//   next();
// });
userSchema.pre("save", async function (next) {
  console.log("📌 Inside pre-save hook");

  if (!this.isModified("password")) {
    console.log("⚠️ Password not modified — skipping hash");
    return next();
  }

  console.log("🔐 Password IS modified, hashing now...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("✅ Password hashed:", this.password);

  next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
  console.log("Comparing:", candidatePassword, "with:", this.password);
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
