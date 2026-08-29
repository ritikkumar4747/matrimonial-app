import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    gender: String,
    dob: Date,
    religion: String,
    caste: String,
    education: String,
    profession: String,
    city: String,
    state: String,
    country: String,
    about: String,
    photo: String,
    photos: [String], // Multiple photos

    // Physical Attributes
    height: String, // e.g., "5'8"
    weight: String,
    bodyType: String, // slim, average, athletic, heavy
    complexion: String, // fair, wheatish, dark

    // Professional Details
    income: String,
    workLocation: String,

    // Family Details
    familyType: String, // joint, nuclear
    familyStatus: String, // middle class, upper middle class, rich
    fatherOccupation: String,
    motherOccupation: String,
    siblings: String,

    // Lifestyle
    maritalStatus: String, // never married, divorced, widowed
    diet: String, // vegetarian, non-vegetarian, eggetarian
    smoking: String, // no, occasionally, yes
    drinking: String, // no, occasionally, yes
    hobbies: [String],

    // Partner Preferences
    partnerPreferences: {
      ageRange: { min: Number, max: Number },
      heightRange: { min: String, max: String },
      religion: [String],
      education: [String],
      profession: [String],
      incomeRange: String,
      maritalStatus: [String],
      city: [String],
      state: [String]
    },

    // Social Features
    profileViews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    lastActive: Date,
    
    isPremium: {
      type: Boolean,
      default: false
    },

    // Password Reset
    resetPasswordCode: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

// Index for search optimization
userSchema.index({ gender: 1, city: 1, religion: 1, education: 1 });
userSchema.index({ "partnerPreferences.city": 1 });

export default mongoose.model("User", userSchema);
