// Enhanced AI-based matching algorithm
export const calculateMatchScore = (me, other) => {
  let score = 0;
  let maxScore = 0;

  // 1. Religion Match (25 points)
  maxScore += 25;
  if (me.religion && other.religion) {
    if (me.religion === other.religion) score += 25;
    else if (me.partnerPreferences?.religion?.includes(other.religion)) score += 15;
  }

  // 2. Location Match (20 points)
  maxScore += 20;
  if (me.city && other.city) {
    if (me.city === other.city) score += 20;
    else if (me.state === other.state) score += 10;
    else if (me.partnerPreferences?.city?.includes(other.city)) score += 15;
  }

  // 3. Education Match (15 points)
  maxScore += 15;
  if (me.education && other.education) {
    if (me.education === other.education) score += 15;
    else if (me.partnerPreferences?.education?.includes(other.education)) score += 12;
    else {
      const educationLevels = {
        "High School": 1,
        "Bachelor's": 2,
        "Master's": 3,
        "PhD": 4
      };
      const myLevel = educationLevels[me.education] || 0;
      const otherLevel = educationLevels[other.education] || 0;
      if (Math.abs(myLevel - otherLevel) <= 1) score += 8;
    }
  }

  // 4. Age Compatibility (20 points)
  maxScore += 20;
  if (me.dob && other.dob) {
    const myAge = new Date().getFullYear() - new Date(me.dob).getFullYear();
    const otherAge = new Date().getFullYear() - new Date(other.dob).getFullYear();
    const ageDiff = Math.abs(myAge - otherAge);

    // Check partner preference
    if (me.partnerPreferences?.ageRange) {
      const { min, max } = me.partnerPreferences.ageRange;
      if (otherAge >= min && otherAge <= max) {
        score += 20;
      } else if (otherAge >= min - 2 && otherAge <= max + 2) {
        score += 12;
      } else {
        score += 5;
      }
    } else {
      // Default age scoring
      if (ageDiff <= 2) score += 20;
      else if (ageDiff <= 5) score += 15;
      else if (ageDiff <= 8) score += 8;
      else score += 3;
    }
  }

  // 5. Profession Match (10 points)
  maxScore += 10;
  if (me.profession && other.profession) {
    if (me.profession === other.profession) score += 10;
    else if (me.partnerPreferences?.profession?.includes(other.profession)) score += 8;
  }

  // 6. Lifestyle Match (10 points)
  maxScore += 10;
  let lifestyleMatch = 0;
  let lifestyleChecks = 0;

  if (me.diet && other.diet) {
    lifestyleChecks++;
    if (me.diet === other.diet) lifestyleMatch++;
  }
  if (me.smoking && other.smoking) {
    lifestyleChecks++;
    if (me.smoking === other.smoking) lifestyleMatch++;
  }
  if (me.drinking && other.drinking) {
    lifestyleChecks++;
    if (me.drinking === other.drinking) lifestyleMatch++;
  }
  
  if (lifestyleChecks > 0) {
    score += (lifestyleMatch / lifestyleChecks) * 10;
  }

  // 7. Hobbies/Interests Match (Bonus 5 points)
  if (me.hobbies?.length && other.hobbies?.length) {
    const commonHobbies = me.hobbies.filter(h => other.hobbies.includes(h));
    if (commonHobbies.length > 0) {
      score += Math.min(5, commonHobbies.length * 2);
    }
  }

  // Normalize to 100
  const normalizedScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  return Math.round(normalizedScore);
};

export const getMatchLabel = (score) => {
  if (score >= 85) return "Perfect Match";
  if (score >= 70) return "Highly Compatible";
  if (score >= 55) return "Good Match";
  if (score >= 40) return "Average Match";
  return "Low Match";
};

// Get compatibility percentage
export const getCompatibilityPercentage = (score) => {
  return `${score}%`;
};

// Get detailed match breakdown
export const getMatchBreakdown = (me, other) => {
  const breakdown = {
    religion: 0,
    location: 0,
    education: 0,
    age: 0,
    profession: 0,
    lifestyle: 0
  };

  // Religion
  if (me.religion === other.religion) breakdown.religion = 100;
  
  // Location
  if (me.city === other.city) breakdown.location = 100;
  else if (me.state === other.state) breakdown.location = 50;
  
  // Education
  if (me.education === other.education) breakdown.education = 100;
  
  // Age
  if (me.dob && other.dob) {
    const ageDiff = Math.abs(
      new Date().getFullYear() - new Date(me.dob).getFullYear() -
      (new Date().getFullYear() - new Date(other.dob).getFullYear())
    );
    if (ageDiff <= 2) breakdown.age = 100;
    else if (ageDiff <= 5) breakdown.age = 75;
    else if (ageDiff <= 8) breakdown.age = 40;
  }
  
  // Profession
  if (me.profession === other.profession) breakdown.profession = 100;
  
  // Lifestyle
  let lifestyleScore = 0;
  let checks = 0;
  if (me.diet === other.diet) { lifestyleScore += 33; checks++; }
  if (me.smoking === other.smoking) { lifestyleScore += 33; checks++; }
  if (me.drinking === other.drinking) { lifestyleScore += 34; checks++; }
  breakdown.lifestyle = checks > 0 ? lifestyleScore : 0;

  return breakdown;
};
