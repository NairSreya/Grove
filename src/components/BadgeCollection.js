import React, { useState } from 'react';
import { Award, Lock, CheckCircle, TrendingUp, Sparkles, Star, Crown, Zap } from 'lucide-react';

const BadgeCollection = ({ badges, onBadgeClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLocked, setShowLocked] = useState(true);

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🌱' },
    { id: 'firstSteps', name: 'First Steps', icon: '🌱' },
    { id: 'milestones', name: 'Milestones', icon: '🏆' },
    { id: 'streaks', name: 'Streaks', icon: '🔥' },
    { id: 'special', name: 'Special', icon: '⭐' },
    { id: 'challenges', name: 'Challenges', icon: '🎯' }
  ];

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'epic': return <Star className="w-4 h-4 text-purple-500" />;
      case 'rare': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'uncommon': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      default: return <Award className="w-4 h-4 text-stone-500" />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-amber-600';
      case 'epic': return 'from-purple-500 to-violet-700';
      case 'rare': return 'from-blue-500 to-indigo-700';
      case 'uncommon': return 'from-emerald-500 to-green-700';
      case 'common': return 'from-stone-400 to-stone-600';
      default: return 'from-stone-400 to-stone-600';
    }
  };

  const getProgressColor = (progress, maxProgress) => {
    const percentage = (progress / maxProgress) * 100;
    if (percentage >= 80) return 'from-emerald-500 to-green-600';
    if (percentage >= 60) return 'from-blue-500 to-indigo-600';
    if (percentage >= 40) return 'from-yellow-500 to-orange-600';
    if (percentage >= 20) return 'from-orange-500 to-red-600';
    return 'from-stone-300 to-stone-400';
  };

  const filteredBadges = () => {
    if (selectedCategory === 'all') {
      return badges;
    }
    return { [selectedCategory]: badges[selectedCategory] || {} };
  };

  const renderBadge = (badge, category) => {
    const isUnlocked = badge.unlocked;
    const progressPercentage = (badge.progress / badge.maxProgress) * 100;
    
    return (
      <div
        key={badge.id}
        onClick={() => onBadgeClick && onBadgeClick(badge)}
        className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isUnlocked ? 'hover:shadow-lg' : 'opacity-60'
        }`}
      >
        {/* Badge Container */}
        <div className={`relative overflow-hidden rounded-2xl p-6 ${
          isUnlocked 
            ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white shadow-md` 
            : 'bg-gradient-to-br from-stone-200 to-stone-300 text-stone-600'
        }`}>
          
          {/* Progress Ring */}
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>

          {/* Badge Content */}
          <div className="relative z-10 text-center">
            {/* Badge Icon */}
            <div className="text-4xl mb-3">{badge.icon}</div>
            
            {/* Badge Name */}
            <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
            
            {/* Badge Description */}
            <p className="text-sm opacity-90 mb-3 leading-relaxed">{badge.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(badge.progress, badge.maxProgress)} transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Progress Text */}
            <div className="text-xs opacity-75">
              {badge.progress} / {badge.maxProgress}
            </div>
            
            {/* Rarity Badge */}
            <div className="absolute top-3 right-3">
              {getRarityIcon(badge.rarity)}
            </div>
            
            {/* Status Indicator */}
            <div className="absolute top-3 left-3">
              {isUnlocked ? (
                <CheckCircle className="w-5 h-5 text-green-300" />
              ) : (
                <Lock className="w-5 h-5 text-stone-400" />
              )}
            </div>
          </div>

          {/* Hover Effect */}
          {isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Badge Glow Effect */}
        {isUnlocked && (
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getRarityColor(badge.rarity)} opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-opacity duration-300`} />
        )}
      </div>
    );
  };

  const renderCategory = (categoryId, categoryBadges) => {
    if (!categoryBadges || Object.keys(categoryBadges).length === 0) return null;

    const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
    const categoryIcon = categories.find(c => c.id === categoryId)?.icon || '🏅';
    const unlockedCount = Object.values(categoryBadges).filter(b => b.unlocked).length;
    const totalCount = Object.keys(categoryBadges).length;

    return (
      <div key={categoryId} className="mb-12">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{categoryIcon}</span>
            <div>
              <h2 className="text-2xl font-serif text-stone-800">{categoryName}</h2>
              <p className="text-stone-600">
                {unlockedCount} of {totalCount} badges unlocked
              </p>
            </div>
          </div>
          
          {/* Category Progress */}
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-800">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-sm text-stone-600">Complete</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.values(categoryBadges)
            .filter(badge => showLocked || badge.unlocked)
            .map(badge => renderBadge(badge, categoryId))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-stone-200/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-serif text-stone-800 mb-2">Badge Garden</h1>
            <p className="text-stone-600">
              Cultivate your wellness journey with nature-inspired achievements
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Show Locked Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLocked}
                onChange={(e) => setShowLocked(e.target.checked)}
                className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-stone-700">Show locked badges</span>
            </label>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Badges Display */}
      <div className="space-y-8">
        {Object.entries(filteredBadges()).map(([categoryId, categoryBadges]) =>
          renderCategory(categoryId, categoryBadges)
        )}
      </div>

      {/* Empty State */}
      {Object.keys(filteredBadges()).length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Award className="w-12 h-12 text-stone-400" />
          </div>
          <h3 className="text-2xl font-serif text-stone-800 mb-4">No badges found</h3>
          <p className="text-stone-600 max-w-md mx-auto">
            {selectedCategory === 'all' 
              ? 'Start your wellness journey to unlock your first badges!'
              : `Complete activities to unlock ${categories.find(c => c.id === selectedCategory)?.name} badges.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeCollection;

