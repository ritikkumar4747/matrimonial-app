import User from "../models/User.js";
import ProfileView from "../models/ProfileView.js";
import { calculateMatchScore, getMatchLabel, getMatchBreakdown } from "../utils/matchscore.js";

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProfile = (req, res) => {
  res.json(req.user);
};

export const getAllProfiles = async (req, res) => {
  try {
    const { 
      gender, 
      religion, 
      city, 
      state,
      education,
      minAge, 
      maxAge,
      maritalStatus,
      profession,
      diet,
      minHeight,
      maxHeight,
      sortBy = 'matchScore', // matchScore, recent, views
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query
    const filter = { _id: { $ne: req.user._id } };

    if (gender) filter.gender = gender;
    if (religion) filter.religion = religion;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (education) filter.education = education;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    if (profession) filter.profession = profession;
    if (diet) filter.diet = diet;
    
    // Age filter
    if (minAge || maxAge) {
      filter.dob = {};
      const currentYear = new Date().getFullYear();
      if (maxAge) filter.dob.$gte = new Date(`${currentYear - maxAge}-01-01`);
      if (minAge) filter.dob.$lte = new Date(`${currentYear - minAge}-12-31`);
    }

    // Height filter (needs custom logic)
    if (minHeight) filter.height = { $gte: minHeight };
    if (maxHeight) filter.height = { ...filter.height, $lte: maxHeight };

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Calculate match scores
    const enrichedUsers = users.map(u => {
      const score = calculateMatchScore(req.user, u);
      const breakdown = getMatchBreakdown(req.user, u);
      return {
        ...u.toObject(),
        matchScore: score,
        matchLabel: getMatchLabel(score),
        matchBreakdown: breakdown
      };
    });

    // Sort results
    let sortedUsers = enrichedUsers;
    if (sortBy === 'matchScore') {
      sortedUsers.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'recent') {
      sortedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'views') {
      sortedUsers.sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0));
    }

    const total = await User.countDocuments(filter);

    res.json({
      users: sortedUsers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cloudinary returns the secure URL in req.file.path
    req.user.photo = req.file.path;
    await req.user.save();
    
    res.json({ 
      photo: req.user.photo,
      secure_url: req.file.path,
      public_id: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Track profile view
    const existingView = await ProfileView.findOne({
      viewer: req.user._id,
      viewed: userId
    });

    if (!existingView) {
      await ProfileView.create({
        viewer: req.user._id,
        viewed: userId
      });
      
      // Increment view count
      user.profileViews = (user.profileViews || 0) + 1;
      await user.save();
    }

    // Calculate match score
    const score = calculateMatchScore(req.user, user);
    const breakdown = getMatchBreakdown(req.user, user);

    res.json({
      ...user.toObject(),
      matchScore: score,
      matchLabel: getMatchLabel(score),
      matchBreakdown: breakdown
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users who viewed my profile
export const getProfileViewers = async (req, res) => {
  try {
    const views = await ProfileView.find({ viewed: req.user._id })
      .populate("viewer", "name age city profession photo")
      .sort({ viewedAt: -1 })
      .limit(50);

    res.json(views);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search users by name or profession
export const searchUsers = async (req, res) => {
  try {
    const { query, gender } = req.query;
    
    if (!query) return res.status(400).json({ message: "Search query required" });

    const searchFilter = {
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { profession: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } }
      ]
    };

    if (gender) searchFilter.gender = gender;

    const users = await User.find(searchFilter)
      .select("-password")
      .limit(20);

    const enrichedUsers = users.map(u => {
      const score = calculateMatchScore(req.user, u);
      return {
        ...u.toObject(),
        matchScore: score,
        matchLabel: getMatchLabel(score)
      };
    });

    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recommended matches based on preferences
export const getRecommendedMatches = async (req, res) => {
  try {
    const preferences = req.user.partnerPreferences || {};
    
    const filter = { 
      _id: { $ne: req.user._id },
      gender: { $ne: req.user.gender } // Opposite gender
    };

    // Apply preference filters
    if (preferences.religion?.length) {
      filter.religion = { $in: preferences.religion };
    }
    if (preferences.education?.length) {
      filter.education = { $in: preferences.education };
    }
    if (preferences.city?.length) {
      filter.city = { $in: preferences.city };
    }
    if (preferences.maritalStatus?.length) {
      filter.maritalStatus = { $in: preferences.maritalStatus };
    }

    // Age range filter
    if (preferences.ageRange?.min || preferences.ageRange?.max) {
      filter.dob = {};
      const currentYear = new Date().getFullYear();
      if (preferences.ageRange.max) {
        filter.dob.$gte = new Date(`${currentYear - preferences.ageRange.max}-01-01`);
      }
      if (preferences.ageRange.min) {
        filter.dob.$lte = new Date(`${currentYear - preferences.ageRange.min}-12-31`);
      }
    }

    const users = await User.find(filter)
      .select("-password")
      .limit(50);

    // Calculate and sort by match score
    const enrichedUsers = users.map(u => {
      const score = calculateMatchScore(req.user, u);
      const breakdown = getMatchBreakdown(req.user, u);
      return {
        ...u.toObject(),
        matchScore: score,
        matchLabel: getMatchLabel(score),
        matchBreakdown: breakdown
      };
    });

    // Sort by match score (highest first)
    enrichedUsers.sort((a, b) => b.matchScore - a.matchScore);

    res.json(enrichedUsers.slice(0, 20)); // Top 20 matches
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile statistics
export const getProfileStats = async (req, res) => {
  try {
    const viewsCount = await ProfileView.countDocuments({ viewed: req.user._id });
    const viewersCount = await ProfileView.distinct("viewer", { viewed: req.user._id });
    
    res.json({
      totalViews: viewsCount,
      uniqueViewers: viewersCount.length,
      profileViews: req.user.profileViews || 0,
      profileCompleteness: calculateProfileCompleteness(req.user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function to calculate profile completeness
const calculateProfileCompleteness = (user) => {
  const fields = [
    'name', 'email', 'gender', 'dob', 'religion', 'education', 
    'profession', 'city', 'about', 'photo', 'height', 'maritalStatus'
  ];
  
  const filledFields = fields.filter(field => user[field]).length;
  return Math.round((filledFields / fields.length) * 100);
};
