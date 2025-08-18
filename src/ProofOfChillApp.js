import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Leaf, Clock, Plus, Wallet, Loader2, CheckCircle, TreePine, Mountain, Sun, BarChart3, Award } from 'lucide-react';
import blockchainService from './services/blockchainService';
import treeService from './services/treeService';
import ProgressDashboard from './components/ProgressDashboard';
import TreeCollection from './components/TreeCollection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Grove = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [activities, setActivities] = useState([]);
  const [userStats, setUserStats] = useState({ totalSessions: 0, totalMinutes: 0, trees: [] });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: '', duration: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [canMintTree, setCanMintTree] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('');
  const [trees, setTrees] = useState({});
  const [currentView, setCurrentView] = useState('main'); // 'main', 'trees', 'progress'

  // Load blockchain data when connected
  useEffect(() => {
    if (isConnected && account) {
      loadBlockchainData();
      setupBlockchainListeners();
    }
    
    return () => {
      try {
        blockchainService.removeEventListeners();
      } catch (error) {
        console.error('Error cleaning up blockchain listeners:', error);
        // Don't let cleanup errors crash the app
      }
    };
  }, [isConnected, account]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBlockchainData = async () => {
    try {
      setIsLoading(true);
      
      // Load user activities
      const userLogs = await blockchainService.getUserLogs(account);
      setActivities(userLogs);
      
      // Calculate tree progress
      const calculatedTrees = treeService.calculateProgress(userLogs);
      setTrees(calculatedTrees);
      
      // Load contract stats
      const stats = await blockchainService.getContractStats();
      
      // Calculate actual total time from activities
      let actualTotalMinutes = 0;
      if (userLogs && userLogs.length > 0) {
        console.log('User logs for time calculation:', userLogs);
        
        // Calculate total time from actual activity durations
        actualTotalMinutes = userLogs.reduce((total, activity) => {
          // Use activity duration if available, otherwise default to 15 minutes
          const duration = parseInt(activity.duration) || 15;
          console.log(`Activity ${activity.type}: duration = ${duration}`);
          return total + duration;
        }, 0);
        
        console.log('Total calculated time from activities:', actualTotalMinutes);
      } else {
        console.log('No user logs available for time calculation');
      }
      
      // Update stats with actual calculated time
      const updatedStats = {
        ...stats,
        totalMinutes: actualTotalMinutes
      };
      
      setUserStats(updatedStats);
      
      // Check if user can mint any trees
      const mintableTrees = treeService.getMintableTrees(userLogs, []);
      setCanMintTree(mintableTrees.length > 0);
      
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
      toast.error('Failed to load blockchain data');
    } finally {
      setIsLoading(false);
    }
  };

  const setupBlockchainListeners = () => {
    try {
      blockchainService.setupEventListeners(
        // Activity logged event
        (activityData) => {
          toast.success('Activity logged on blockchain!');
          // Refresh data after activity is logged
          loadBlockchainData();
        },
        // Tree minted event
        (treeData) => {
          toast.success('Tree NFT minted!');
          loadBlockchainData(); // Refresh data
        }
      );
    } catch (error) {
      console.error('Failed to set up blockchain listeners:', error);
      // Don't show error to user, just log it
      // The app can still function without event listeners
    }
  };

  const connectWallet = async () => {
    try {
      console.log('Connecting wallet...');
      await blockchainService.initialize();
      const currentAccount = await blockchainService.getCurrentAccount();
      setAccount(currentAccount);
      setIsConnected(true);
      
      // Check contract health
      try {
        const health = await blockchainService.checkContractHealth();
        console.log('Contract health check:', health);
      } catch (healthError) {
        console.warn('Contract health check failed:', healthError);
      }
      
      // Check and display network status
      try {
        await blockchainService.checkNetwork();
        setNetworkStatus('Connected to Sepolia Testnet');
        toast.success('Wallet connected to Sepolia Testnet!');
      } catch (networkError) {
        setNetworkStatus('Wrong network - please switch to Sepolia Testnet');
        toast.warning('Connected to wrong network. Please switch to Sepolia Testnet in MetaMask.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      if (error.message.includes('MetaMask is not installed')) {
        toast.error('MetaMask not found. Please install it to continue.');
      } else {
        toast.error('Failed to connect wallet: ' + error.message);
      }
    }
  };

  // Event handlers for MetaMask
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setIsConnected(false);
      setActivities([]);
      setUserStats({ totalSessions: 0, totalMinutes: 0, trees: [] });
      setCanMintTree(false);
      setTrees({});
      setNetworkStatus('');
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = () => {
    // Refresh data when network changes
    if (isConnected && account) {
      loadBlockchainData();
    }
  };

  const disconnectWallet = () => {
    try {
      // Clean up MetaMask event listeners
      if (typeof window !== 'undefined' && window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
      
      // Disconnect blockchain service
      blockchainService.disconnect();
      
      // Reset app state immediately
      setAccount('');
      setIsConnected(false);
      setActivities([]);
      setUserStats({ totalSessions: 0, totalMinutes: 0, trees: [] });
      setCanMintTree(false);
      setNetworkStatus('');
      setTrees({});
      setCurrentView('main');
      setIsLoading(false);
      setShowAddActivity(false);
      setNewActivity({ type: '', duration: '', description: '' });
      
      toast.success('Wallet disconnected successfully');
      
      // Force a small delay to ensure state updates are processed
      setTimeout(() => {
        // Additional state reset if needed
        setIsConnected(false);
      }, 100);
      
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Force disconnect even if there's an error
      setAccount('');
      setIsConnected(false);
      toast.success('Wallet disconnected');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.type || !newActivity.duration) return;

    try {
      setIsLoading(true);
      
      // Log activity on blockchain
      await blockchainService.logActivity(
        newActivity.type, 
        newActivity.description || `${newActivity.type} session for ${newActivity.duration} minutes`,
        parseInt(newActivity.duration)
      );
      
      toast.success('Activity logged on blockchain!');
      
      // Reset form
      setNewActivity({ type: '', duration: '', description: '' });
      setShowAddActivity(false);
      
      // Refresh blockchain data
      await loadBlockchainData();
      
    } catch (error) {
      console.error('Failed to log activity:', error);
      toast.error('Failed to log activity: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'meditation': return <Mountain className="w-4 h-4" />;
      case 'walk': return <TreePine className="w-4 h-4" />;
      case 'reading': return <Sun className="w-4 h-4" />;
      default: return <Leaf className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (isMounted) {
          handleAccountsChanged(accounts);
          }
        } catch (err) {
          // ignore
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };

    // Only initialize once on component mount
    init();
    return () => {
      isMounted = false;
      if (typeof window !== 'undefined' && window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-stone-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-sm">
                <TreePine className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-serif text-stone-800 tracking-tight">
                  Grove
                </h1>
                <p className="text-sm text-stone-600 font-light">Mindful moments, rooted in nature</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium border border-emerald-200">
                    {shortenAddress(account)}
                  </div>
                  {networkStatus && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                      networkStatus.includes('Wrong network') 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {networkStatus}
                    </div>
                  )}
                  <button
                    onClick={disconnectWallet}
                    className="text-stone-500 hover:text-stone-700 transition-colors font-medium text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-green-800"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <TreePine className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-serif text-stone-800 mb-6 leading-tight">
              Welcome to Grove
            </h2>
            <p className="text-stone-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              A sanctuary for tracking your mindful moments on the blockchain. Connect your wallet to begin cultivating 
              your digital wellness garden and earn badges for your journey toward inner peace.
            </p>
            
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
              <h3 className="font-semibold text-stone-800 mb-3 flex items-center justify-center space-x-2">
                <Mountain className="w-5 h-5 text-stone-600" />
                <span>Network Requirements</span>
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Grove requires <strong>Sepolia Testnet</strong>. Please ensure your MetaMask wallet is connected 
                to Sepolia before proceeding with your wellness journey.
              </p>
            </div>
            
            <button
              onClick={connectWallet}
              className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-10 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 mx-auto text-lg"
            >
              <Wallet className="w-6 h-6" />
              <span>Connect Wallet to Begin</span>
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Main Navigation */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-2 border border-stone-200/50 shadow-sm mb-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('main')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    currentView === 'main'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('trees')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    currentView === 'trees'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <TreePine className="w-4 h-4" />
                  <span>Tree Grove</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('tree-catalog')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    currentView === 'tree-catalog'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <TreePine className="w-4 h-4" />
                  <span>Tree Catalogue</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('progress')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    currentView === 'progress'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Progress</span>
                </button>
              </div>
            </div>

            {/* Action Button for Recording Activities */}
            <div className="flex justify-center mb-12">
              <button
                onClick={() => setShowAddActivity(true)}
                disabled={isLoading}
                className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-10 py-4 rounded-xl font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-800"
              >
                <Plus className="w-5 h-5" />
                <span>Record Activity</span>
              </button>
            </div>

            {/* Overview Content - Main Dashboard */}
            {currentView === 'main' && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-stone-600" />
                      </div>
                      <h3 className="font-semibold text-stone-800 text-lg">Sessions</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                        <span className="text-stone-500">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-4xl font-light text-stone-700">{userStats.totalSessions}</p>
                    )}
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-stone-800 text-lg">Time Spent</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                        <span className="text-stone-500">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-4xl font-light text-emerald-700">{formatTime(userStats.totalMinutes)}</p>
                    )}
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <TreePine className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-stone-800 text-lg">Trees</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                        <span className="text-stone-500">Loading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-4xl font-light text-amber-700">
                          {Array.isArray(userStats.trees) ? userStats.trees.length : 0}
                        </p>
                        <p className="text-sm text-amber-600 mt-1">
                          in your grove
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activities - Horizontal Layout */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 shadow-sm">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-10 h-10 bg-stone-100 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-stone-600" />
                    </div>
                    <h2 className="text-2xl font-serif text-stone-800">Recent Activities</h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="flex space-x-6 pb-4">
                      {isLoading ? (
                        <div className="text-center py-12 w-full">
                          <Loader2 className="w-8 h-8 text-stone-400 animate-spin mx-auto mb-4" />
                          <p className="text-stone-600">Loading your activities...</p>
                        </div>
                      ) : (!activities || activities.length === 0) ? (
                        <div className="text-center py-12 w-full">
                          <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-stone-400" />
                          </div>
                          <p className="text-stone-600 mb-2">Your activity garden awaits</p>
                          <p className="text-sm text-stone-500">Record your first mindful moment to begin your journey</p>
                        </div>
                      ) : (
                        activities.map((activity) => (
                          <div key={activity.id} className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/50 hover:shadow-sm transition-all duration-200 min-w-[280px]">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                                  {getActivityIcon(activity.type)}
                                </div>
                                <h3 className="font-medium text-stone-800">{activity.type}</h3>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs text-emerald-600 font-medium">On-chain</span>
                              </div>
                            </div>
                            {activity.description && (
                              <p className="text-stone-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-stone-500">
                              <span>{formatDate(parseInt(activity.timestamp) * 1000)}</span>
                              <span className="font-mono text-xs bg-stone-200 px-2 py-1 rounded">
                                {activity.txHash}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tree Grove View */}
            {currentView === 'trees' && (
              <TreeCollection 
                userActivities={activities}
                userStats={userStats}
                onTreeMinted={(tree) => {
                  toast.success(`🌳 ${tree.name} minted successfully!`);
                }}
                showOnlyAchieved={true}
              />
            )}

            {/* Tree Catalog View */}
            {currentView === 'tree-catalog' && (
              <TreeCollection 
                userActivities={activities}
                userStats={userStats}
                onTreeMinted={(tree) => {
                  toast.success(`🌳 ${tree.name} minted successfully!`);
                }}
                showOnlyAchieved={false}
                showCatalog={true}
              />
            )}

            {/* Progress Dashboard View */}
            {currentView === 'progress' && (
              <ProgressDashboard activities={activities} badges={trees} />
            )}

            {/* Add Activity Modal */}
            {showAddActivity && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-stone-200 shadow-xl">
                  <h3 className="text-2xl font-serif text-stone-800 mb-6">Record New Activity</h3>
                  <form onSubmit={handleAddActivity} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">Activity Type</label>
                      <select
                        value={newActivity.type}
                        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                        className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-stone-800"
                        required
                      >
                        <option value="">Choose an activity...</option>
                        <option value="Meditation">Meditation</option>
                        <option value="Reading">Reading</option>
                        <option value="Writing">Writing/Journaling</option>
                        <option value="Walk">Nature Walk</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Exercise">Exercise</option>
                        <option value="Music">Listening to Music</option>
                        <option value="Art">Art/Creative Activity</option>
                        <option value="Learning">Learning/Skill Practice</option>
                        <option value="Social">Social Connection</option>
                        <option value="Reflection">Mindfulness/Reflection</option>
                        <option value="Bath">Relaxing Bath</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                        className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-stone-800"
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">Reflection (optional)</label>
                      <textarea
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-stone-800"
                        rows="3"
                        placeholder="How did this moment nurture your wellbeing?"
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddActivity(false)}
                        disabled={isLoading}
                        className="flex-1 py-4 text-stone-600 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Recording...</span>
                          </>
                        ) : (
                          <span>Record Activity</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}


          </div>
        )}
      </div>


    </div>
  );
};

export default Grove;