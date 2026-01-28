export const calculateProfileStrength = (user) => {
  let score = 0;
  const maxScore = 100;
  const weights = {
    name: 5,
    age: 5,
    gender: 5,
    photos: 15, // Photo quality matters most
    bio: 10,
    location: 5,
    religion: 5,
    profession: 10,
    height: 5,
    interests: 10,
    hobbies: 5,
    education: 5,
    family: 5,
    verified: 5,
  };

  // Name
  if (user.name && user.name.length > 3) score += weights.name;

  // Age
  if (user.age && user.age >= 18 && user.age <= 80) score += weights.age;

  // Gender
  if (user.gender) score += weights.gender;

  // Photos
  if (user.photos && user.photos.length >= 3) {
    score += weights.photos;
  } else if (user.photos && user.photos.length >= 1) {
    score += weights.photos * 0.5;
  }

  // Bio
  if (user.bio && user.bio.length > 20) {
    score += weights.bio;
  } else if (user.bio && user.bio.length > 0) {
    score += weights.bio * 0.5;
  }

  // Location
  if (user.location && user.location.city) score += weights.location;

  // Religion
  if (user.religion) score += weights.religion;

  // Profession
  if (user.profession) score += weights.profession;

  // Height
  if (user.height) score += weights.height;

  // Interests
  if (user.interests && user.interests.length > 0) {
    score += weights.interests;
  }

  // Hobbies
  if (user.hobbies && user.hobbies.length > 0) {
    score += weights.hobbies;
  }

  // Education
  if (user.education) score += weights.education;

  // Family
  if (user.familyDetails) score += weights.family;

  // Verified
  if (user.verified) score += weights.verified;

  return Math.min(score, maxScore);
};

export const getProfileStrengthSuggestions = (user) => {
  const suggestions = [];

  if (!user.name || user.name.length < 3) {
    suggestions.push({
      field: "name",
      message: "Add a complete name for better visibility",
      impact: "+5%",
    });
  }

  if (!user.photos || user.photos.length < 3) {
    suggestions.push({
      field: "photos",
      message: "Add more clear, smiling photos (+15%)",
      impact: "+15%",
    });
  }

  if (!user.bio || user.bio.length < 20) {
    suggestions.push({
      field: "bio",
      message: "Write a detailed bio about yourself",
      impact: "+10%",
    });
  }

  if (!user.interests || user.interests.length === 0) {
    suggestions.push({
      field: "interests",
      message: "Add your interests for better matches",
      impact: "+10%",
    });
  }

  if (!user.verified) {
    suggestions.push({
      field: "verification",
      message: "Get verified to increase trust and visibility",
      impact: "+5%",
    });
  }

  if (!user.profession) {
    suggestions.push({
      field: "profession",
      message: "Tell people about your profession",
      impact: "+10%",
    });
  }

  if (!user.hobbies || user.hobbies.length === 0) {
    suggestions.push({
      field: "hobbies",
      message: "Add hobbies to find common interests",
      impact: "+5%",
    });
  }

  return suggestions;
};
