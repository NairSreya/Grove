// Tree Service for Grove Wellness App
// Manages tree-based NFT system with activity milestones

class TreeService {
  constructor() {
    this.trees = this.initializeTrees();
    this.activityTypes = [
      'meditation', 'reading', 'writing', 'walk', 'yoga', 'music', 
      'bath', 'art', 'learning', 'social', 'reflection', 'exercise'
    ];
  }

  // Initialize all tree definitions
  initializeTrees() {
    return {
      // 🌱 Seedling Trees (First Activity Milestones)
      seedlings: {
        'oak-seedling': {
          id: 'oak-seedling',
          name: 'Oak Seedling',
          description: 'Complete your first 3 activities - A young oak tree beginning its journey',
          category: 'seedlings',
          rarity: 'common',
          icon: '🌱',
          color: 'from-emerald-500 to-green-600',
          requirement: { type: 'totalActivities', count: 3 },
          mintCost: '0.0001', // 0.0001 Sepolia ETH (reduced from 0.001)
          unlocked: false,
          progress: 0,
          maxProgress: 3,
          treeType: 'oak',
          growthStage: 'seedling'
        },
        'maple-seedling': {
          id: 'maple-seedling',
          name: 'Maple Seedling',
          description: 'Complete your first 5 activities - A vibrant maple sapling',
          category: 'seedlings',
          rarity: 'common',
          icon: '🍁',
          color: 'from-orange-500 to-red-600',
          requirement: { type: 'totalActivities', count: 5 },
          mintCost: '0.0002', // 0.0002 Sepolia ETH (reduced from 0.002)
          unlocked: false,
          progress: 0,
          maxProgress: 5,
          treeType: 'maple',
          growthStage: 'seedling'
        }
      },

      // 🌿 Young Trees (Early Milestones)
      young: {
        'cherry-blossom': {
          id: 'cherry-blossom',
          name: 'Cherry Blossom',
          description: 'Complete 10 activities - A delicate cherry tree with pink blossoms',
          category: 'young',
          rarity: 'uncommon',
          icon: '🌸',
          color: 'from-pink-500 to-rose-600',
          requirement: { type: 'totalActivities', count: 10 },
          mintCost: '0.0005', // 0.0005 Sepolia ETH (reduced from 0.005)
          unlocked: false,
          progress: 0,
          maxProgress: 10,
          treeType: 'cherry',
          growthStage: 'young'
        },
        'willow-tree': {
          id: 'willow-tree',
          name: 'Weeping Willow',
          description: 'Complete 15 activities - A graceful willow with flowing branches',
          category: 'young',
          rarity: 'uncommon',
          icon: '🌿',
          color: 'from-teal-500 to-cyan-600',
          requirement: { type: 'totalActivities', count: 15 },
          mintCost: '0.0008', // 0.0008 Sepolia ETH (reduced from 0.008)
          unlocked: false,
          progress: 0,
          maxProgress: 15,
          treeType: 'willow',
          growthStage: 'young'
        },
        'birch-tree': {
          id: 'birch-tree',
          name: 'Silver Birch',
          description: 'Complete 20 activities - A slender birch with white bark',
          category: 'young',
          rarity: 'rare',
          icon: '🌳',
          color: 'from-slate-500 to-gray-600',
          requirement: { type: 'totalActivities', count: 20 },
          mintCost: '0.0012', // 0.0012 Sepolia ETH (reduced from 0.012)
          unlocked: false,
          progress: 0,
          maxProgress: 20,
          treeType: 'birch',
          growthStage: 'young'
        }
      },

      // 🌳 Mature Trees (Advanced Milestones)
      mature: {
        'ancient-oak': {
          id: 'ancient-oak',
          name: 'Ancient Oak',
          description: 'Complete 30 activities - A majestic oak tree with centuries of wisdom',
          category: 'mature',
          rarity: 'rare',
          icon: '🦉',
          color: 'from-amber-500 to-yellow-600',
          requirement: { type: 'totalActivities', count: 30 },
          mintCost: '0.002', // 0.002 Sepolia ETH (reduced from 0.02)
          unlocked: false,
          progress: 0,
          maxProgress: 30,
          treeType: 'oak',
          growthStage: 'mature'
        },
        'redwood-tree': {
          id: 'redwood-tree',
          name: 'Giant Redwood',
          description: 'Complete 50 activities - A towering redwood reaching for the sky',
          category: 'mature',
          rarity: 'epic',
          icon: '🌲',
          color: 'from-red-500 to-pink-600',
          requirement: { type: 'totalActivities', count: 50 },
          mintCost: '0.005', // 0.005 Sepolia ETH (reduced from 0.05)
          unlocked: false,
          progress: 0,
          maxProgress: 50,
          treeType: 'redwood',
          growthStage: 'mature'
        },
        'sacred-banyan': {
          id: 'sacred-banyan',
          name: 'Sacred Banyan',
          description: 'Complete 75 activities - A mystical banyan tree with aerial roots',
          category: 'mature',
          rarity: 'epic',
          icon: '🌳',
          color: 'from-purple-500 to-violet-600',
          requirement: { type: 'totalActivities', count: 75 },
          mintCost: '0.01', // 0.01 Sepolia ETH (reduced from 0.1)
          unlocked: false,
          progress: 0,
          maxProgress: 75,
          treeType: 'banyan',
          growthStage: 'mature'
        }
      },

      // 🌟 Legendary Trees (Ultimate Milestones)
      legendary: {
        'world-tree': {
          id: 'world-tree',
          name: 'World Tree',
          description: 'Complete 100 activities - The legendary tree connecting all realms',
          category: 'legendary',
          rarity: 'legendary',
          icon: '🌍',
          color: 'from-indigo-500 to-purple-600',
          requirement: { type: 'totalActivities', count: 100 },
          mintCost: '0.02', // 0.02 Sepolia ETH (reduced from 0.2)
          unlocked: false,
          progress: 0,
          maxProgress: 100,
          treeType: 'world',
          growthStage: 'legendary'
        },
        'eternal-grove': {
          id: 'eternal-grove',
          name: 'Eternal Grove',
          description: 'Complete 150 activities - A sacred grove of eternal trees',
          category: 'legendary',
          rarity: 'legendary',
          icon: '🏛️',
          color: 'from-emerald-500 to-teal-600',
          requirement: { type: 'totalActivities', count: 150 },
          mintCost: '0.05', // 0.05 Sepolia ETH (reduced from 0.5)
          unlocked: false,
          progress: 0,
          maxProgress: 150,
          treeType: 'grove',
          growthStage: 'legendary'
        }
      }
    };
  }

  // Calculate progress for all trees based on user activities
  calculateProgress(userActivities) {
    const totalActivities = userActivities.length;
    const calculatedTrees = {};

    // Process each category
    Object.keys(this.trees).forEach(category => {
      calculatedTrees[category] = {};
      
      Object.keys(this.trees[category]).forEach(treeId => {
        const tree = { ...this.trees[category][treeId] };
        
        // Calculate progress based on requirement type
        if (tree.requirement.type === 'totalActivities') {
          tree.progress = Math.min(totalActivities, tree.requirement.count);
          tree.unlocked = totalActivities >= tree.requirement.count;
        }
        
        calculatedTrees[category][treeId] = tree;
      });
    });

    return calculatedTrees;
  }

  // Get all available trees
  getAllTrees() {
    return this.trees;
  }

  // Get trees by category
  getTreesByCategory(category) {
    return this.trees[category] || {};
  }

  // Get a specific tree by ID
  getTreeById(treeId) {
    for (const category of Object.keys(this.trees)) {
      if (this.trees[category][treeId]) {
        return this.trees[category][treeId];
      }
    }
    return null;
  }

  // Get mintable trees (unlocked but not yet minted)
  getMintableTrees(userActivities, mintedTrees = []) {
    const calculatedTrees = this.calculateProgress(userActivities);
    const mintableTrees = [];

    Object.values(calculatedTrees).forEach(category => {
      Object.values(category).forEach(tree => {
        if (tree.unlocked && !mintedTrees.includes(tree.id)) {
          mintableTrees.push(tree);
        }
      });
    });

    return mintableTrees.sort((a, b) => {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }

  // Get tree rarity color
  getTreeRarityColor(rarity) {
    switch (rarity) {
      case 'legendary': return 'from-purple-600 to-violet-700';
      case 'epic': return 'from-blue-600 to-indigo-700';
      case 'rare': return 'from-emerald-600 to-green-700';
      case 'uncommon': return 'from-amber-600 to-orange-700';
      default: return 'from-stone-600 to-gray-700';
    }
  }

  // Get tree icon based on type and growth stage
  getTreeIcon(treeType, growthStage) {
    const icons = {
      oak: { seedling: '🌱', young: '🌿', mature: '🌳', legendary: '🦉' },
      maple: { seedling: '🍁', young: '🍂', mature: '🌳', legendary: '🍁' },
      cherry: { seedling: '🌸', young: '🌸', mature: '🌸', legendary: '🌸' },
      willow: { seedling: '🌿', young: '🌿', mature: '🌿', legendary: '🌿' },
      birch: { seedling: '🌱', young: '🌿', mature: '🌳', legendary: '🌳' },
      redwood: { seedling: '🌱', young: '🌿', mature: '🌲', legendary: '🌲' },
      banyan: { seedling: '🌱', young: '🌿', mature: '🌳', legendary: '🌳' },
      world: { seedling: '🌍', young: '🌍', mature: '🌍', legendary: '🌍' },
      grove: { seedling: '🏛️', young: '🏛️', mature: '🏛️', legendary: '🏛️' }
    };
    
    return icons[treeType]?.[growthStage] || '🌳';
  }

  // Generate tree metadata for NFT
  generateTreeMetadata(tree) {
    return {
      name: tree.name,
      description: tree.description,
      image: `https://grove-wellness.com/trees/${tree.id}.png`, // Placeholder
      attributes: [
        {
          trait_type: "Tree Type",
          value: tree.treeType
        },
        {
          trait_type: "Growth Stage",
          value: tree.growthStage
        },
        {
          trait_type: "Rarity",
          value: tree.rarity
        },
        {
          trait_type: "Category",
          value: tree.category
        },
        {
          trait_type: "Activities Required",
          value: tree.requirement.count
        },
        {
          trait_type: "Mint Cost",
          value: `${tree.mintCost} ETH`
        }
      ]
    };
  }
}

const treeService = new TreeService();
export default treeService;
