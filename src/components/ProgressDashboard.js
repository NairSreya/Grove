import React from 'react';
import { TrendingUp, Target, Clock, Star, TreePine, Calendar, Zap, Crown, Award } from 'lucide-react';

const ProgressDashboard = ({ badges, activities }) => {
  const calculateStats = () => {
    // Handle cases where badges or activities might be undefined/null
    if (!badges || !activities) {
      return {
        totalBadges: 0,
        unlockedBadges: 0,
        completionPercentage: 0,
        nextBadges: [],
        categoryStats: {}
      };
    }

    const totalBadges = Object.values(badges).reduce((sum, category) => 
      sum + Object.keys(category).length, 0
    );
    
    const unlockedBadges = Object.values(badges).reduce((sum, category) => 
      sum + Object.values(category).filter(b => b.unlocked).length, 0
    );
    
    const completionPercentage = totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0;
    
    // Calculate next closest badges
    const nextBadges = [];
    Object.values(badges).forEach(category => {
      Object.values(category).forEach(badge => {
        if (!badge.unlocked && badge.progress > 0) {
          const remaining = badge.maxProgress - badge.progress;
          nextBadges.push({ ...badge, remaining });
        }
      });
    });
    
    // Sort by closest to completion
    nextBadges.sort((a, b) => a.remaining - b.remaining);
    
    // Get category breakdown
    const categoryStats = {};
    Object.entries(badges).forEach(([categoryId, categoryBadges]) => {
      const total = Object.keys(categoryBadges).length;
      const unlocked = Object.values(categoryBadges).filter(b => b.unlocked).length;
      categoryStats[categoryId] = { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
    });
    
    return {
      totalBadges,
      unlockedBadges,
      completionPercentage,
      nextBadges: nextBadges.slice(0, 3),
      categoryStats
    };
  };

  const stats = calculateStats();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'seedlings': return '🌱';
      case 'young': return '🌿';
      case 'mature': return '🌳';
      case 'legendary': return '🌟';
      case 'firstSteps': return '🌱';
      case 'milestones': return '🌳';
      case 'streaks': return '🔥';
      case 'special': return '⭐';
      case 'challenges': return '🎯';
      default: return '🌳';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'firstSteps': return 'First Steps';
      case 'milestones': return 'Milestones';
      case 'streaks': return 'Streaks';
      case 'special': return 'Special';
      case 'challenges': return 'Challenges';
      default: return 'Trees';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'epic': return <Star className="w-4 h-4 text-purple-500" />;
      case 'rare': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'uncommon': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      default: return <Award className="w-4 h-4 text-stone-500" />;
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-emerald-500 to-green-600';
    if (percentage >= 60) return 'from-blue-500 to-indigo-600';
    if (percentage >= 40) return 'from-yellow-500 to-orange-600';
    if (percentage >= 20) return 'from-orange-500 to-red-600';
    return 'from-stone-300 to-stone-400';
  };

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-stone-800 mb-4">Your Progress Journey</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Track your wellness achievements and discover new opportunities to grow your tree collection
          </p>
        </div>

        {/* Main Progress Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-stone-800">{stats.completionPercentage}%</div>
                <div className="text-sm text-stone-600">Complete</div>
              </div>
            </div>
            
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - stats.completionPercentage / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TreePine className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-stone-800">{stats.unlockedBadges}</div>
            <div className="text-sm text-stone-600">Trees Adopted</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-stone-800">{stats.totalBadges}</div>
            <div className="text-sm text-stone-600">Total Available</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-stone-800">{stats.totalBadges - stats.unlockedBadges}</div>
            <div className="text-sm text-stone-600">Remaining</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50">
        <h3 className="text-2xl font-serif text-stone-800 mb-6">Category Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stats.categoryStats).map(([categoryId, categoryStat]) => (
            <div key={categoryId} className="bg-white/50 rounded-2xl p-6 border border-stone-200/50">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(categoryId)}</span>
                <div>
                  <h4 className="font-semibold text-stone-800">{getCategoryName(categoryId)}</h4>
                  <p className="text-sm text-stone-600">
                    {categoryStat.unlocked} of {categoryStat.total} trees
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-stone-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(categoryStat.percentage)} transition-all duration-500`}
                  style={{ width: `${categoryStat.percentage}%` }}
                />
              </div>
              
              <div className="text-right">
                <span className="text-sm font-medium text-stone-700">{categoryStat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Trees */}
      {stats.nextBadges.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50">
          <h3 className="text-2xl font-serif text-stone-800 mb-6">🌳 Next Trees to Adopt 🌳</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.nextBadges.map((badge, index) => (
              <div key={badge.id} className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 border border-stone-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{badge.icon}</span>
                  {getRarityIcon(badge.rarity)}
                </div>
                
                <h4 className="font-semibold text-stone-800 mb-2">{badge.name}</h4>
                <p className="text-sm text-stone-600 mb-4">{badge.description}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Progress</span>
                    <span className="font-medium text-stone-800">
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>
                  
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-stone-500 text-center">
                    {badge.remaining} more to unlock
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Insights */}
      {activities && activities.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50">
          <h3 className="text-2xl font-serif text-stone-800 mb-6">Activity Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-stone-800">{activities.length}</div>
              <div className="text-sm text-stone-600">Total Activities</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-stone-800">
                {activities.reduce((sum, a) => sum + (parseInt(a.duration) || 15), 0)}m
              </div>
              <div className="text-sm text-stone-600">Total Time</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-stone-800">
                {new Set(activities.map(a => a.type.toLowerCase())).size}
              </div>
              <div className="text-sm text-stone-600">Activity Types</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-stone-800">
                {activities.filter(a => new Date(parseInt(a.timestamp) * 1000).getDate() === new Date().getDate()).length}
              </div>
              <div className="text-sm text-stone-600">Today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;

