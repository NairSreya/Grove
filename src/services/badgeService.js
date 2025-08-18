// Badge Service for Grove Wellness App
// Implements comprehensive gamified badge system with nature-inspired achievements

class BadgeService {
  constructor() {
    this.badges = this.initializeBadges();
    this.activityTypes = [
      'meditation', 'reading', 'writing', 'walk', 'yoga', 'music', 
      'bath', 'art', 'learning', 'social', 'reflection', 'exercise'
    ];
  }

  // Initialize all badge definitions
  initializeBadges() {
    return {
      // 🌱 First Steps Collection (Discovery Badges)
      firstSteps: {
        'seedling-reader': {
          id: 'seedling-reader',
          name: 'Seedling Reader',
          description: 'First reading session (any duration)',
          category: 'firstSteps',
          rarity: 'common',
          icon: '📚',
          color: 'from-emerald-500 to-green-600',
          requirement: { type: 'firstActivity', activityType: 'reading' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'ink-sprout': {
          id: 'ink-sprout',
          name: 'Ink Sprout',
          description: 'First writing/journaling session',
          category: 'firstSteps',
          rarity: 'common',
          icon: '✍️',
          color: 'from-blue-500 to-indigo-600',
          requirement: { type: 'firstActivity', activityType: 'writing' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'breath-bud': {
          id: 'breath-bud',
          name: 'Breath Bud',
          description: 'First meditation session',
          category: 'firstSteps',
          rarity: 'common',
          icon: '🧘',
          color: 'from-purple-500 to-violet-600',
          requirement: { type: 'firstActivity', activityType: 'meditation' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'movement-stem': {
          id: 'movement-stem',
          name: 'Movement Stem',
          description: 'First physical activity (yoga, walk, exercise)',
          category: 'firstSteps',
          rarity: 'common',
          icon: '🚶',
          color: 'from-orange-500 to-red-600',
          requirement: { type: 'firstActivity', activityType: ['walk', 'yoga', 'exercise'] },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'mindful-sapling': {
          id: 'mindful-sapling',
          name: 'Mindful Sapling',
          description: 'First mindfulness/reflection activity',
          category: 'firstSteps',
          rarity: 'common',
          icon: '🌱',
          color: 'from-teal-500 to-cyan-600',
          requirement: { type: 'firstActivity', activityType: 'reflection' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'creative-bloom': {
          id: 'creative-bloom',
          name: 'Creative Bloom',
          description: 'First creative activity (art, music, crafts)',
          category: 'firstSteps',
          rarity: 'common',
          icon: '🎨',
          color: 'from-pink-500 to-rose-600',
          requirement: { type: 'firstActivity', activityType: ['art', 'music'] },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'knowledge-root': {
          id: 'knowledge-root',
          name: 'Knowledge Root',
          description: 'First learning session (course, tutorial, skill practice)',
          category: 'firstSteps',
          rarity: 'common',
          icon: '📖',
          color: 'from-amber-500 to-yellow-600',
          requirement: { type: 'firstActivity', activityType: 'learning' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        'social-branch': {
          id: 'social-branch',
          name: 'Social Branch',
          description: 'First social wellness activity (connecting with friends/family)',
          category: 'firstSteps',
          rarity: 'common',
          icon: '🤝',
          color: 'from-lime-500 to-green-600',
          requirement: { type: 'firstActivity', activityType: 'social' },
          unlocked: false,
          progress: 0,
          maxProgress: 1
        }
      },

      // 🏆 Milestone Badges (Activity Count Based)
      milestones: {
        'grove-explorer': {
          id: 'grove-explorer',
          name: 'Grove Explorer',
          description: 'Complete 3 activities - A small tree with 3 leaves',
          category: 'milestones',
          rarity: 'common',
          icon: '🌳',
          color: 'from-emerald-500 to-green-600',
          requirement: { type: 'totalActivities', count: 3 },
          unlocked: false,
          progress: 0,
          maxProgress: 3
        },
        'wellness-wanderer': {
          id: 'wellness-wanderer',
          name: 'Wellness Wanderer',
          description: 'Complete 5 activities - A growing plant with roots',
          category: 'milestones',
          rarity: 'uncommon',
          icon: '🌿',
          color: 'from-blue-500 to-indigo-600',
          requirement: { type: 'totalActivities', count: 5 },
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        'mindful-gardner': {
          id: 'mindful-gardner',
          name: 'Mindful Gardner',
          description: 'Complete 10 activities - A flourishing plant with flowers',
          category: 'milestones',
          rarity: 'uncommon',
          icon: '🌸',
          color: 'from-purple-500 to-violet-600',
          requirement: { type: 'totalActivities', count: 10 },
          unlocked: false,
          progress: 0,
          maxProgress: 10
        },
        'growth-seeker': {
          id: 'growth-seeker',
          name: 'Growth Seeker',
          description: 'Complete 15 activities - A young tree with birds',
          category: 'milestones',
          rarity: 'rare',
          icon: '🐦',
          color: 'from-orange-500 to-red-600',
          requirement: { type: 'totalActivities', count: 15 },
          unlocked: false,
          progress: 0,
          maxProgress: 15
        },
        'habit-harvester': {
          id: 'habit-harvester',
          name: 'Habit Harvester',
          description: 'Complete 25 activities - A fruit-bearing tree',
          category: 'milestones',
          rarity: 'rare',
          icon: '🍎',
          color: 'from-amber-500 to-yellow-600',
          requirement: { type: 'totalActivities', count: 25 },
          unlocked: false,
          progress: 0,
          maxProgress: 25
        },
        'wellness-warrior': {
          id: 'wellness-warrior',
          name: 'Wellness Warrior',
          description: 'Complete 50 activities - A strong oak tree',
          category: 'milestones',
          rarity: 'epic',
          icon: '🦾',
          color: 'from-red-500 to-pink-600',
          requirement: { type: 'totalActivities', count: 50 },
          unlocked: false,
          progress: 0,
          maxProgress: 50
        },
        'grove-guardian': {
          id: 'grove-guardian',
          name: 'Grove Guardian',
          description: 'Complete 75 activities - A tree with a treehouse',
          category: 'milestones',
          rarity: 'epic',
          icon: '🏠',
          color: 'from-indigo-500 to-purple-600',
          requirement: { type: 'totalActivities', count: 75 },
          unlocked: false,
          progress: 0,
          maxProgress: 75
        },
        'natures-sage': {
          id: 'natures-sage',
          name: "Nature's Sage",
          description: 'Complete 100 activities - An ancient tree with wisdom symbols',
          category: 'milestones',
          rarity: 'legendary',
          icon: '🧙',
          color: 'from-yellow-500 to-amber-600',
          requirement: { type: 'totalActivities', count: 100 },
          unlocked: false,
          progress: 0,
          maxProgress: 100
        }
      },

      // 🔥 Streak Badges (Consistency Rewards)
      streaks: {
        'consistent-sprout': {
          id: 'consistent-sprout',
          name: 'Consistent Sprout',
          description: 'Maintain a 3-day activity streak',
          category: 'streaks',
          rarity: 'common',
          icon: '🌱',
          color: 'from-emerald-500 to-green-600',
          requirement: { type: 'streak', days: 3 },
          unlocked: false,
          progress: 0,
          maxProgress: 3
        },
        'weekly-warrior': {
          id: 'weekly-warrior',
          name: 'Weekly Warrior',
          description: 'Maintain a 7-day activity streak',
          category: 'streaks',
          rarity: 'uncommon',
          icon: '⚔️',
          color: 'from-blue-500 to-indigo-600',
          requirement: { type: 'streak', days: 7 },
          unlocked: false,
          progress: 0,
          maxProgress: 7
        },
        'fortnight-flora': {
          id: 'fortnight-flora',
          name: 'Fortnight Flora',
          description: 'Maintain a 14-day activity streak',
          category: 'streaks',
          rarity: 'rare',
          icon: '🌺',
          color: 'from-purple-500 to-violet-600',
          requirement: { type: 'streak', days: 14 },
          unlocked: false,
          progress: 0,
          maxProgress: 14
        },
        'monthly-master': {
          id: 'monthly-master',
          name: 'Monthly Master',
          description: 'Maintain a 30-day activity streak',
          category: 'streaks',
          rarity: 'epic',
          icon: '👑',
          color: 'from-orange-500 to-red-600',
          requirement: { type: 'streak', days: 30 },
          unlocked: false,
          progress: 0,
          maxProgress: 30
        },
        'seasonal-sage': {
          id: 'seasonal-sage',
          name: 'Seasonal Sage',
          description: 'Maintain a 90-day activity streak',
          category: 'streaks',
          rarity: 'legendary',
          icon: '🌍',
          color: 'from-yellow-500 to-amber-600',
          requirement: { type: 'streak', days: 90 },
          unlocked: false,
          progress: 0,
          maxProgress: 90
        }
      },

      // ⭐ Special Achievement Badges
      special: {
        'variety-virtuoso': {
          id: 'variety-virtuoso',
          name: 'Variety Virtuoso',
          description: 'Complete 5 different activity types',
          category: 'special',
          rarity: 'uncommon',
          icon: '🎯',
          color: 'from-teal-500 to-cyan-600',
          requirement: { type: 'uniqueActivities', count: 5 },
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        'time-keeper': {
          id: 'time-keeper',
          name: 'Time Keeper',
          description: 'Log 5 hours total across all activities',
          category: 'special',
          rarity: 'uncommon',
          icon: '⏰',
          color: 'from-blue-500 to-indigo-600',
          requirement: { type: 'totalTime', minutes: 300 },
          unlocked: false,
          progress: 0,
          maxProgress: 300
        },
        'early-bird': {
          id: 'early-bird',
          name: 'Early Bird',
          description: 'Complete 5 morning activities (before 10 AM)',
          category: 'special',
          rarity: 'rare',
          icon: '🌅',
          color: 'from-orange-500 to-yellow-600',
          requirement: { type: 'morningActivities', count: 5 },
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        'night-owl': {
          id: 'night-owl',
          name: 'Night Owl',
          description: 'Complete 5 evening activities (after 8 PM)',
          category: 'special',
          rarity: 'rare',
          icon: '🦉',
          color: 'from-indigo-500 to-purple-600',
          requirement: { type: 'eveningActivities', count: 5 },
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        'marathon-mind': {
          id: 'marathon-mind',
          name: 'Marathon Mind',
          description: 'Complete a single session lasting 60+ minutes',
          category: 'special',
          rarity: 'epic',
          icon: '🏃',
          color: 'from-red-500 to-pink-600',
          requirement: { type: 'longSession', minutes: 60 },
          unlocked: false,
          progress: 0,
          maxProgress: 60
        },
        'quick-refresher': {
          id: 'quick-refresher',
          name: 'Quick Refresher',
          description: 'Complete 10 sessions under 10 minutes',
          category: 'special',
          rarity: 'uncommon',
          icon: '⚡',
          color: 'from-green-500 to-emerald-600',
          requirement: { type: 'shortSessions', count: 10, maxMinutes: 10 },
          unlocked: false,
          progress: 0,
          maxProgress: 10
        },
        'weekend-warrior': {
          id: 'weekend-warrior',
          name: 'Weekend Warrior',
          description: 'Complete activities on 4 consecutive weekends',
          category: 'special',
          rarity: 'epic',
          icon: '🏆',
          color: 'from-amber-500 to-orange-600',
          requirement: { type: 'weekendStreak', count: 4 },
          unlocked: false,
          progress: 0,
          maxProgress: 4
        }
      },

      // 🎯 Challenge Badges (Seasonal/Themed)
      challenges: {
        'meditation-march': {
          id: 'meditation-march',
          name: 'Meditation March',
          description: 'Complete 15 meditation sessions in March',
          category: 'challenges',
          rarity: 'rare',
          icon: '🧘',
          color: 'from-purple-500 to-violet-600',
          requirement: { type: 'monthlyActivity', activityType: 'meditation', count: 15, month: 2 },
          unlocked: false,
          progress: 0,
          maxProgress: 15,
          seasonal: true,
          month: 2
        },
        'april-awareness': {
          id: 'april-awareness',
          name: 'April Awareness',
          description: 'Try 8 different activity types in April',
          category: 'challenges',
          rarity: 'rare',
          icon: '🌷',
          color: 'from-pink-500 to-rose-600',
          requirement: { type: 'monthlyUniqueActivities', count: 8, month: 3 },
          unlocked: false,
          progress: 0,
          maxProgress: 8,
          seasonal: true,
          month: 3
        },
        'mindful-may': {
          id: 'mindful-may',
          name: 'Mindful May',
          description: 'Complete 20 total activities in May',
          category: 'challenges',
          rarity: 'uncommon',
          icon: '🌿',
          color: 'from-green-500 to-emerald-600',
          requirement: { type: 'monthlyTotalActivities', count: 20, month: 4 },
          unlocked: false,
          progress: 0,
          maxProgress: 20,
          seasonal: true,
          month: 4
        },
        'summer-solace': {
          id: 'summer-solace',
          name: 'Summer Solace',
          description: 'Complete 30 outdoor activities in summer months',
          category: 'challenges',
          rarity: 'epic',
          icon: '☀️',
          color: 'from-yellow-500 to-orange-600',
          requirement: { type: 'seasonalOutdoorActivities', count: 30, season: 'summer' },
          unlocked: false,
          progress: 0,
          maxProgress: 30,
          seasonal: true,
          season: 'summer'
        }
      }
    };
  }

  // Get all badges organized by category
  getAllBadges() {
    return this.badges;
  }

  // Get badges by category
  getBadgesByCategory(category) {
    return this.badges[category] || {};
  }

  // Get unlocked badges
  getUnlockedBadges() {
    const unlocked = {};
    Object.keys(this.badges).forEach(category => {
      unlocked[category] = {};
      Object.keys(this.badges[category]).forEach(badgeId => {
        if (this.badges[category][badgeId].unlocked) {
          unlocked[category][badgeId] = this.badges[category][badgeId];
        }
      });
    });
    return unlocked;
  }

  // Get locked badges
  getLockedBadges() {
    const locked = {};
    Object.keys(this.badges).forEach(category => {
      locked[category] = {};
      Object.keys(this.badges[category]).forEach(badgeId => {
        if (!this.badges[category][badgeId].unlocked) {
          locked[category][badgeId] = this.badges[category][badgeId];
        }
      });
    });
    return locked;
  }

  // Calculate badge progress based on user activities
  calculateProgress(userActivities) {
    if (!userActivities || userActivities.length === 0) {
      return this.badges;
    }

    const activities = userActivities.map(activity => ({
      ...activity,
      timestamp: parseInt(activity.timestamp) * 1000,
      date: new Date(parseInt(activity.timestamp) * 1000)
    }));

    // Reset all progress
    Object.keys(this.badges).forEach(category => {
      Object.keys(this.badges[category]).forEach(badgeId => {
        this.badges[category][badgeId].progress = 0;
        this.badges[category][badgeId].unlocked = false;
      });
    });

    // Calculate First Steps badges
    this.calculateFirstStepsProgress(activities);
    
    // Calculate Milestone badges
    this.calculateMilestoneProgress(activities);
    
    // Calculate Streak badges
    this.calculateStreakProgress(activities);
    
    // Calculate Special Achievement badges
    this.calculateSpecialProgress(activities);
    
    // Calculate Challenge badges
    this.calculateChallengeProgress(activities);

    return this.badges;
  }

  // Calculate First Steps badges progress
  calculateFirstStepsProgress(activities) {
    const firstSteps = this.badges.firstSteps;
    
    // Track first activity of each type
    const firstActivities = {};
    
    activities.forEach(activity => {
      const type = activity.type.toLowerCase();
      if (!firstActivities[type]) {
        firstActivities[type] = activity;
      }
    });

    // Check each first step badge
    Object.keys(firstSteps).forEach(badgeId => {
      const badge = firstSteps[badgeId];
      const requirement = badge.requirement;
      
      if (requirement.type === 'firstActivity') {
        const targetTypes = Array.isArray(requirement.activityType) 
          ? requirement.activityType 
          : [requirement.activityType];
        
        const hasFirstActivity = targetTypes.some(type => firstActivities[type]);
        
        if (hasFirstActivity) {
          badge.progress = 1;
          badge.unlocked = true;
        }
      }
    });
  }

  // Calculate Milestone badges progress
  calculateMilestoneProgress(activities) {
    const milestones = this.badges.milestones;
    const totalActivities = activities.length;
    
    Object.keys(milestones).forEach(badgeId => {
      const badge = milestones[badgeId];
      const requirement = badge.requirement;
      
      if (requirement.type === 'totalActivities') {
        badge.progress = Math.min(totalActivities, requirement.count);
        badge.unlocked = totalActivities >= requirement.count;
      }
    });
  }

  // Calculate Streak badges progress
  calculateStreakProgress(activities) {
    const streaks = this.badges.streaks;
    
    if (activities.length === 0) return;
    
    // Sort activities by date
    const sortedActivities = activities.sort((a, b) => a.timestamp - b.timestamp);
    
    // Calculate current streak
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const prevDate = new Date(sortedActivities[i-1].timestamp);
      const currDate = new Date(sortedActivities[i].timestamp);
      
      const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (dayDiff === 0) {
        // Same day, continue streak
        continue;
      } else {
        currentStreak = 1;
      }
    }
    
    // Update streak badges
    Object.keys(streaks).forEach(badgeId => {
      const badge = streaks[badgeId];
      const requirement = badge.requirement;
      
      if (requirement.type === 'streak') {
        badge.progress = Math.min(maxStreak, requirement.days);
        badge.unlocked = maxStreak >= requirement.days;
      }
    });
  }

  // Calculate Special Achievement badges progress
  calculateSpecialProgress(activities) {
    const special = this.badges.special;
    
    // Variety Virtuoso
    const uniqueTypes = new Set(activities.map(a => a.type.toLowerCase())).size;
    if (special['variety-virtuoso']) {
      special['variety-virtuoso'].progress = Math.min(uniqueTypes, 5);
      special['variety-virtuoso'].unlocked = uniqueTypes >= 5;
    }
    
    // Time Keeper
    const totalMinutes = activities.reduce((sum, a) => sum + (parseInt(a.duration) || 15), 0);
    if (special['time-keeper']) {
      special['time-keeper'].progress = Math.min(totalMinutes, 300);
      special['time-keeper'].unlocked = totalMinutes >= 300;
    }
    
    // Early Bird & Night Owl
    const morningActivities = activities.filter(a => {
      const hour = new Date(a.timestamp).getHours();
      return hour < 10;
    });
    const eveningActivities = activities.filter(a => {
      const hour = new Date(a.timestamp).getHours();
      return hour >= 20;
    });
    
    if (special['early-bird']) {
      special['early-bird'].progress = Math.min(morningActivities.length, 5);
      special['early-bird'].unlocked = morningActivities.length >= 5;
    }
    
    if (special['night-owl']) {
      special['night-owl'].progress = Math.min(eveningActivities.length, 5);
      special['night-owl'].unlocked = eveningActivities.length >= 5;
    }
    
    // Marathon Mind
    const longSessions = activities.filter(a => (parseInt(a.duration) || 15) >= 60);
    if (special['marathon-mind']) {
      special['marathon-mind'].progress = longSessions.length > 0 ? 60 : 0;
      special['marathon-mind'].unlocked = longSessions.length > 0;
    }
    
    // Quick Refresher
    const shortSessions = activities.filter(a => (parseInt(a.duration) || 15) <= 10);
    if (special['quick-refresher']) {
      special['quick-refresher'].progress = Math.min(shortSessions.length, 10);
      special['quick-refresher'].unlocked = shortSessions.length >= 10;
    }
  }

  // Calculate Challenge badges progress
  calculateChallengeProgress(activities) {
    const challenges = this.badges.challenges;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    Object.keys(challenges).forEach(badgeId => {
      const badge = challenges[badgeId];
      const requirement = badge.requirement;
      
      if (badge.seasonal && badge.month === currentMonth) {
        // Only show current month's challenge
        if (requirement.type === 'monthlyActivity') {
          const monthlyActivities = activities.filter(a => {
            const activityMonth = new Date(a.timestamp).getMonth();
            return activityMonth === currentMonth && 
                   a.type.toLowerCase() === requirement.activityType;
          });
          
          badge.progress = Math.min(monthlyActivities.length, requirement.count);
          badge.unlocked = monthlyActivities.length >= requirement.count;
        }
        
        if (requirement.type === 'monthlyUniqueActivities') {
          const monthlyActivities = activities.filter(a => {
            const activityMonth = new Date(a.timestamp).getMonth();
            return activityMonth === currentMonth;
          });
          
          const uniqueTypes = new Set(monthlyActivities.map(a => a.type.toLowerCase())).size;
          badge.progress = Math.min(uniqueTypes, requirement.count);
          badge.unlocked = uniqueTypes >= requirement.count;
        }
        
        if (requirement.type === 'monthlyTotalActivities') {
          const monthlyActivities = activities.filter(a => {
            const activityMonth = new Date(a.timestamp).getMonth();
            return activityMonth === currentMonth;
          });
          
          badge.progress = Math.min(monthlyActivities.length, requirement.count);
          badge.unlocked = monthlyActivities.length >= requirement.count;
        }
      } else {
        // Hide non-current seasonal challenges
        badge.progress = 0;
        badge.unlocked = false;
      }
    });
  }

  // Get badge rarity color
  getBadgeRarityColor(rarity) {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-amber-600';
      case 'epic': return 'from-purple-500 to-violet-700';
      case 'rare': return 'from-blue-500 to-indigo-700';
      case 'uncommon': return 'from-emerald-500 to-green-700';
      case 'common': return 'from-stone-400 to-stone-600';
      default: return 'from-stone-400 to-stone-600';
    }
  }

  // Get badge category icon
  getCategoryIcon(category) {
    switch (category) {
      case 'firstSteps': return '🌱';
      case 'milestones': return '🏆';
      case 'streaks': return '🔥';
      case 'special': return '⭐';
      case 'challenges': return '🎯';
      default: return '🏅';
    }
  }

  // Get badge category name
  getCategoryName(category) {
    switch (category) {
      case 'firstSteps': return 'First Steps';
      case 'milestones': return 'Milestones';
      case 'streaks': return 'Streaks';
      case 'special': return 'Special Achievements';
      case 'challenges': return 'Seasonal Challenges';
      default: return 'Badges';
    }
  }

  // Get total unlocked badges count
  getTotalUnlockedCount() {
    let count = 0;
    Object.keys(this.badges).forEach(category => {
      Object.keys(this.badges[category]).forEach(badgeId => {
        if (this.badges[category][badgeId].unlocked) {
          count++;
        }
      });
    });
    return count;
  }

  // Get total badges count
  getTotalBadgesCount() {
    let count = 0;
    Object.keys(this.badges).forEach(category => {
      count += Object.keys(this.badges[category]).length;
    });
    return count;
  }

  // Get completion percentage
  getCompletionPercentage() {
    const total = this.getTotalBadgesCount();
    const unlocked = this.getTotalUnlockedCount();
    return total > 0 ? Math.round((unlocked / total) * 100) : 0;
  }
}

const badgeService = new BadgeService();
export default badgeService;

