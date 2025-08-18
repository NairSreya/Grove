import { ethers } from 'ethers';
import { PROOF_OF_CHILL_ABI, CONTRACT_ADDRESS, NETWORKS } from '../contracts/ProofOfChill';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isInitialized = false;
  }

  // Initialize the blockchain service
  async initialize() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Create contract instance
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, PROOF_OF_CHILL_ABI, this.signer);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Check if connected to the correct network
  async checkNetwork() {
    try {
      const network = await this.provider.getNetwork();
      const chainId = network.chainId.toString(16);
      
      // Check if we're on Sepolia testnet
      if (chainId !== '0xaa36a7') {
        // Try to switch to Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
          // Wait a moment for the network switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError) {
          // If Sepolia is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [NETWORKS.sepolia],
            });
            // Wait a moment for the network to be added
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      throw error;
    }
  }

  // Log a new activity on the blockchain
  async logActivity(activityType, note, duration = 15) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Ensure we're on the correct network before proceeding
      await this.checkNetwork();

      // Call the smart contract
      const tx = await this.contract.logActivity(activityType, note);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to log activity:', error);
      
      // Provide more specific error messages
      if (error.message.includes('network changed')) {
        throw new Error('Network changed during transaction. Please ensure you are connected to Sepolia testnet and try again.');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for gas. Please ensure you have some Sepolia testnet ETH.');
      } else if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user.');
      } else {
        throw new Error(`Failed to log activity: ${error.message}`);
      }
    }
  }

  // Fetch user's activity logs from the blockchain
  async getUserLogs(userAddress) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const logs = await this.contract.getLogs(userAddress);
      
      return logs.map((log, index) => {
        // Try to extract duration from the note if it's stored there
        let duration = 15; // Default duration
        
        // Look for duration pattern in the note like "session for 30 minutes"
        const durationMatch = log.note.match(/for (\d+) minutes?/);
        if (durationMatch) {
          duration = parseInt(durationMatch[1]);
        } else {
          // Look for other duration patterns like "30 min" or "30m"
          const altDurationMatch = log.note.match(/(\d+)\s*(?:min|minutes?|m)/);
          if (altDurationMatch) {
            duration = parseInt(altDurationMatch[1]);
          }
        }
        
        return {
          id: index,
          type: log.activityType,
          description: log.note,
          timestamp: log.timestamp.toString(),
          duration: duration,
          txHash: `tx-${index}` // Use index as transaction identifier
        };
      });
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
      throw error;
    }
  }

  // Fetch user's badges from the blockchain
  async getUserBadges(userAddress) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const badgeIds = await this.contract.getUserBadges(userAddress);
      
      return badgeIds.map((id, index) => ({
        id: id.toString(),
        name: `Chill Badge #${id}`,
        description: 'Earned for completing 3+ chill activities',
        rarity: 'common',
        tokenId: id.toString()
      }));
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
      throw error;
    }
  }



  // Mint a tree NFT (after completing required activities)
  async mintTreeNFT(treeId, mintCost) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Ensure we're on the correct network before proceeding
      await this.checkNetwork();

      // Check if the contract has the mintTreeNFT function
      if (typeof this.contract.mintTreeNFT !== 'function') {
        throw new Error('Tree minting not available in current contract. Please deploy the updated contract.');
      }

      // Generate token URI for the tree
      const tokenURI = JSON.stringify({
        name: `Tree ${treeId}`,
        description: `A beautiful tree from your grove`,
        image: `https://grove-wellness.com/trees/${treeId}.png`
      });

      // Convert mint cost to wei
      const mintCostWei = ethers.parseEther(mintCost);

      // Call the smart contract to mint tree
      const tx = await this.contract.mintTreeNFT(treeId, tokenURI, { value: mintCostWei });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        treeId: treeId
      };
    } catch (error) {
      console.error('Failed to mint tree:', error);
      throw error;
    }
  }

  // Get contract statistics
  async getContractStats() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const signerAddress = await this.signer.getAddress();
      const logs = await this.contract.getLogs(signerAddress);
      
      // Try to get trees, but fallback gracefully if the function doesn't exist
      let trees = [];
      try {
        if (typeof this.contract.getUserTrees === 'function') {
          trees = await this.contract.getUserTrees(signerAddress);
        } else if (typeof this.contract.getUserBadges === 'function') {
          // Fallback to old badge system
          const badges = await this.contract.getUserBadges(signerAddress);
          trees = badges; // Use badges as trees for backward compatibility
        }
      } catch (treeError) {
        console.log('Tree/Badge functions not available in current contract, using fallback');
        // Fallback to empty array if tree functions don't exist
        trees = [];
      }

      // Calculate total time from activities
      // For now, we'll estimate 15 minutes per activity since the current contract doesn't store duration
      // In the future, you could modify the contract to store duration and calculate actual time
      const totalMinutes = logs.length * 15;
      
      return {
        totalSessions: logs.length,
        totalMinutes: totalMinutes,
        trees: trees // Return the actual trees array, not just the length
      };
    } catch (error) {
      console.error('Failed to get contract stats:', error);
      throw error;
    }
  }

  // Listen to blockchain events
  setupEventListeners(onActivityLogged, onTreeMinted) {
    if (!this.contract) return;

    // Listen for ActivityLogged events
    this.contract.on('ActivityLogged', (user, activityType, note, timestamp, event) => {
      onActivityLogged({
        user,
        activityType,
        note,
        timestamp: timestamp.toString(),
        transactionHash: event.transactionHash
      });
    });

    // Only listen to BadgeMinted events (TreeMinted doesn't exist in current contract)
    try {
      this.contract.on('BadgeMinted', (user, tokenId, tokenURI, event) => {
        onTreeMinted({
          user,
          tokenId: tokenId.toString(),
          treeId: 'legacy-badge',
          tokenURI,
          transactionHash: event.transactionHash
        });
      });
    } catch (error) {
      console.log('BadgeMinted event not available in current contract');
    }
  }

  // Remove event listeners
  removeEventListeners() {
    if (!this.contract) return;
    
    try {
      this.contract.removeAllListeners('ActivityLogged');
    } catch (error) {
      console.log('Error removing ActivityLogged listeners:', error);
    }
    
    // Remove BadgeMinted listeners - only try this, don't try TreeMinted as it doesn't exist
    try {
      this.contract.removeAllListeners('BadgeMinted');
    } catch (error) {
      console.log('BadgeMinted listeners not available');
    }
  }

  // Get user's minted trees from the blockchain
  async getUserTrees(userAddress = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Use current user address if none provided
      const targetAddress = userAddress || await this.signer.getAddress();
      
      // Check if the contract has the getUserTrees function
      if (typeof this.contract.getUserTrees !== 'function') {
        console.log('getUserTrees function not available in current contract');
        // Fallback to getUserBadges for backward compatibility
        if (typeof this.contract.getUserBadges === 'function') {
          return await this.contract.getUserBadges(targetAddress);
        }
        return [];
      }

      const treeTokenIds = await this.contract.getUserTrees(targetAddress);
      console.log('Raw token IDs from contract:', treeTokenIds);
      
      // Try to get tree details for each token ID to map them to tree IDs
      const treeIds = [];
      for (let tokenId of treeTokenIds) {
        try {
          console.log('Getting tree details for token ID:', tokenId.toString());
          
          // Try to get tree details from the contract if available
          if (typeof this.contract.getTreeDetails === 'function') {
            const treeDetails = await this.contract.getTreeDetails(tokenId);
            console.log('Tree details:', treeDetails);
            // Extract tree ID from details if available
            if (treeDetails && treeDetails.treeType) {
              // Map tree details to our tree IDs
              const mappedTreeId = this.mapContractDataToTreeId(treeDetails);
              if (mappedTreeId) {
                treeIds.push(mappedTreeId);
              }
            }
          } else {
            // Fallback: try to get token URI and parse it
            try {
              if (typeof this.contract.tokenURI === 'function') {
                const tokenURI = await this.contract.tokenURI(tokenId);
                console.log('Token URI:', tokenURI);
                // Try to extract tree ID from token URI or metadata
                const parsedData = JSON.parse(tokenURI);
                if (parsedData.name) {
                  // Extract tree ID from name like "Tree oak-seedling"
                  const match = parsedData.name.match(/Tree (.*)/i);
                  if (match) {
                    treeIds.push(match[1]);
                  }
                }
              }
            } catch (uriError) {
              console.log('Could not get URI for token:', tokenId, uriError);
            }
          }
        } catch (detailError) {
          console.log('Could not get details for token:', tokenId, detailError);
          // Add the token ID as fallback
          treeIds.push(tokenId.toString());
        }
      }
      
      console.log('Mapped tree IDs:', treeIds);
      return treeIds;
    } catch (error) {
      console.error('Failed to get user trees:', error);
      // Return empty array on error to prevent app breaking
      return [];
    }
  }

  // Helper function to map contract tree data to our tree IDs
  mapContractDataToTreeId(treeDetails) {
    try {
      // Based on the tree type and other details, map to our tree IDs
      const treeType = treeDetails.treeType;
      const growthStage = treeDetails.growthStage;
      
      // Create mapping based on tree definitions
      if (treeType === 'oak' && growthStage === 'seedling') return 'oak-seedling';
      if (treeType === 'maple' && growthStage === 'seedling') return 'maple-seedling';
      if (treeType === 'cherry' && growthStage === 'young') return 'cherry-blossom';
      if (treeType === 'willow' && growthStage === 'young') return 'willow-tree';
      if (treeType === 'birch' && growthStage === 'young') return 'birch-tree';
      if (treeType === 'oak' && growthStage === 'mature') return 'ancient-oak';
      if (treeType === 'redwood' && growthStage === 'mature') return 'redwood-tree';
      if (treeType === 'banyan' && growthStage === 'mature') return 'sacred-banyan';
      if (treeType === 'world' && growthStage === 'legendary') return 'world-tree';
      if (treeType === 'grove' && growthStage === 'legendary') return 'eternal-grove';
      
      // Default fallback
      return `${treeType}-${growthStage}`;
    } catch (error) {
      console.log('Error mapping tree data:', error);
      return null;
    }
  }

  // Check contract health
  async checkContractHealth() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Test if contract is responsive by calling a simple view function
      const address = await this.signer.getAddress();
      const logs = await this.contract.getLogs(address);
      
      return {
        healthy: true,
        contractAddress: CONTRACT_ADDRESS,
        userAddress: address,
        activitiesCount: logs.length
      };
    } catch (error) {
      console.error('Contract health check failed:', error);
      return {
        healthy: false,
        error: error.message,
        contractAddress: CONTRACT_ADDRESS
      };
    }
  }

  // Disconnect from blockchain service
  disconnect() {
    this.removeEventListeners();
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isInitialized = false;
  }

  // Get current account
  async getCurrentAccount() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get current account:', error);
      throw error;
    }
  }


}

const blockchainService = new BlockchainService();
export default blockchainService;
