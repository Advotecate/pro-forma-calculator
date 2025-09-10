import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, Zap, ChartBar, 
  Settings, Activity, Target
} from 'lucide-react';

interface RevenueStreams {
  mediaCommissions: number;
  saasSubscriptions: number;
  marketplace: number;
  transactionFees: number;
  smsRevenue: number;
  consulting: number;
}

interface OrganizationType {
  count: number;
  capturedCount: number; // Actual number of this organization type we capture
  primarySpend: number;
  generalSpend: number;
  primaryFundraising: number;
  generalFundraising: number;
  primarySms: number;
  generalSms: number;
  subscriptionPrices: {
    votebuilder: number;
    eventPlatform: number;
    mapping: number;
    advancedVoterData: number;
  };
}

const ProFormaCalculator: React.FC = () => {
  // State for calculation method toggle
  const [useMarketShareMode, setUseMarketShareMode] = useState(false); // false = individual mode, true = market share mode
  
  // State for all interactive controls
  const [marketShare, setMarketShare] = useState(100); // percentage for calculations
  const [transactionFeeTotal, setTransactionFeeTotal] = useState(350); // basis points
  const [transactionFeeNet, setTransactionFeeNet] = useState(100); // basis points we keep

  const [mediaCommissionRate, setMediaCommissionRate] = useState(5); // percentage
  const [mediaPurchaseRate, setMediaPurchaseRate] = useState(20); // percentage of campaigns that purchase media
  const [smsProfit, setSmsProfit] = useState(0.001); // per SMS
  const [consultingMargin, setConsultingMargin] = useState(10); // percentage

  // Advanced settings toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Organization accordion state
  const [expandedOrgs, setExpandedOrgs] = useState<Record<string, boolean>>({
    localSmall: false,
    localLarge: false,
    stateHouse: false,
    stateSenate: false,
    statewide: false,
    usHouse: false,
    usSenate: false,
  });

  // Organization types with segmented data
  const [organizationTypes, setOrganizationTypes] = useState<Record<string, OrganizationType>>({
    localSmall: {
      count: 12000,
      capturedCount: 100,          // Local Small campaigns captured
      primarySpend: 5000,
      generalSpend: 10000,
      primaryFundraising: 2500,    // Typically 50% of media spend
      generalFundraising: 7500,    // 75% of media spend
      primarySms: 50000,           // 50K messages per campaign
      generalSms: 100000,          // 100K messages per campaign
      subscriptionPrices: {
        votebuilder: 100,
        eventPlatform: 75,
        mapping: 100,
        advancedVoterData: 250,
      }
    },
    localLarge: {
      count: 350,
      capturedCount: 20,           // Local Large campaigns captured
      primarySpend: 25000,
      generalSpend: 500000,
      primaryFundraising: 150000,  // 60% of media spend  
      generalFundraising: 1000000, // 80% of media spend
      primarySms: 50000,           // 50K messages per campaign
      generalSms: 250000,          // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 250,
        eventPlatform: 100,
        mapping: 200,
        advancedVoterData: 400,
      }
    },
    stateHouse: {
      count: 4809,
      capturedCount: 35,           // State House campaigns captured
      primarySpend: 2500,
      generalSpend: 150000,
      primaryFundraising: 35000,   // 70% of media spend
      generalFundraising: 120000,  // 80% of media spend
      primarySms: 10000,           // 10K messages per campaign
      generalSms: 50000,           // 50K messages per campaign
      subscriptionPrices: {
        votebuilder: 400,
        eventPlatform: 100,
        mapping: 200,
        advancedVoterData: 500,
      }
    },
    stateSenate: {
      count: 1254,
      capturedCount: 20,           // State Senate campaigns captured
      primarySpend: 5000,
      generalSpend: 200000,
      primaryFundraising: 50000,   // 80% of media spend
      generalFundraising: 250000,  // 83% of media spend
      primarySms: 50000,           // 50K messages per campaign
      generalSms: 250000,          // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 500,
        eventPlatform: 150,
        mapping: 250,
        advancedVoterData: 750,
      }
    },
    statewide: {
      count: 463,
      capturedCount: 5,            // Statewide campaigns captured
      primarySpend: 250000,
      generalSpend: 10000,
      primaryFundraising: 4500000, // 90% of media spend
      generalFundraising: 18000000,// 90% of media spend  
      primarySms: 500000,          // 500K messages per campaign
      generalSms: 2000000,         // 2M messages per campaign
      subscriptionPrices: {
        votebuilder: 1000,
        eventPlatform: 250,
        mapping: 450,
        advancedVoterData: 1500,
      }
    },
    usHouse: {
      count: 870,
      capturedCount: 20,           // U.S. House campaigns captured
      primarySpend: 25000,
      generalSpend: 3000000,
      primaryFundraising: 450000,  // 90% of media spend
      generalFundraising: 270000,  // 90% of media spend
      primarySms: 50000,           // 50K messages per campaign
      generalSms: 250000,          // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 500,
        eventPlatform: 150,
        mapping: 250,
        advancedVoterData: 1000,
      }
    },
    usSenate: {
      count: 119,
      capturedCount: 1,            // U.S. Senate campaigns captured
      primarySpend: 2500000,
      generalSpend: 10000000,
      primaryFundraising: 2000000, // 100% of media spend
      generalFundraising: 10000000,// 100% of media spend
      primarySms: 15000000,        // 15M messages per campaign
      generalSms: 35000000,        // 35M messages per campaign
      subscriptionPrices: {
        votebuilder: 1000,
        eventPlatform: 250,
        mapping: 450,
        advancedVoterData: 1500,
      }
    }
  });

  // Additional market data (non-organization specific)
  const [marketData, setMarketData] = useState({
    primaryConsulting: 500000,      // $500K consulting market (primary)
    generalConsulting: 1000000,     // $1M consulting market (general) 
    marketplaceListings: 50000,     // $50K monthly marketplace listing fees
    contractorGmvAnnual: 2000000,   // $2M annual contractor transaction volume
  });

  // Operating expenses (adjustable)
  const [operatingExpenses, setOperatingExpenses] = useState({
    engineering: 80000,        // Monthly engineering costs
    mediaOperations: 0,        // Monthly media operations
    aiServices: 2500,          // Monthly AI/API costs
    salesGrowth: 25000,        // Monthly sales & growth
    infrastructure: 15000,     // Monthly infrastructure
    marketing: 25000,          // Monthly marketing
    compliance: 10000,         // Monthly compliance/legal
  });

  // Business assumptions (now adjustable)
  const [businessAssumptions, setBusinessAssumptions] = useState({
    saasServiceTakeRate: 30, // percentage who take multiple services
    marketplaceCommissionRate: 10, // percentage commission on GMV
    monthlyMultiplier: 12, // annual calculation multiplier
  });

  // Calculate revenues based on inputs
  const calculateRevenues = (): RevenueStreams => {
    const shareMultiplier = marketShare / 100;
    
    let totalPrimaryMediaSpend, totalGeneralMediaSpend, totalPrimaryFundraising, totalGeneralFundraising, totalPrimarySms, totalGeneralSms;
    
    if (useMarketShareMode) {
      // Market Share Mode: Use percentage of Total Addressable Market
      totalPrimaryMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.primarySpend), 0) * shareMultiplier;
      totalGeneralMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.generalSpend), 0) * shareMultiplier;
      totalPrimaryFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.primaryFundraising), 0) * shareMultiplier;
      totalGeneralFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.generalFundraising), 0) * shareMultiplier;
      totalPrimarySms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.primarySms), 0) * shareMultiplier;
      totalGeneralSms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * type.generalSms), 0) * shareMultiplier;
    } else {
      // Individual Mode: Use specific captured counts directly (no scaling)
      totalPrimaryMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.primarySpend), 0);
      totalGeneralMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.generalSpend), 0);
      totalPrimaryFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.primaryFundraising), 0);
      totalGeneralFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.generalFundraising), 0);
      totalPrimarySms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.primarySms), 0);
      totalGeneralSms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedCount * type.generalSms), 0);
    }
    
    // Media Commissions (only 20% of captured campaigns purchase media)
    const totalMediaMarket = totalPrimaryMediaSpend + totalGeneralMediaSpend;
    const mediaPurchaseMultiplier = mediaPurchaseRate / 100;
    const mediaCommissions = totalMediaMarket * mediaPurchaseMultiplier * (mediaCommissionRate / 100);
    
    // Transaction Fees (calculated from organization-specific fundraising) 
    const totalFundraising = totalPrimaryFundraising + totalGeneralFundraising;
    const transactionFees = totalFundraising * (transactionFeeNet / 10000); // Annual fundraising, no monthly multiplier needed
    
    // SaaS Subscriptions (calculated by organization type with different pricing)
    let saasSubscriptions = 0;
    Object.values(organizationTypes).forEach(type => {
      const typeSubscriberCount = useMarketShareMode ? (type.count * shareMultiplier) : type.capturedCount;
      const typeAvgPrice = (
        type.subscriptionPrices.votebuilder + 
        type.subscriptionPrices.eventPlatform + 
        type.subscriptionPrices.mapping + 
        type.subscriptionPrices.advancedVoterData
      ) / 4;
      saasSubscriptions += typeSubscriberCount * typeAvgPrice * businessAssumptions.monthlyMultiplier * (businessAssumptions.saasServiceTakeRate / 100);
    });
    
    // Marketplace - only apply scaling in Market Share mode
    const marketplaceScaling = useMarketShareMode ? shareMultiplier : 1;
    const marketplace = (marketData.marketplaceListings * marketplaceScaling * businessAssumptions.monthlyMultiplier) + 
                       (marketData.contractorGmvAnnual * marketplaceScaling * (businessAssumptions.marketplaceCommissionRate / 100));
    
    // SMS Revenue (calculated from organization-specific SMS volumes)
    const totalSms = totalPrimarySms + totalGeneralSms;
    const smsRevenue = totalSms * smsProfit;
    
    // Consulting - only apply scaling in Market Share mode  
    const totalConsulting = marketData.primaryConsulting + marketData.generalConsulting;
    const consultingScaling = useMarketShareMode ? shareMultiplier : 1;
    const consulting = totalConsulting * consultingScaling * (consultingMargin / 100) * businessAssumptions.monthlyMultiplier;
    
    // Return revenues without additional scaling (already applied in mode-specific calculations)
    return {
      mediaCommissions,
      saasSubscriptions,
      marketplace,
      transactionFees,
      smsRevenue,
      consulting
    };
  };

  // Helper function to get total organizations
  const getTotalOrganizations = () => {
    return Object.values(organizationTypes).reduce((sum, type) => sum + type.count, 0);
  };

  // Helper function to get organizations count based on current mode
  const getEffectiveOrganizations = () => {
    if (useMarketShareMode) {
      // Market Share Mode: Show percentage of total addressable market
      return Math.round(getTotalOrganizations() * (marketShare / 100));
    } else {
      // Individual Mode: Show the actual captured counts (what user set)
      return Object.values(organizationTypes).reduce((sum, type) => sum + type.capturedCount, 0);
    }
  };

  // Helper function to toggle organization accordion
  const toggleOrganization = (key: string) => {
    setExpandedOrgs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper function to handle mode switching
  const handleModeToggle = () => {
    const newMode = !useMarketShareMode;
    setUseMarketShareMode(newMode);
    
    // Reset market share to 5% when switching TO market share mode
    if (newMode) {
      setMarketShare(5);
    } else {
      // Set to 100% when switching to individual mode (but slider will be disabled)
      setMarketShare(100);
    }
  };

  // State for quarterly accordions
  const [expandedQuarters, setExpandedQuarters] = useState<Record<string, boolean>>({
    'Q4-2025': false,
    'Q1-2026': false,
    'Q2-2026': false,
    'Q3-2026': false,
    'Q4-2026': false,
  });

  // Helper function to toggle quarterly accordion
  const toggleQuarter = (quarter: string) => {
    setExpandedQuarters(prev => ({
      ...prev,
      [quarter]: !prev[quarter]
    }));
  };

  // Calculate monthly breakdown based on current settings
  const calculateMonthlyBreakdown = () => {
    const annualRevenues = calculateRevenues();
    const annualRevenue = Object.values(annualRevenues).reduce((a, b) => a + b, 0);
    const monthlyOpEx = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);
    
    // Campaign season timeline - different revenue patterns throughout the year
    const months = [
      // Q4 2025 - Pre-launch phase
      { month: 'Oct 2025', label: 'October 2025', revenueMultiplier: 0, launchPhase: 'pre-launch' },
      { month: 'Nov 2025', label: 'November 2025', revenueMultiplier: 0, launchPhase: 'pre-launch' },
      { month: 'Dec 2025', label: 'December 2025', revenueMultiplier: 0.005, launchPhase: 'soft-launch' }, // 0.5% of annual
      
      // Q1 2026 - Platform launch
      { month: 'Jan 2026', label: 'January 2026', revenueMultiplier: 0.01, launchPhase: 'launch' }, // 1% of annual
      { month: 'Feb 2026', label: 'February 2026', revenueMultiplier: 0.05, launchPhase: 'early-growth' }, // 5% of annual - campaign season begins
      { month: 'Mar 2026', label: 'March 2026', revenueMultiplier: 0.08, launchPhase: 'growth' }, // 8% of annual
      
      // Q2 2026 - Primary season ramp up
      { month: 'Apr 2026', label: 'April 2026', revenueMultiplier: 0.12, launchPhase: 'primary-season' }, // 12% of annual
      { month: 'May 2026', label: 'May 2026', revenueMultiplier: 0.15, launchPhase: 'primary-season' }, // 15% of annual
      { month: 'Jun 2026', label: 'June 2026', revenueMultiplier: 0.18, launchPhase: 'primary-season' }, // 18% of annual
      
      // Q3 2026 - Late primary / early general
      { month: 'Jul 2026', label: 'July 2026', revenueMultiplier: 0.20, launchPhase: 'late-primary' }, // 20% of annual
      { month: 'Aug 2026', label: 'August 2026', revenueMultiplier: 0.25, launchPhase: 'general-election' }, // 25% of annual
      { month: 'Sep 2026', label: 'September 2026', revenueMultiplier: 0.30, launchPhase: 'general-election' }, // 30% of annual
      
      // Q4 2026 - General election peak
      { month: 'Oct 2026', label: 'October 2026', revenueMultiplier: 0.35, launchPhase: 'election-peak' }, // 35% of annual
      { month: 'Nov 2026', label: 'November 2026', revenueMultiplier: 0.40, launchPhase: 'election-peak' }, // 40% of annual - election month
    ];

    return months.map(({ month, label, revenueMultiplier, launchPhase }) => {
      const monthlyRevenue = annualRevenue * revenueMultiplier;
      const monthlyExpenses = monthlyOpEx;
      const netIncome = monthlyRevenue - monthlyExpenses;
      
      return {
        month,
        label,
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        netIncome,
        launchPhase,
        revenueMultiplier
      };
    });
  };

  const monthlyData = calculateMonthlyBreakdown();

  // Group months by quarters
  const quarterlyData = {
    'Q4-2025': {
      label: 'Q4 2025 - Pre-Launch',
      months: monthlyData.slice(0, 3),
      description: 'Platform development and soft launch preparation'
    },
    'Q1-2026': {
      label: 'Q1 2026 - Platform Launch', 
      months: monthlyData.slice(3, 6),
      description: 'Official platform launch and early customer acquisition'
    },
    'Q2-2026': {
      label: 'Q2 2026 - Primary Season',
      months: monthlyData.slice(6, 9),
      description: 'Primary election season - significant revenue growth'
    },
    'Q3-2026': {
      label: 'Q3 2026 - General Election Ramp',
      months: monthlyData.slice(9, 12),
      description: 'Transition to general election - peak activity begins'
    },
    'Q4-2026': {
      label: 'Q4 2026 - Election Peak',
      months: monthlyData.slice(12, 14),
      description: 'General election peak - maximum revenue and activity'
    }
  };

  const revenues = calculateRevenues();
  const totalRevenue = Object.values(revenues).reduce((a, b) => a + b, 0);
  const totalMonthlyOpEx = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);
  const operatingCosts = totalMonthlyOpEx * 12; // Annual OpEx
  const netIncome = totalRevenue - operatingCosts;
  const ebitdaMargin = ((totalRevenue - operatingCosts) / totalRevenue * 100) || 0;
  
  // ROI based on 10% profit share from $300K investment
  const investmentAmount = 300000;
  const profitSharePercentage = 10; // 10% of net profits
  const annualProfitShare = netIncome * (profitSharePercentage / 100);
  const roi = (annualProfitShare / investmentAmount * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-mint-400 rounded-full opacity-10 animate-float-slow blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue rounded-full opacity-10 animate-float-reverse blur-3xl" />
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-medium text-ink mb-2">ADVOTECATE Pro-Forma</h1>
          <p className="text-lg text-muted">Interactive Financial Calculator</p>
        </div>

        {/* Key Metrics Cards - Sticky */}
        <div className="sticky top-4 z-40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-7 h-7 text-mint-600" />
              </div>
              <p className="text-xs text-muted mb-1">Total Revenue</p>
              <p className="text-xl font-heading font-medium text-ink">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Settings className="w-7 h-7 text-red-600" />
              </div>
              <p className="text-xs text-muted mb-1">Operating Expenses</p>
              <p className="text-xl font-heading font-medium text-red-600">
                ${(operatingCosts / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-7 h-7 text-mint-600" />
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  {ebitdaMargin.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted mb-1">Net Income</p>
              <p className="text-xl font-heading font-medium text-ink">
                ${(netIncome / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-xs text-muted mb-1">Organizations</p>
              <p className="text-xl font-heading font-medium text-ink">
                {getEffectiveOrganizations().toLocaleString()}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-7 h-7 text-warning" />
              </div>
              <p className="text-xs text-muted mb-1">Cash at Year End</p>
              <p className="text-xl font-heading font-medium text-ink">
                ${((netIncome + 300000) / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-success/50 shadow-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-7 h-7 text-success" />
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  10% Share
                </span>
              </div>
              <p className="text-xs text-muted mb-1">ROI (Annual Return)</p>
              <p className="text-xl font-heading font-medium text-success">
                {roi.toFixed(0)}%
              </p>
              <p className="text-xs text-muted">
                ${(annualProfitShare / 1000000).toFixed(1)}M return
              </p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-heading font-medium text-ink mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-mint-600" />
            Interactive Controls
          </h2>

          {/* Calculation Mode Toggle */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-ink">Calculation Method</h3>
                <p className="text-sm text-muted">Choose between overall market share or individual organization targeting</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${!useMarketShareMode ? 'text-mint-600' : 'text-muted'}`}>
                  Individual
                </span>
                <button
                  onClick={handleModeToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:ring-offset-2 ${
                    useMarketShareMode ? 'bg-mint-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      useMarketShareMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${useMarketShareMode ? 'text-mint-600' : 'text-muted'}`}>
                  Market Share
                </span>
              </div>
            </div>
            
            {/* Mode Description */}
            <div className="text-sm text-muted">
              {useMarketShareMode ? (
                <p>🎯 <strong>Market Share Mode:</strong> Calculate based on percentage of Total Addressable Market (23,265 total organizations). Individual org sliders are disabled.</p>
              ) : (
                <p>🎛️ <strong>Individual Mode:</strong> Set specific organization counts with your sliders. Market share slider is disabled - revenues calculated directly from your targets.</p>
              )}
            </div>
          </div>

          {/* Market Share Slider */}
          <div className={`mb-8 ${!useMarketShareMode ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-medium text-ink flex items-center">
                  <Target className="w-5 h-5 mr-2 text-mint-600" />
                  {useMarketShareMode ? 'Market Share (% of TAM)' : 'Market Share (Disabled)'}
                </label>
                <p className="text-sm text-muted mt-1">
                  {useMarketShareMode 
                    ? 'Percentage of 23,265 total organizations to capture'
                    : 'Disabled in Individual Mode - revenues calculated directly from organization targets'
                  }
                </p>
              </div>
              <span className={`text-2xl font-heading font-medium ${useMarketShareMode ? 'text-mint-600' : 'text-gray-400'}`}>
                {useMarketShareMode ? `${marketShare}%` : 'N/A'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={marketShare}
              onChange={(e) => setMarketShare(Number(e.target.value))}
              disabled={!useMarketShareMode}
              className={`w-full h-3 rounded-lg appearance-none ${
                useMarketShareMode 
                  ? 'bg-gradient-to-r from-mint-100 to-mint-600 cursor-pointer slider' 
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
              style={useMarketShareMode ? {
                background: `linear-gradient(to right, #3EB489 0%, #3EB489 ${marketShare}%, #E9FBF6 ${marketShare}%, #E9FBF6 100%)`
              } : {}}
            />
            <div className="flex justify-between text-xs text-muted mt-2">
              {useMarketShareMode ? (
                <>
                  <span>1%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </>
              ) : (
                <>
                  <span>Disabled</span>
                  <span></span>
                  <span>Individual Mode</span>
                  <span></span>
                  <span>Disabled</span>
                </>
              )}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left bg-mint-50 hover:bg-mint-100 transition-all duration-200 rounded-xl p-4"
            >
              <span className="text-lg font-medium text-ink">
                Advanced Market Assumptions
              </span>
              <span className="text-mint-600 transform transition-transform duration-200" 
                    style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 mb-8">
            <h3 className="text-xl font-heading font-medium text-ink mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-3 text-mint-600" />
              Market Data & Business Assumptions
            </h3>

            {/* Revenue Model Controls Section */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-ink mb-4">Revenue Model Parameters</h4>
              <p className="text-sm text-muted mb-4">Core assumptions that drive revenue calculations across all streams.</p>
              
              {/* Transaction Fees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Total Transaction Fee (basis points)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="100"
                      max="500"
                      value={transactionFeeTotal}
                      onChange={(e) => setTransactionFeeTotal(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-20 text-right">
                      {(transactionFeeTotal / 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Net Profit (basis points)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max={transactionFeeTotal}
                      value={transactionFeeNet}
                      onChange={(e) => setTransactionFeeNet(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-20 text-right">
                      {(transactionFeeNet / 100).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Processor gets: {((transactionFeeTotal - transactionFeeNet) / 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Other Revenue Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Media Commission Rate
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={mediaCommissionRate}
                      onChange={(e) => setMediaCommissionRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-16 text-right">
                      {mediaCommissionRate}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Media Purchase Rate
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="5"
                      value={mediaPurchaseRate}
                      onChange={(e) => setMediaPurchaseRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-16 text-right">
                      {mediaPurchaseRate}%
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    % of captured campaigns that purchase media
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    SMS Profit (per message)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={smsProfit}
                      onChange={(e) => setSmsProfit(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Consulting Margin
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={consultingMargin}
                      onChange={(e) => setConsultingMargin(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-16 text-right">
                      {consultingMargin}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Data Section */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-ink mb-4">General Market Data & Operating Expenses</h4>
              <p className="text-sm text-muted mb-4">Organization-specific data (counts, media spending, fundraising, SMS) is configured in the Organization-Specific section below.</p>
              
              {/* Operating Expenses Section */}
              <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
                <h5 className="text-sm font-medium text-ink mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Monthly Operating Expenses
                  <span className="ml-auto text-lg font-semibold text-red-600">
                    ${totalMonthlyOpEx.toLocaleString()}/mo
                  </span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Engineering ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.engineering}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, engineering: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">Platform, integrations, AI development</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Media Operations ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.mediaOperations}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, mediaOperations: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">Media buying relationships</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">AI Services ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.aiServices}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, aiServices: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">OpenAI, Claude APIs</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Sales & Growth ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.salesGrowth}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, salesGrowth: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">Enterprise accounts, customer success</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Infrastructure ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.infrastructure}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, infrastructure: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">AWS, GCP scaling</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Marketing ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.marketing}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, marketing: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">Digital marketing, events</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">Compliance ($)</label>
                    <input
                      type="number"
                      step="1000"
                      value={operatingExpenses.compliance}
                      onChange={(e) => setOperatingExpenses({...operatingExpenses, compliance: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                    />
                    <p className="text-xs text-muted mt-1">FEC, legal compliance</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-ink">Annual Operating Expenses:</span>
                    <span className="text-lg font-semibold text-red-600">${operatingCosts.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Consulting Market ($M)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={(marketData.primaryConsulting + marketData.generalConsulting) / 1000000}
                    onChange={(e) => {
                      const total = Number(e.target.value) * 1000000;
                      const ratio = marketData.primaryConsulting / (marketData.primaryConsulting + marketData.generalConsulting);
                      setMarketData({
                        ...marketData, 
                        primaryConsulting: total * ratio,
                        generalConsulting: total * (1 - ratio)
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">Total consulting services market</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Marketplace Listings ($M)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marketData.marketplaceListings / 1000000}
                    onChange={(e) => setMarketData({...marketData, marketplaceListings: Number(e.target.value) * 1000000})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">Monthly marketplace listing fees</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Contractor GMV ($M)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={marketData.contractorGmvAnnual / 1000000}
                    onChange={(e) => setMarketData({...marketData, contractorGmvAnnual: Number(e.target.value) * 1000000})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">Annual contractor transaction volume</p>
                </div>
              </div>
            </div>

            {/* Business Assumptions Section */}
            <div>
              <h4 className="text-lg font-medium text-ink mb-4">Business Model Assumptions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    SaaS Multi-Service Rate (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={businessAssumptions.saasServiceTakeRate}
                    onChange={(e) => setBusinessAssumptions({...businessAssumptions, saasServiceTakeRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">% of customers using multiple SaaS services (includes Event Platform)</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Marketplace Commission (%)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    value={businessAssumptions.marketplaceCommissionRate}
                    onChange={(e) => setBusinessAssumptions({...businessAssumptions, marketplaceCommissionRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">% commission on contractor GMV</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Annualization Multiplier
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={businessAssumptions.monthlyMultiplier}
                    onChange={(e) => setBusinessAssumptions({...businessAssumptions, monthlyMultiplier: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">Multiplier for recurring revenue streams</p>
                </div>
              </div>
            </div>

            {/* Organization Types Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-ink">Organization-Specific Market Data & Pricing</h4>
                  {useMarketShareMode && (
                    <p className="text-sm text-warning mt-1">⚠️ Individual organization controls disabled in Market Share mode</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted mb-6">Configure counts, media spending, fundraising, SMS volumes, and subscription pricing for each organization type. Default values are based on your ProForma analysis.</p>
              
              {/* Market Summary */}
              <div className="mb-6 p-4 bg-mint-50 rounded-xl border border-mint-200">
                <h5 className="text-sm font-medium text-ink mb-3">Market Summary</h5>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="text-xs font-medium text-ink mb-2">Total Addressable Market (TAM)</h6>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted">Organizations</span>
                        <p className="font-medium text-ink">{getTotalOrganizations().toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted">Media Market</span>
                        <p className="font-medium text-ink">
                          ${((Object.values(organizationTypes).reduce((sum, type) => 
                            sum + (type.count * (type.primarySpend + type.generalSpend)), 0
                          )) / 1000000000).toFixed(1)}B
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-xs font-medium text-ink mb-2">
                      {useMarketShareMode ? `Captured Market (${marketShare}% of TAM)` : 'Target Organizations (Direct)'}
                    </h6>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted">Organizations</span>
                        <p className="font-medium text-mint-600">
                          {getEffectiveOrganizations().toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted">Media Market</span>
                        <p className="font-medium text-mint-600">
                          ${useMarketShareMode 
                            ? (((Object.values(organizationTypes).reduce((sum, type) => 
                                sum + (type.count * (type.primarySpend + type.generalSpend)), 0
                              )) * (marketShare / 100)) / 1000000).toFixed(0)
                            : (((Object.values(organizationTypes).reduce((sum, type) => 
                                sum + (type.capturedCount * (type.primarySpend + type.generalSpend)), 0
                              )) / 1000000).toFixed(0))
                          }M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {Object.entries(organizationTypes).map(([key, type]) => {
                const typeLabels: Record<string, string> = {
                  localSmall: 'Local Small',
                  localLarge: 'Local Large',
                  stateHouse: 'State House',
                  stateSenate: 'State Senate',
                  statewide: 'Statewide/Gov',
                  usHouse: 'U.S. House',
                  usSenate: 'U.S. Senate'
                };

                return (
                  <div key={key} className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleOrganization(key)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <h5 className="text-base font-medium text-ink">{typeLabels[key]}</h5>
                        <div className="flex items-center space-x-4 text-sm text-muted">
                          <span>{type.count.toLocaleString()} orgs</span>
                          <span className="bg-mint-100 text-mint-700 px-2 py-1 rounded text-xs font-medium">{type.capturedCount} captured</span>
                          <span>${((type.primarySpend + type.generalSpend) * type.count / 1000000).toFixed(1)}M media</span>
                          <span>${((type.primaryFundraising + type.generalFundraising) * type.count / 1000000).toFixed(1)}M fundraising</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted">
                          {expandedOrgs[key] ? 'Collapse' : 'Expand'}
                        </span>
                        <span 
                          className="text-mint-600 transform transition-transform duration-200" 
                          style={{ transform: expandedOrgs[key] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▼
                        </span>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {expandedOrgs[key] && (
                      <div className="p-6 bg-white border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-ink">Organization Count</span>
                            <input
                              type="number"
                              value={type.count}
                              onChange={(e) => {
                                const newTypes = { ...organizationTypes };
                                newTypes[key].count = Number(e.target.value);
                                setOrganizationTypes(newTypes);
                              }}
                              className="w-24 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                            />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-ink">Organizations Captured</span>
                              <span className="text-sm font-medium text-mint-600">{type.capturedCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="range"
                                min="0"
                                max={type.count}
                                step="1"
                                value={type.capturedCount}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].capturedCount = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                disabled={useMarketShareMode}
                                className={`flex-1 h-2 bg-mint-100 rounded-lg appearance-none ${
                                  useMarketShareMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                }`}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted mt-1">
                              <span>0</span>
                              <span>{type.count.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                    {/* Per-Organization Market Data */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-ink mb-3">Per-Organization Market Data</h6>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">Primary Media Spend ($)</label>
                          <input
                            type="number"
                            value={type.primarySpend}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].primarySpend = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">General Media Spend ($)</label>
                          <input
                            type="number"
                            value={type.generalSpend}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].generalSpend = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">Primary Fundraising ($)</label>
                          <input
                            type="number"
                            value={type.primaryFundraising}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].primaryFundraising = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">General Fundraising ($)</label>
                          <input
                            type="number"
                            value={type.generalFundraising}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].generalFundraising = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">Primary SMS Messages</label>
                          <input
                            type="number"
                            value={type.primarySms}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].primarySms = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink mb-1 block">General SMS Messages</label>
                          <input
                            type="number"
                            value={type.generalSms}
                            onChange={(e) => {
                              const newTypes = { ...organizationTypes };
                              newTypes[key].generalSms = Number(e.target.value);
                              setOrganizationTypes(newTypes);
                            }}
                            className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Subscription Pricing */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-ink mb-3">Monthly Subscription Pricing</h6>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-medium text-ink mb-1 block">Votebuilder ($)</label>
                        <input
                          type="number"
                          value={type.subscriptionPrices.votebuilder}
                          onChange={(e) => {
                            const newTypes = { ...organizationTypes };
                            newTypes[key].subscriptionPrices.votebuilder = Number(e.target.value);
                            setOrganizationTypes(newTypes);
                          }}
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-ink mb-1 block">Event Platform ($)</label>
                        <input
                          type="number"
                          value={type.subscriptionPrices.eventPlatform}
                          onChange={(e) => {
                            const newTypes = { ...organizationTypes };
                            newTypes[key].subscriptionPrices.eventPlatform = Number(e.target.value);
                            setOrganizationTypes(newTypes);
                          }}
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-ink mb-1 block">Mapping ($)</label>
                        <input
                          type="number"
                          value={type.subscriptionPrices.mapping}
                          onChange={(e) => {
                            const newTypes = { ...organizationTypes };
                            newTypes[key].subscriptionPrices.mapping = Number(e.target.value);
                            setOrganizationTypes(newTypes);
                          }}
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-ink mb-1 block">Advanced Voter Data ($)</label>
                        <input
                          type="number"
                          value={type.subscriptionPrices.advancedVoterData}
                          onChange={(e) => {
                            const newTypes = { ...organizationTypes };
                            newTypes[key].subscriptionPrices.advancedVoterData = Number(e.target.value);
                            setOrganizationTypes(newTypes);
                          }}
                          className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-1 focus:ring-mint-100"
                        />
                      </div>
                    </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-ink block mb-2">Total Available Market (TAM)</span>
                          <div className="space-y-1 text-muted">
                            <div>Media: ${((type.primarySpend + type.generalSpend) * type.count / 1000000).toFixed(1)}M</div>
                            <div>Fundraising: ${((type.primaryFundraising + type.generalFundraising) * type.count / 1000000).toFixed(1)}M</div>
                            <div>SMS: {((type.primarySms + type.generalSms) * type.count / 1000000000).toFixed(2)}B msgs</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="bg-mint-50 p-3 rounded-lg">
                          <span className="font-medium text-mint-700 block mb-2">
                            {useMarketShareMode ? 'Our Captured Market' : 'Target Organizations'}
                          </span>
                          <div className="space-y-1 text-mint-600 text-xs">
                            <div>Organizations: {useMarketShareMode 
                              ? Math.round(type.count * (marketShare / 100)).toLocaleString()
                              : type.capturedCount.toLocaleString()
                            }</div>
                            <div>Media: ${useMarketShareMode 
                              ? (((type.primarySpend + type.generalSpend) * type.count * (marketShare / 100) / 1000000).toFixed(1))
                              : (((type.primarySpend + type.generalSpend) * type.capturedCount / 1000000).toFixed(1))
                            }M</div>
                            <div>Fundraising: ${useMarketShareMode 
                              ? (((type.primaryFundraising + type.generalFundraising) * type.count * (marketShare / 100) / 1000000).toFixed(1))
                              : (((type.primaryFundraising + type.generalFundraising) * type.capturedCount / 1000000).toFixed(1))
                            }M</div>
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Expand/Collapse All Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    const allExpanded = Object.values(expandedOrgs).every(expanded => expanded);
                    const newState = Object.keys(expandedOrgs).reduce((acc, key) => ({
                      ...acc,
                      [key]: !allExpanded
                    }), {});
                    setExpandedOrgs(newState);
                  }}
                  className="px-4 py-2 text-sm font-medium text-mint-600 bg-mint-50 hover:bg-mint-100 rounded-lg transition-colors duration-200"
                >
                  {Object.values(expandedOrgs).every(expanded => expanded) ? 'Collapse All' : 'Expand All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8">
          <h2 className="text-2xl font-heading font-medium text-ink mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-mint-600" />
            Revenue Breakdown
          </h2>
          
          <div className="space-y-4">
            {Object.entries(revenues).map(([key, value]) => {
              const percentage = (value / totalRevenue * 100) || 0;
              const labels: Record<string, string> = {
                mediaCommissions: 'Media Commissions',
                saasSubscriptions: 'SaaS Subscriptions',
                marketplace: 'Marketplace',
                transactionFees: 'Transaction Fees',
                smsRevenue: 'SMS Revenue',
                consulting: 'Consulting'
              };
              
              return (
                <div key={key} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-ink">{labels[key]}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted">{percentage.toFixed(1)}%</span>
                      <span className="text-lg font-medium text-ink">
                        ${(value / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-mint-400 to-mint-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-heading font-medium text-ink">Total Revenue</span>
              <span className="text-2xl font-heading font-medium text-mint-600">
                ${(totalRevenue / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Financial Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8">
          <h2 className="text-2xl font-heading font-medium text-ink mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-mint-600" />
            Monthly Financial Projections
          </h2>
          <p className="text-sm text-muted mb-6">
            Detailed month-by-month breakdown showing revenue ramp-up aligned with political campaign cycles from Q4 2025 through Q4 2026.
          </p>

          <div className="space-y-4">
            {Object.entries(quarterlyData).map(([quarterKey, quarter]) => {
              const quarterTotal = quarter.months.reduce((sum, month) => ({
                revenue: sum.revenue + month.revenue,
                expenses: sum.expenses + month.expenses,
                netIncome: sum.netIncome + month.netIncome
              }), { revenue: 0, expenses: 0, netIncome: 0 });

              return (
                <div key={quarterKey} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Quarter Header */}
                  <button
                    onClick={() => toggleQuarter(quarterKey)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-ink">{quarter.label}</h3>
                          <p className="text-sm text-muted mt-1">{quarter.description}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mr-8">
                          <div className="text-right">
                            <p className="text-xs text-muted">Quarter Revenue</p>
                            <p className="text-sm font-medium text-mint-600">
                              ${(quarterTotal.revenue / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted">Quarter Expenses</p>
                            <p className="text-sm font-medium text-red-600">
                              ${(quarterTotal.expenses / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted">Quarter Net Income</p>
                            <p className={`text-sm font-medium ${quarterTotal.netIncome >= 0 ? 'text-success' : 'text-red-600'}`}>
                              ${(quarterTotal.netIncome / 1000000).toFixed(2)}M
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span 
                      className="text-mint-600 transform transition-transform duration-200" 
                      style={{ transform: expandedQuarters[quarterKey] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Month Details */}
                  {expandedQuarters[quarterKey] && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-ink">Month</th>
                              <th className="text-right py-3 px-4 font-medium text-ink">Revenue</th>
                              <th className="text-right py-3 px-4 font-medium text-ink">Expenses</th>
                              <th className="text-right py-3 px-4 font-medium text-ink">Net Income</th>
                              <th className="text-right py-3 px-4 font-medium text-ink">Cumulative Cash</th>
                              <th className="text-center py-3 px-4 font-medium text-ink">Phase</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quarter.months.map((month, index) => {
                              // Calculate cumulative cash (starting with $300K investment)
                              const previousMonths = monthlyData.slice(0, monthlyData.indexOf(month) + 1);
                              const cumulativeCash = 300000 + previousMonths.reduce((sum, m) => sum + m.netIncome, 0);
                              
                              return (
                                <tr key={month.month} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="py-3 px-4 font-medium text-ink">{month.label}</td>
                                  <td className="py-3 px-4 text-right text-mint-600">
                                    ${(month.revenue / 1000).toFixed(0)}K
                                    {month.revenueMultiplier > 0 && (
                                      <span className="text-xs text-muted ml-1">
                                        ({(month.revenueMultiplier * 100).toFixed(1)}%)
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-right text-red-600">
                                    ${(month.expenses / 1000).toFixed(0)}K
                                  </td>
                                  <td className={`py-3 px-4 text-right font-medium ${
                                    month.netIncome >= 0 ? 'text-success' : 'text-red-600'
                                  }`}>
                                    ${(month.netIncome / 1000).toFixed(0)}K
                                  </td>
                                  <td className={`py-3 px-4 text-right font-medium ${
                                    cumulativeCash >= 0 ? 'text-success' : 'text-red-600'
                                  }`}>
                                    ${(cumulativeCash / 1000000).toFixed(2)}M
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      month.launchPhase === 'pre-launch' ? 'bg-gray-100 text-gray-700' :
                                      month.launchPhase === 'soft-launch' ? 'bg-blue-100 text-blue-700' :
                                      month.launchPhase === 'launch' ? 'bg-mint-100 text-mint-700' :
                                      month.launchPhase === 'early-growth' ? 'bg-green-100 text-green-700' :
                                      month.launchPhase === 'growth' ? 'bg-green-100 text-green-700' :
                                      month.launchPhase === 'primary-season' ? 'bg-yellow-100 text-yellow-700' :
                                      month.launchPhase === 'late-primary' ? 'bg-orange-100 text-orange-700' :
                                      month.launchPhase === 'general-election' ? 'bg-purple-100 text-purple-700' :
                                      month.launchPhase === 'election-peak' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {month.launchPhase.replace('-', ' ')}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Quarter Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center p-3 bg-mint-50 rounded-lg">
                            <p className="text-muted mb-1">Quarter Revenue</p>
                            <p className="font-medium text-mint-600">${(quarterTotal.revenue / 1000000).toFixed(2)}M</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-muted mb-1">Quarter Expenses</p>
                            <p className="font-medium text-red-600">${(quarterTotal.expenses / 1000000).toFixed(2)}M</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-muted mb-1">Quarter Net Income</p>
                            <p className={`font-medium ${quarterTotal.netIncome >= 0 ? 'text-success' : 'text-red-600'}`}>
                              ${(quarterTotal.netIncome / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-muted mb-1">Avg Monthly Revenue</p>
                            <p className="font-medium text-blue-600">
                              ${(quarterTotal.revenue / quarter.months.length / 1000000).toFixed(2)}M
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Expand/Collapse All Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                const allExpanded = Object.values(expandedQuarters).every(expanded => expanded);
                const newState = Object.keys(expandedQuarters).reduce((acc, key) => ({
                  ...acc,
                  [key]: !allExpanded
                }), {});
                setExpandedQuarters(newState);
              }}
              className="px-6 py-2 text-sm font-medium text-mint-600 bg-mint-50 hover:bg-mint-100 rounded-lg transition-colors duration-200"
            >
              {Object.values(expandedQuarters).every(expanded => expanded) ? 'Collapse All Quarters' : 'Expand All Quarters'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProFormaCalculator;
