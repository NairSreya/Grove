import React, { useState, useEffect } from 'react';
import { Award, X, Sparkles, Star, Crown, Zap, TrendingUp } from 'lucide-react';

const BadgeNotification = ({ badge, isVisible, onClose, onAnimationComplete }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setShowContent(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowContent(false);
      onClose();
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 300);
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'epic': return <Star className="w-6 h-6 text-purple-400" />;
      case 'rare': return <Zap className="w-6 h-6 text-blue-400" />;
      case 'uncommon': return <TrendingUp className="w-6 h-6 text-emerald-400" />;
      default: return <Award className="w-6 h-6 text-stone-400" />;
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

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'Legendary Achievement!';
      case 'epic': return 'Epic Achievement!';
      case 'rare': return 'Rare Achievement!';
      case 'uncommon': return 'Uncommon Achievement!';
      default: return 'Achievement Unlocked!';
    }
  };

  if (!isVisible || !badge) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Notification Container */}
      <div 
        className={`relative pointer-events-auto transform transition-all duration-500 ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Main Notification */}
        <div className={`relative overflow-hidden rounded-3xl p-8 max-w-md mx-4 bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white shadow-2xl`}>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Sparkles */}
            <div className="absolute top-4 left-4 animate-bounce">
              <Sparkles className="w-4 h-4 text-white/30" />
            </div>
            <div className="absolute top-8 right-8 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-4 h-4 text-white/30" />
            </div>
            <div className="absolute bottom-6 left-8 animate-bounce" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-4 h-4 text-white/30" />
            </div>
            
            {/* Rarity Icon Background */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-10">
              {getRarityIcon(badge.rarity)}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Achievement Text */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white/90 mb-1">
                {getRarityText(badge.rarity)}
              </h3>
              <p className="text-sm text-white/80">
                You've unlocked a new badge!
              </p>
            </div>

            {/* Badge Icon */}
            <div className="text-6xl mb-4 animate-pulse">
              {badge.icon}
            </div>

            {/* Badge Name */}
            <h2 className="text-2xl font-bold mb-2">{badge.name}</h2>
            
            {/* Badge Description */}
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              {badge.description}
            </p>

            {/* Rarity Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              {getRarityIcon(badge.rarity)}
              <span className="text-sm font-medium capitalize">{badge.rarity}</span>
            </div>
          </div>

          {/* Progress Ring Animation */}
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * 0.8}`}
                className="animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </svg>
          </div>
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getRarityColor(badge.rarity)} opacity-30 blur-2xl -z-10 animate-pulse`} />
        
        {/* Celebration Particles */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeNotification;

