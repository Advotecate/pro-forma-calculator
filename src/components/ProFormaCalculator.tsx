import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, Zap, 
  Settings, Activity, Target
} from 'lucide-react';

interface RevenueStreams {
  mediaCommissions: number;
  saasSubscriptions: number;
  contractorConsultantGmv: number;
  transactionFees: number;
  smsRevenue: number;
}

interface OrganizationType {
  primaryCount: number;  // Number of campaigns in primary
  generalCount: number;  // Number of campaigns in general (usually fewer)
  capturedPrimaryCount: number; // Actual number of primary campaigns we capture
  capturedGeneralCount: number; // Actual number of general campaigns we capture
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
      primaryCount: 12000,
      generalCount: 12000,
      capturedPrimaryCount: 100,   // Local Small primary campaigns captured
      capturedGeneralCount: 100,    // Local Small general campaigns captured
      primarySpend: 2000,
      generalSpend: 7500,
      primaryFundraising: 5000,     // Average raise per campaign in primary
      generalFundraising: 10000,    // Average raise per campaign in general
      primarySms: 50000,            // 50K messages per campaign
      generalSms: 100000,           // 100K messages per campaign
      subscriptionPrices: {
        votebuilder: 100,
        eventPlatform: 75,
        mapping: 100,
        advancedVoterData: 250,
      }
    },
    localLarge: {
      primaryCount: 350,
      generalCount: 350,
      capturedPrimaryCount: 20,    // Local Large primary campaigns captured
      capturedGeneralCount: 20,     // Local Large general campaigns captured
      primarySpend: 25000,
      generalSpend: 500000,
      primaryFundraising: 100000,   // Average raise per campaign in primary
      generalFundraising: 250000,   // Average raise per campaign in general
      primarySms: 50000,            // 50K messages per campaign
      generalSms: 250000,           // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 250,
        eventPlatform: 100,
        mapping: 200,
        advancedVoterData: 400,
      }
    },
    stateHouse: {
      primaryCount: 4809,
      generalCount: 3735,           // Fewer make it to general
      capturedPrimaryCount: 35,     // State House primary campaigns captured
      capturedGeneralCount: 30,      // State House general campaigns captured
      primarySpend: 10000,
      generalSpend: 100000,
      primaryFundraising: 25000,    // Average raise per campaign in primary
      generalFundraising: 50000,    // Average raise per campaign in general
      primarySms: 10000,            // 10K messages per campaign
      generalSms: 50000,            // 50K messages per campaign
      subscriptionPrices: {
        votebuilder: 400,
        eventPlatform: 100,
        mapping: 200,
        advancedVoterData: 500,
      }
    },
    stateSenate: {
      primaryCount: 1254,
      generalCount: 982,            // Fewer make it to general
      capturedPrimaryCount: 20,     // State Senate primary campaigns captured
      capturedGeneralCount: 18,      // State Senate general campaigns captured
      primarySpend: 10000,
      generalSpend: 100000,
      primaryFundraising: 50000,    // Average raise per campaign in primary
      generalFundraising: 150000,   // Average raise per campaign in general
      primarySms: 50000,            // 50K messages per campaign
      generalSms: 250000,           // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 500,
        eventPlatform: 150,
        mapping: 250,
        advancedVoterData: 750,
      }
    },
    statewide: {
      primaryCount: 463,
      generalCount: 270,            // Fewer make it to general
      capturedPrimaryCount: 5,      // Statewide primary campaigns captured
      capturedGeneralCount: 3,       // Statewide general campaigns captured
      primarySpend: 250000,
      generalSpend: 10000000,
      primaryFundraising: 500000,   // Average raise per campaign in primary
      generalFundraising: 2000000,  // Average raise per campaign in general
      primarySms: 500000,           // 500K messages per campaign
      generalSms: 2000000,          // 2M messages per campaign
      subscriptionPrices: {
        votebuilder: 1000,
        eventPlatform: 250,
        mapping: 450,
        advancedVoterData: 1500,
      }
    },
    usHouse: {
      primaryCount: 870,
      generalCount: 425,            // Fewer make it to general
      capturedPrimaryCount: 20,     // U.S. House primary campaigns captured
      capturedGeneralCount: 12,      // U.S. House general campaigns captured
      primarySpend: 25000,
      generalSpend: 3000000,
      primaryFundraising: 500000,   // Average raise per campaign in primary
      generalFundraising: 2000000,  // Average raise per campaign in general
      primarySms: 50000,            // 50K messages per campaign
      generalSms: 250000,           // 250K messages per campaign
      subscriptionPrices: {
        votebuilder: 500,
        eventPlatform: 150,
        mapping: 250,
        advancedVoterData: 1000,
      }
    },
    usSenate: {
      primaryCount: 119,
      generalCount: 33,             // Fewer make it to general
      capturedPrimaryCount: 1,      // U.S. Senate primary campaigns captured
      capturedGeneralCount: 1,       // U.S. Senate general campaigns captured
      primarySpend: 2500000,
      generalSpend: 10000000,
      primaryFundraising: 2500000,  // Average raise per campaign in primary
      generalFundraising: 10000000, // Average raise per campaign in general
      primarySms: 15000000,         // 15M messages per campaign
      generalSms: 35000000,         // 35M messages per campaign
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
    contractorConsultantGmvAnnual: 3500000,   // $3.5M annual contractor/consultant transaction volume (combined)
  });

  // Commission rate for contractor/consultant marketplace (adjustable)
  const [contractorConsultantCommission, setContractorConsultantCommission] = useState(10); // percentage

  // Operating expenses (adjustable)
  const [operatingExpenses, setOperatingExpenses] = useState({
    engineering: 80000,        // Monthly engineering costs
    aiServices: 2500,          // Monthly AI/API costs
    salesGrowth: 25000,        // Monthly sales & growth
    infrastructure: 15000,     // Monthly infrastructure
    marketing: 25000,          // Monthly marketing
    compliance: 10000,         // Monthly compliance/legal
  });

  // Business assumptions (now adjustable)
  const [businessAssumptions, setBusinessAssumptions] = useState({
    saasServiceTakeRate: 30, // percentage who take multiple services
  });

  // Calculate revenues based on inputs
  const calculateRevenues = (): RevenueStreams => {
    const shareMultiplier = marketShare / 100;
    
    let totalPrimaryMediaSpend, totalGeneralMediaSpend, totalPrimaryFundraising, totalGeneralFundraising, totalPrimarySms, totalGeneralSms;
    
    if (useMarketShareMode) {
      // Market Share Mode: Use percentage of Total Addressable Market
      totalPrimaryFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.primaryCount * type.primaryFundraising), 0) * shareMultiplier;
      totalGeneralFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.generalCount * type.generalFundraising), 0) * shareMultiplier;
      // Media spend is automatically 75% of fundraising (unless manually overridden in advanced settings)
      totalPrimaryMediaSpend = totalPrimaryFundraising * 0.75;
      totalGeneralMediaSpend = totalGeneralFundraising * 0.75;
      totalPrimarySms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.primaryCount * type.primarySms), 0) * shareMultiplier;
      totalGeneralSms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.generalCount * type.generalSms), 0) * shareMultiplier;
    } else {
      // Individual Mode: Use specific captured counts directly (no scaling)
      totalPrimaryFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedPrimaryCount * type.primaryFundraising), 0);
      totalGeneralFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedGeneralCount * type.generalFundraising), 0);
      // Media spend is automatically 75% of fundraising (unless manually overridden in advanced settings)
      totalPrimaryMediaSpend = totalPrimaryFundraising * 0.75;
      totalGeneralMediaSpend = totalGeneralFundraising * 0.75;
      totalPrimarySms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedPrimaryCount * type.primarySms), 0);
      totalGeneralSms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.capturedGeneralCount * type.generalSms), 0);
    }
    
    // Media Commissions - mediaPurchaseRate now represents % of captured organizations using media portal
    const totalMediaMarket = totalPrimaryMediaSpend + totalGeneralMediaSpend;
    const mediaPurchaseMultiplier = mediaPurchaseRate / 100;
    const mediaCommissions = totalMediaMarket * mediaPurchaseMultiplier * (mediaCommissionRate / 100);
    
    // Transaction Fees (calculated from organization-specific fundraising) 
    const totalFundraising = totalPrimaryFundraising + totalGeneralFundraising;
    const transactionFees = totalFundraising * (transactionFeeNet / 10000); // Annual fundraising, no monthly multiplier needed
    
    // SaaS Subscriptions (calculated by organization type with different pricing)
    let saasSubscriptions = 0;
    Object.values(organizationTypes).forEach(type => {
      // Use the larger of primary or general count (organizations that participate in either)
      const typeSubscriberCount = useMarketShareMode 
        ? (Math.max(type.primaryCount, type.generalCount) * shareMultiplier) 
        : Math.max(type.capturedPrimaryCount, type.capturedGeneralCount);
      const typeAvgPrice = (
        type.subscriptionPrices.votebuilder + 
        type.subscriptionPrices.eventPlatform + 
        type.subscriptionPrices.mapping + 
        type.subscriptionPrices.advancedVoterData
      ) / 4;
      saasSubscriptions += typeSubscriberCount * typeAvgPrice * 12 * (businessAssumptions.saasServiceTakeRate / 100);
    });
    
    // SMS Revenue (calculated from organization-specific SMS volumes)
    const totalSms = totalPrimarySms + totalGeneralSms;
    const smsRevenue = totalSms * smsProfit;
    
    // Contractor/Consultant GMV - only apply scaling in Market Share mode  
    const contractorConsultantScaling = useMarketShareMode ? shareMultiplier : 1;
    const contractorConsultantGmv = marketData.contractorConsultantGmvAnnual * contractorConsultantScaling * (contractorConsultantCommission / 100);
    
    // Return revenues without additional scaling (already applied in mode-specific calculations)
    return {
      mediaCommissions,
      saasSubscriptions,
      contractorConsultantGmv,
      transactionFees,
      smsRevenue
    };
  };

  // Helper function to get total organizations (max of primary or general since they overlap)
  const getTotalOrganizations = () => {
    return Object.values(organizationTypes).reduce((sum, type) => sum + Math.max(type.primaryCount, type.generalCount), 0);
  };

  // Helper function to get organizations count based on current mode
  const getEffectiveOrganizations = () => {
    if (useMarketShareMode) {
      // Market Share Mode: Show percentage of total addressable market
      return Math.round(getTotalOrganizations() * (marketShare / 100));
    } else {
      // Individual Mode: Show the actual captured counts (max of primary or general)
      return Object.values(organizationTypes).reduce((sum, type) => 
        sum + Math.max(type.capturedPrimaryCount, type.capturedGeneralCount), 0);
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
      { month: 'Sep 2025', label: 'September 2025', revenueMultiplier: 0, launchPhase: 'pre-launch' },
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
      
      // Special expenses for Sep/Oct/Nov 2025
      const monthlyExpenses = (month === 'Sep 2025' || month === 'Oct 2025' || month === 'Nov 2025') ? 80000 : monthlyOpEx;
      const netProfit = monthlyRevenue - monthlyExpenses;
      
      return {
        month,
        label,
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        netProfit,
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
  const netProfit = totalRevenue - operatingCosts;
  const ebitdaMargin = ((totalRevenue - operatingCosts) / totalRevenue * 100) || 0;
  
  // ROI based on 15% profit share from $300K investment with 2x minimum guarantee
  const investmentAmount = 300000;
  const minimumReturn = 600000; // 2x minimum return
  const profitSharePercentage = 15; // 15% of net profits
  const calculatedProfitShare = netProfit * (profitSharePercentage / 100);
  const annualProfitShare = Math.max(calculatedProfitShare, minimumReturn); // Greater of 15% or $600K
  const roi = ((annualProfitShare - investmentAmount) / investmentAmount * 100) || 0; // ROI = profit/investment

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-mint-400 rounded-full opacity-10 animate-float-slow blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue rounded-full opacity-10 animate-float-reverse blur-3xl" />
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Main Content Wrapper with flex ordering */}
        <div className="flex flex-col">
          {/* Key Metrics Cards - Sticky on desktop, bottom on mobile */}
          <div className="md:sticky md:top-4 md:z-40 mb-8 order-last md:order-first">
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                <p className="text-xs text-muted mb-1">Net Profit</p>
                <p className="text-xl font-heading font-medium text-ink">
                  ${(netProfit / 1000000).toFixed(1)}M
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
                ${((netProfit + investmentAmount - annualProfitShare) / 1000000).toFixed(1)}M
              </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-success/50 shadow-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-7 h-7 text-success" />
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                    {calculatedProfitShare >= minimumReturn ? '15% Share' : '2x Min'}
                  </span>
                </div>
                <p className="text-xs text-muted mb-1">Investor ROI</p>
                <p className="text-xl font-heading font-medium text-success">
                  {roi.toFixed(0)}%
                </p>
                <p className="text-xs text-muted">
                  ${(annualProfitShare / 1000000).toFixed(1)}M return
                  {calculatedProfitShare < minimumReturn && (
                    <span className="text-warning"> (2x min)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="order-first md:order-last">
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
                    Media Portal Adoption
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
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
                    % of captured orgs using our media portal (75% of their funds go to media)
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
                    Contractor/Consultant Commission
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={contractorConsultantCommission}
                      onChange={(e) => setContractorConsultantCommission(Number(e.target.value))}
                      className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-ink w-16 text-right">
                      {contractorConsultantCommission}%
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">Assumed $250 per contractor/consultant transaction</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Contractor/Consultant GMV ($M)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={marketData.contractorConsultantGmvAnnual / 1000000}
                    onChange={(e) => setMarketData({...marketData, contractorConsultantGmvAnnual: Number(e.target.value) * 1000000})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">Annual contractor and consultant transaction volume combined</p>
                </div>
              </div>
            </div>

            {/* Business Assumptions Section */}
            <div>
              <h4 className="text-lg font-medium text-ink mb-4">Business Model Assumptions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            sum + ((type.primaryCount * type.primaryFundraising + type.generalCount * type.generalFundraising) * 0.75), 0
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
                                sum + ((type.primaryCount * type.primaryFundraising + type.generalCount * type.generalFundraising) * 0.75), 0
                              )) * (marketShare / 100)) / 1000000).toFixed(0)
                            : (((Object.values(organizationTypes).reduce((sum, type) => 
                                sum + ((type.capturedPrimaryCount * type.primaryFundraising + type.capturedGeneralCount * type.generalFundraising) * 0.75), 0
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
                          <span>P: {type.primaryCount.toLocaleString()} | G: {type.generalCount.toLocaleString()}</span>
                          <span className="bg-mint-100 text-mint-700 px-2 py-1 rounded text-xs font-medium">
                            P: {type.capturedPrimaryCount} | G: {type.capturedGeneralCount}
                          </span>
                          <span>${((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) / 1000000).toFixed(1)}M fundraising</span>
                          <span>${(((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) * 0.75) / 1000000).toFixed(1)}M media (75%)</span>
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
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-ink">Primary Count</span>
                              <input
                                type="number"
                                value={type.primaryCount}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].primaryCount = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                className="w-24 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-ink">General Count</span>
                              <input
                                type="number"
                                value={type.generalCount}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].generalCount = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                className="w-24 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mint-600 focus:ring-1 focus:ring-mint-100"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-ink">Primary Captured</span>
                                <span className="text-sm font-medium text-mint-600">{type.capturedPrimaryCount.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={type.primaryCount}
                                step="1"
                                value={type.capturedPrimaryCount}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].capturedPrimaryCount = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                disabled={useMarketShareMode}
                                className={`w-full h-2 bg-mint-100 rounded-lg appearance-none ${
                                  useMarketShareMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-ink">General Captured</span>
                                <span className="text-sm font-medium text-mint-600">{type.capturedGeneralCount.toLocaleString()}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={type.generalCount}
                                step="1"
                                value={type.capturedGeneralCount}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].capturedGeneralCount = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                disabled={useMarketShareMode}
                                className={`w-full h-2 bg-mint-100 rounded-lg appearance-none ${
                                  useMarketShareMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                }`}
                              />
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
                            <div>Fundraising: ${((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) / 1000000).toFixed(1)}M</div>
                            <div>Media (75%): ${(((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) * 0.75) / 1000000).toFixed(1)}M</div>
                            <div>SMS: {((type.primarySms * type.primaryCount + type.generalSms * type.generalCount) / 1000000000).toFixed(2)}B msgs</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="bg-mint-50 p-3 rounded-lg">
                          <span className="font-medium text-mint-700 block mb-2">
                            {useMarketShareMode ? 'Our Captured Market' : 'Target Organizations'}
                          </span>
                          <div className="space-y-1 text-mint-600 text-xs">
                            <div>Primary: {useMarketShareMode 
                              ? Math.round(type.primaryCount * (marketShare / 100)).toLocaleString()
                              : type.capturedPrimaryCount.toLocaleString()
                            } | General: {useMarketShareMode 
                              ? Math.round(type.generalCount * (marketShare / 100)).toLocaleString()
                              : type.capturedGeneralCount.toLocaleString()
                            }</div>
                            <div>Fundraising: ${useMarketShareMode 
                              ? (((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) * (marketShare / 100) / 1000000).toFixed(1))
                              : (((type.primaryFundraising * type.capturedPrimaryCount + type.generalFundraising * type.capturedGeneralCount) / 1000000).toFixed(1))
                            }M</div>
                            <div>Media (75%): ${useMarketShareMode 
                              ? ((((type.primaryFundraising * type.primaryCount + type.generalFundraising * type.generalCount) * 0.75) * (marketShare / 100) / 1000000).toFixed(1))
                              : ((((type.primaryFundraising * type.capturedPrimaryCount + type.generalFundraising * type.capturedGeneralCount) * 0.75) / 1000000).toFixed(1))
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

        {/* P&L Statement */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8">
          <h2 className="text-2xl font-heading font-medium text-ink mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-mint-600" />
            P&L Statement
          </h2>
          
          <div className="space-y-4">
            {/* Revenue Streams */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-ink mb-4">Revenue Streams</h3>
              {Object.entries(revenues).map(([key, value]) => {
                const percentage = (value / totalRevenue * 100) || 0;
                const labels: Record<string, string> = {
                  mediaCommissions: 'Media Commissions',
                  saasSubscriptions: 'SaaS Subscriptions',
                  contractorConsultantGmv: 'Contractor/Consultant GMV',
                  transactionFees: 'Transaction Fees',
                  smsRevenue: 'SMS Revenue'
                };
                
                return (
                  <div key={key} className="relative mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-ink">{labels[key]}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted">{percentage.toFixed(1)}%</span>
                        <span className="text-lg font-medium text-mint-600">
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

            {/* Operating Expenses */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-ink mb-4">Operating Expenses</h3>
              {Object.entries(operatingExpenses).map(([key, value]) => {
                const annualExpense = value * 12;
                const percentage = (annualExpense / operatingCosts * 100) || 0;
                const labels: Record<string, string> = {
                  engineering: 'Engineering',
                  aiServices: 'AI Services',
                  salesGrowth: 'Sales & Growth',
                  infrastructure: 'Infrastructure',
                  marketing: 'Marketing',
                  compliance: 'Compliance'
                };
                
                return (
                  <div key={key} className="relative mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-ink">{labels[key]}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted">{percentage.toFixed(1)}%</span>
                        <span className="text-lg font-medium text-red-600">
                          ${(annualExpense / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* P&L Summary */}
            <div className="pt-6 border-t-2 border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-mint-50 p-4 rounded-xl border border-mint-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-heading font-medium text-ink">Total Revenue</span>
                    <span className="text-2xl font-heading font-medium text-mint-600">
                      ${(totalRevenue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-heading font-medium text-ink">Total Expenses</span>
                    <span className="text-2xl font-heading font-medium text-red-600">
                      ${(operatingCosts / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-heading font-medium text-ink">Net Profit</span>
                    <span className="text-2xl font-heading font-medium text-success">
                      ${(netProfit / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-muted">EBITDA Margin: </span>
                    <span className="text-sm font-medium text-success">{ebitdaMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Investor Returns Section */}
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="text-lg font-medium text-ink mb-3">Investor Returns</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted">Initial Investment:</span>
                    <span className="font-medium text-ink ml-2">${(investmentAmount / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-muted">Profit Share (15%):</span>
                    <span className="font-medium text-ink ml-2">${(calculatedProfitShare / 1000000).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-muted">Actual Payout:</span>
                    <span className="font-medium text-purple-600 ml-2">
                      ${(annualProfitShare / 1000000).toFixed(2)}M
                      {calculatedProfitShare < minimumReturn && ' (2x minimum)'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <span className="text-sm text-muted">Company Retained Cash:</span>
                  <span className="font-medium text-ink ml-2">${((netProfit + investmentAmount - annualProfitShare) / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Financial Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 mt-12">
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
                netProfit: sum.netProfit + month.netProfit
              }), { revenue: 0, expenses: 0, netProfit: 0 });

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
                            <p className="text-xs text-muted">Quarter Net Profit</p>
                            <p className={`text-sm font-medium ${quarterTotal.netProfit >= 0 ? 'text-success' : 'text-red-600'}`}>
                              ${(quarterTotal.netProfit / 1000000).toFixed(2)}M
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
                              <th className="text-right py-3 px-4 font-medium text-ink">Net Profit</th>
                              <th className="text-right py-3 px-4 font-medium text-ink">Cumulative Cash</th>
                              <th className="text-center py-3 px-4 font-medium text-ink">Phase</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quarter.months.map((month, index) => {
                              // Calculate cumulative cash (starting with $300K investment)
                              const previousMonths = monthlyData.slice(0, monthlyData.indexOf(month) + 1);
                              const monthIndex = monthlyData.indexOf(month);
                              // Deduct investor payout in the last month (November 2026)
                              const investorPayout = (monthIndex === monthlyData.length - 1) ? annualProfitShare : 0;
                              const cumulativeCash = investmentAmount + previousMonths.reduce((sum, m) => sum + m.netProfit, 0) - investorPayout;
                              
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
                                    month.netProfit >= 0 ? 'text-success' : 'text-red-600'
                                  }`}>
                                    ${(month.netProfit / 1000).toFixed(0)}K
                                  </td>
                                  <td className={`py-3 px-4 text-right font-medium ${
                                    cumulativeCash >= 0 ? 'text-success' : 'text-red-600'
                                  }`}>
                                    ${(cumulativeCash / 1000000).toFixed(2)}M
                                    {investorPayout > 0 && (
                                      <span className="text-xs text-warning block">
                                        (after ${(investorPayout / 1000000).toFixed(1)}M payout)
                                      </span>
                                    )}
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
                            <p className="text-muted mb-1">Quarter Net Profit</p>
                            <p className={`font-medium ${quarterTotal.netProfit >= 0 ? 'text-success' : 'text-red-600'}`}>
                              ${(quarterTotal.netProfit / 1000000).toFixed(2)}M
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
      </div>
    </div>
  );
};

export default ProFormaCalculator;
