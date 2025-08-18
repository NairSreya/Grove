import React, { useState, useEffect } from 'react';
import { TreePine, Award, Loader2, Sparkles, Crown, Star, Zap, TrendingUp } from 'lucide-react';
import treeService from '../services/treeService';
import blockchainService from '../services/blockchainService';
import { toast } from 'react-toastify';

const TreeCollection = ({ userActivities, userStats, onTreeMinted, showOnlyAchieved = false, showCatalog = false }) => {
  const [trees, setTrees] = useState({});
  const [mintableTrees, setMintableTrees] = useState([]);
  const [mintedTrees, setMintedTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);

  useEffect(() => {
    if (userActivities) {
      loadTreeData();
    }
  }, [userActivities]);

  // Also refresh when component mounts
  useEffect(() => {
    loadTreeData();
  }, []);

  // Refresh when showOnlyAchieved changes (switching between Grove and Catalogue views)
  useEffect(() => {
    if (showOnlyAchieved) {
      console.log('Switched to Tree Grove view, refreshing data...');
      loadTreeData();
    }
  }, [showOnlyAchieved]);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      
      // Calculate tree progress
      const calculatedTrees = treeService.calculateProgress(userActivities);
      setTrees(calculatedTrees);
      
      // Load minted trees from blockchain FIRST
      let mintedTreeIds = [];
      try {
        console.log('Loading minted trees from blockchain...');
        const userTrees = await blockchainService.getUserTrees();
        console.log('Raw user trees from blockchain:', userTrees);
        
        // Convert to string IDs and filter out duplicates
        mintedTreeIds = [...new Set(userTrees.map(id => {
          const treeId = id.toString();
          console.log('Processing tree ID:', treeId);
          return treeId;
        }))].filter(id => id && id !== '0'); // Remove empty/invalid IDs
        
        console.log('Processed minted tree IDs:', mintedTreeIds);
        setMintedTrees(mintedTreeIds);
        
        // Store in local storage as backup
        localStorage.setItem('mintedTrees', JSON.stringify(mintedTreeIds));
        
        // Also store user tree data with more details for debugging
        localStorage.setItem('userTreesRaw', JSON.stringify(userTrees.map(t => t.toString())));
        
      } catch (error) {
        console.error('Failed to load minted trees from blockchain:', error);
        
        // Try to load from local storage as fallback
        try {
          const storedTrees = localStorage.getItem('mintedTrees');
          if (storedTrees) {
            mintedTreeIds = JSON.parse(storedTrees).filter(id => id && id !== '0');
            console.log('Loading minted trees from local storage fallback:', mintedTreeIds);
            setMintedTrees(mintedTreeIds);
          } else {
            console.log('No fallback data available, setting empty arrays');
            mintedTreeIds = [];
            setMintedTrees([]);
          }
        } catch (fallbackError) {
          console.error('Failed to load from fallback:', fallbackError);
          mintedTreeIds = [];
          setMintedTrees([]);
        }
      }
      
      // Get mintable trees with the updated mintedTrees state
      const mintable = treeService.getMintableTrees(userActivities, mintedTreeIds);
      setMintableTrees(mintable);
      console.log('Mintable trees:', mintable);
      console.log('Final minted trees state:', mintedTreeIds);
      
    } catch (error) {
      console.error('Failed to load tree data:', error);
      toast.error('Failed to load tree collection');
    } finally {
      setIsLoading(false);
    }
  };

  const mintTree = async (tree) => {
    try {
      setIsMinting(true);
      setSelectedTree(tree.id);
      
      console.log('Minting tree:', tree.id);
      await blockchainService.mintTreeNFT(tree.id, tree.mintCost);
      
      toast.success(`🌳 ${tree.name} planted successfully!`);
      
      // Immediately update the minted trees state for instant UI feedback
      const updatedMintedTrees = [...mintedTrees, tree.id];
      setMintedTrees(updatedMintedTrees);
      
      // Update local storage immediately
      localStorage.setItem('mintedTrees', JSON.stringify(updatedMintedTrees));
      console.log('Immediately updated minted trees:', updatedMintedTrees);
      
      // Then refresh tree data from blockchain in the background
      try {
        setTimeout(async () => {
          await loadTreeData();
        }, 2000); // Delay to allow blockchain confirmation
      } catch (error) {
        console.log('Background refresh failed:', error);
      }
      
      // Notify parent component
      if (onTreeMinted) {
        onTreeMinted(tree);
      }
      
    } catch (error) {
      console.error('Failed to mint tree:', error);
      if (error.message.includes('Insufficient payment')) {
        toast.error('Insufficient ETH. Please ensure you have enough Sepolia ETH to mint this tree.');
      } else {
        toast.error('Failed to mint tree: ' + error.message);
      }
    } finally {
      setIsMinting(false);
      setSelectedTree(null);
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'epic': return <Star className="w-5 h-5 text-purple-400" />;
      case 'rare': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'uncommon': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-stone-400" />;
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

  const getTreeIcon = (treeType, growthStage) => {
    return treeService.getTreeIcon(treeType, growthStage);
  };

  const renderTreeCard = (tree, category) => {
    const isMinted = mintedTrees.includes(tree.id);
    const canMint = tree.unlocked && !isMinted;
    const isMintingThis = isMinting && selectedTree === tree.id;
    
    console.log(`Tree ${tree.id}: isMinted=${isMinted}, canMint=${canMint}, unlocked=${tree.unlocked}`);
    
    return (
      <div key={tree.id} className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isMinted 
          ? showOnlyAchieved
            ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-300 shadow-lg' 
            : 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg'
          : tree.unlocked 
            ? 'bg-white border-stone-200 hover:shadow-md' 
            : 'bg-stone-50 border-stone-200 opacity-60'
      }`}>
        
        {/* Minted Badge */}
        {isMinted && !showOnlyAchieved && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg">
              <Award className="w-3 h-3" />
              <span>Achieved!</span>
            </div>
          </div>
        )}

        {/* Achievement Celebration for Grove View */}
        {isMinted && showOnlyAchieved && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg">
              <span>🌳</span>
              <span>Grown!</span>
            </div>
          </div>
        )}

        {/* Tree Icon */}
        <div className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${
            isMinted 
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 scale-110 shadow-lg' 
              : tree.unlocked 
                ? 'bg-gradient-to-br from-stone-100 to-stone-200' 
                : 'bg-stone-100'
          }`}>
            {showOnlyAchieved && isMinted ? (
              // Show actual tree icons for achieved trees in Grove view
              <span className="text-4xl">
                {tree.treeType === 'oak' && '🌳'}
                {tree.treeType === 'maple' && '🍁'}
                {tree.treeType === 'cherry' && '🌸'}
                {tree.treeType === 'willow' && '🌿'}
                {tree.treeType === 'birch' && '🌳'}
                {tree.treeType === 'pine' && '🌲'}
                {tree.treeType === 'sequoia' && '🌲'}
                {tree.treeType === 'sakura' && '🌸'}
                {!['oak', 'maple', 'cherry', 'willow', 'birch', 'pine', 'sequoia', 'sakura'].includes(tree.treeType) && '🌳'}
              </span>
            ) : (
              // Show the original icon for catalog view
              getTreeIcon(tree.treeType, tree.growthStage)
            )}
          </div>
          
          <h3 className="font-semibold text-lg text-stone-800 mb-2">{tree.name}</h3>
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">{tree.description}</p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Progress</span>
              <span>{tree.progress}/{tree.maxProgress}</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  tree.unlocked 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                    : 'bg-gradient-to-r from-stone-400 to-stone-500'
                }`}
                style={{ width: `${(tree.progress / tree.maxProgress) * 100}%` }}
              />
            </div>
          </div>

          {/* Rarity and Cost */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getRarityIcon(tree.rarity)}
              <span className="text-xs font-medium text-stone-600 capitalize">{tree.rarity}</span>
            </div>
            <div className="text-xs font-medium text-stone-600">
              {tree.mintCost} ETH
            </div>
          </div>

          {/* Mint Button */}
          {canMint && (
            <button
              onClick={() => mintTree(tree)}
              disabled={isMinting}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isMintingThis
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 hover:shadow-md'
              }`}
            >
              {isMintingThis ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Minting...</span>
                </>
              ) : (
                <>
                  <TreePine className="w-4 h-4" />
                  <span>Mint Tree</span>
                </>
              )}
            </button>
          )}

          {/* Show Achieved for minted trees */}
          {isMinted && (
            <div className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Achieved!</span>
            </div>
          )}

          {/* Locked State */}
          {!tree.unlocked && (
            <div className="text-center py-3">
              <div className="text-sm text-stone-500">
                Complete {tree.maxProgress - tree.progress} more activities
              </div>
            </div>
          )}

          {/* Achievement Celebration */}
          {isMinted && (
            <div className={`mt-4 p-3 rounded-xl border ${
              showOnlyAchieved
                ? 'bg-gradient-to-r from-amber-50 to-orange-100 border-amber-200'
                : 'bg-gradient-to-r from-emerald-50 to-green-100 border-emerald-200'
            }`}>
              <div className={`flex items-center justify-center space-x-2 ${
                showOnlyAchieved ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                <span className="text-lg">
                  {showOnlyAchieved ? '🌳' : '🎉'}
                </span>
                <span className="text-sm font-medium">
                  {showOnlyAchieved ? 'Successfully grown!' : 'Successfully minted!'}
                </span>
                <span className="text-lg">
                  {showOnlyAchieved ? '🌳' : '🎉'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-stone-400 animate-spin mx-auto mb-4" />
        <p className="text-stone-600">Loading your tree collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <TreePine className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-serif text-stone-800 mb-2">
          {showOnlyAchieved ? '🌲 Your Forest Grove 🌲' : '🌳 Tree Catalogue 🌳'}
        </h2>
        <p className="text-stone-600">
          {showOnlyAchieved 
            ? 'A peaceful sanctuary of trees you\'ve grown through mindful activities' 
            : 'Discover all available trees and track your progress toward growing them'
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 text-center">
          <div className="text-2xl font-bold text-stone-800">{userStats?.totalSessions || 0}</div>
          <div className="text-sm text-stone-600">
            {showOnlyAchieved ? 'Mindful Moments' : 'Activities Completed'}
          </div>
        </div>
        {showOnlyAchieved ? (
          <>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 text-center">
              <div className="text-2xl font-bold text-stone-800">{mintedTrees.length}</div>
              <div className="text-sm text-stone-600">Trees Grown</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 text-center">
              <div className="text-2xl font-bold text-stone-800">{userStats?.totalMinutes || 0}m</div>
              <div className="text-sm text-stone-600">Time Invested</div>
            </div>
          </>
        ) : (
          <>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 text-center">
              <div className="text-2xl font-bold text-stone-800">{Object.values(trees).reduce((total, category) => total + Object.keys(category).length, 0)}</div>
              <div className="text-sm text-stone-600">Total Trees Available</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 text-center">
          <div className="text-2xl font-bold text-stone-800">{mintedTrees.length}</div>
              <div className="text-sm text-stone-600">Trees Grown</div>
        </div>
          </>
        )}
      </div>

      {/* Tree Categories */}
      {(() => {
        const hasTrees = Object.keys(trees).some(category => {
          let categoryTrees = Object.values(trees[category]);
          if (showOnlyAchieved) {
            categoryTrees = categoryTrees.filter(tree => mintedTrees.includes(tree.id));
          }
          return categoryTrees.length > 0;
        });

        if (!hasTrees) {
          return (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-600 mb-2">
                {showOnlyAchieved 
                  ? 'Your forest grove is waiting to grow' 
                  : 'No trees available yet'
                }
              </p>
              <p className="text-sm text-stone-500 mb-4">
                {showOnlyAchieved
                  ? 'Complete activities and mint trees to start your forest'
                  : 'Complete activities to unlock trees for minting'
                }
              </p>
              
              {showOnlyAchieved && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-emerald-700">
                    <strong>🌱 Plant your first tree:</strong> Record mindful activities to unlock and grow beautiful trees in your personal forest grove.
                  </p>
                </div>
              )}
              
              {!showOnlyAchieved && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-200"
                >
                  Refresh Page
                </button>
              )}
            </div>
          );
        }

        if (showOnlyAchieved) {
          // Tree Grove view - show only minted trees in a forest aesthetic
          const allMintedTrees = [];
          Object.values(trees).forEach(category => {
            Object.values(category).forEach(tree => {
              if (mintedTrees.includes(tree.id)) {
                allMintedTrees.push(tree);
              }
            });
          });

          console.log('Tree Grove view - mintedTrees:', mintedTrees);
          console.log('Tree Grove view - allMintedTrees:', allMintedTrees);
          console.log('Tree Grove view - trees object:', trees);

          return (
            <div className="relative min-h-[600px]">
              {/* Forest Background with subtle patterns */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-green-50 to-emerald-100 rounded-3xl opacity-40"></div>
              
              {/* Subtle forest floor texture */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-200 to-transparent rounded-b-3xl opacity-20"></div>
              
              {/* Forest Title */}
              <div className="relative z-10 text-center mb-8 pt-4">
                <h3 className="text-2xl font-serif text-stone-800 mb-2">🌲 Your Forest Grove 🌲</h3>
                <p className="text-stone-600">A collection of {allMintedTrees.length} beautiful trees you've grown</p>
                
                {/* Refresh Button */}
                <button
                  onClick={loadTreeData}
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-200"
                >
                  🔄 Refresh Grove
                </button>
              </div>

              {/* Forest Layout - Trees arranged in a natural pattern */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
                {allMintedTrees.map((tree, index) => (
                  <div 
                    key={tree.id} 
                    className={`relative transform transition-all duration-500 hover:scale-105 ${
                      index % 3 === 0 ? 'rotate-1' : 
                      index % 3 === 1 ? '-rotate-1' : 'rotate-0'
                    }`}
                  >
                    {/* Tree Card with Forest Aesthetic */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-3xl p-6 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                      {/* Tree Icon - Larger and more prominent */}
                      <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-5xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg">
                        <span>
                          {tree.treeType === 'oak' && '🌳'}
                          {tree.treeType === 'maple' && '🍁'}
                          {tree.treeType === 'cherry' && '🌸'}
                          {tree.treeType === 'willow' && '🌿'}
                          {tree.treeType === 'birch' && '🌳'}
                          {tree.treeType === 'pine' && '🌲'}
                          {tree.treeType === 'sequoia' && '🌲'}
                          {tree.treeType === 'sakura' && '🌸'}
                          {!['oak', 'maple', 'cherry', 'willow', 'birch', 'pine', 'sequoia', 'sakura'].includes(tree.treeType) && '🌳'}
                        </span>
                      </div>
                      
                      {/* Tree Name */}
                      <h3 className="font-bold text-xl text-stone-800 mb-2 text-center">{tree.name}</h3>
                      
                      {/* Tree Description */}
                      <p className="text-sm text-stone-600 mb-4 text-center leading-relaxed">{tree.description}</p>
                      
                      {/* Achievement Badge */}
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-lg">
                          <span>🌳</span>
                          <span>Grown!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Forest Floor Effect */}
              <div className="relative z-10 mt-8 text-center">
                <div className="w-full h-2 bg-gradient-to-r from-transparent via-emerald-300 to-transparent rounded-full opacity-30"></div>
                <p className="text-sm text-emerald-600 mt-2 font-medium">Your forest continues to grow with each mindful activity</p>
              </div>
            </div>
          );
        }

        // Tree Catalogue view - show all trees with progress tracking
        return Object.keys(trees).map(category => {
          let categoryTrees = Object.values(trees[category]);
          
          // Skip empty categories
          if (categoryTrees.length === 0) return null;
          
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-stone-800 flex items-center space-x-2">
              {category === 'seedlings' && <span>🌱</span>}
              {category === 'young' && <span>🌿</span>}
              {category === 'mature' && <span>🌳</span>}
              {category === 'legendary' && <span>🌟</span>}
              <span>{categoryName} Trees</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTrees.map(tree => renderTreeCard(tree, category))}
            </div>
          </div>
        );
        });
      })()}
    </div>
  );
};

export default TreeCollection;
