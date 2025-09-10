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
  eventPlatform: number;
}

interface OrganizationType {
  count: number;
  captureRate: number; // Percentage of this organization type we capture
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
  // State for all interactive controls
  const [marketShare, setMarketShare] = useState(5);
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
      captureRate: 5,              // 5% of local small campaigns
      primarySpend: 5000,
      generalSpend: 10000,
      primaryFundraising: 2500,    // Typically 50% of media spend
      generalFundraising: 7500,    // 75% of media spend
      primarySms: 50000,           // 50K messages per campaign
      generalSms: 100000,          // 100K messages per campaign
      subscriptionPrices: {
        votebuilder: 500,
        eventPlatform: 150,
        mapping: 300,
        advancedVoterData: 800,
      }
    },
    localLarge: {
      count: 350,
      captureRate: 12,             // 12% of local large campaigns
      primarySpend: 2000000,
      generalSpend: 5000000,
      primaryFundraising: 1200000, // 60% of media spend  
      generalFundraising: 4000000, // 80% of media spend
      primarySms: 2000000,         // 2M messages per campaign
      generalSms: 5000000,         // 5M messages per campaign
      subscriptionPrices: {
        votebuilder: 2000,
        eventPlatform: 500,
        mapping: 1200,
        advancedVoterData: 3000,
      }
    },
    stateHouse: {
      count: 4809,
      captureRate: 15,             // 15% of state house campaigns
      primarySpend: 50000,
      generalSpend: 150000,
      primaryFundraising: 35000,   // 70% of media spend
      generalFundraising: 120000,  // 80% of media spend
      primarySms: 200000,          // 200K messages per campaign
      generalSms: 500000,          // 500K messages per campaign
      subscriptionPrices: {
        votebuilder: 800,
        eventPlatform: 200,
        mapping: 600,
        advancedVoterData: 1500,
      }
    },
    stateSenate: {
      count: 1254,
      captureRate: 20,             // 20% of state senate campaigns
      primarySpend: 100000,
      generalSpend: 300000,
      primaryFundraising: 80000,   // 80% of media spend
      generalFundraising: 250000,  // 83% of media spend
      primarySms: 400000,          // 400K messages per campaign
      generalSms: 1000000,         // 1M messages per campaign
      subscriptionPrices: {
        votebuilder: 1200,
        eventPlatform: 300,
        mapping: 800,
        advancedVoterData: 2000,
      }
    },
    statewide: {
      count: 463,
      captureRate: 35,             // 35% of statewide campaigns
      primarySpend: 5000000,
      generalSpend: 20000000,
      primaryFundraising: 4500000, // 90% of media spend
      generalFundraising: 18000000,// 90% of media spend  
      primarySms: 10000000,        // 10M messages per campaign
      generalSms: 25000000,        // 25M messages per campaign
      subscriptionPrices: {
        votebuilder: 5000,
        eventPlatform: 1500,
        mapping: 3000,
        advancedVoterData: 8000,
      }
    },
    usHouse: {
      count: 870,
      captureRate: 40,             // 40% of U.S. House campaigns
      primarySpend: 500000,
      generalSpend: 3000000,
      primaryFundraising: 450000,  // 90% of media spend
      generalFundraising: 2700000, // 90% of media spend
      primarySms: 2000000,         // 2M messages per campaign
      generalSms: 8000000,         // 8M messages per campaign
      subscriptionPrices: {
        votebuilder: 2500,
        eventPlatform: 800,
        mapping: 1500,
        advancedVoterData: 4000,
      }
    },
    usSenate: {
      count: 119,
      captureRate: 60,             // 60% of U.S. Senate campaigns
      primarySpend: 5000000,
      generalSpend: 20000000,
      primaryFundraising: 5000000, // 100% of media spend
      generalFundraising: 20000000,// 100% of media spend
      primarySms: 15000000,        // 15M messages per campaign
      generalSms: 35000000,        // 35M messages per campaign
      subscriptionPrices: {
        votebuilder: 8000,
        eventPlatform: 2500,
        mapping: 4000,
        advancedVoterData: 12000,
      }
    }
  });

  // Additional market data (non-organization specific)
  const [marketData, setMarketData] = useState({
    primaryConsulting: 17595000,
    generalConsulting: 14303000,
    marketplaceListings: 6250000,
    contractorGmvAnnual: 167502000,
  });

  // Operating expenses (adjustable)
  const [operatingExpenses, setOperatingExpenses] = useState({
    engineering: 45000,        // Monthly engineering costs
    mediaOperations: 15000,    // Monthly media operations
    aiServices: 10000,         // Monthly AI/API costs
    salesGrowth: 18000,        // Monthly sales & growth
    infrastructure: 8000,      // Monthly infrastructure
    marketing: 8000,           // Monthly marketing
    compliance: 5000,          // Monthly compliance/legal
  });

  // Business assumptions (now adjustable)
  const [businessAssumptions, setBusinessAssumptions] = useState({
    saasServiceTakeRate: 30, // percentage who take multiple services
    eventPlatformUsageRate: 15, // percentage who use event platform
    marketplaceCommissionRate: 10, // percentage commission on GMV
    monthlyMultiplier: 12, // annual calculation multiplier
  });

  // Calculate revenues based on inputs
  const calculateRevenues = (): RevenueStreams => {
    const shareMultiplier = marketShare / 100;
    
    // Calculate totals from organization types (with capture rates applied)
    const totalPrimaryMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.primarySpend), 0);
    const totalGeneralMediaSpend = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.generalSpend), 0);
    const totalPrimaryFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.primaryFundraising), 0);
    const totalGeneralFundraising = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.generalFundraising), 0);
    const totalPrimarySms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.primarySms), 0);
    const totalGeneralSms = Object.values(organizationTypes).reduce((sum, type) => sum + (type.count * shareMultiplier * (type.captureRate / 100) * type.generalSms), 0);
    
    // Media Commissions (only 20% of captured campaigns purchase media)
    const totalMediaMarket = totalPrimaryMediaSpend + totalGeneralMediaSpend;
    const mediaPurchaseMultiplier = mediaPurchaseRate / 100;
    const mediaCommissions = totalMediaMarket * mediaPurchaseMultiplier * (mediaCommissionRate / 100);
    
    // Transaction Fees (calculated from organization-specific fundraising)
    const totalFundraising = totalPrimaryFundraising + totalGeneralFundraising;
    const transactionFees = totalFundraising * (transactionFeeNet / 10000) * businessAssumptions.monthlyMultiplier;
    
    // SaaS Subscriptions (calculated by organization type with different pricing)
    let saasSubscriptions = 0;
    Object.values(organizationTypes).forEach(type => {
      const typeSubscriberCount = type.count * shareMultiplier * (type.captureRate / 100);
      const typeAvgPrice = (
        type.subscriptionPrices.votebuilder + 
        type.subscriptionPrices.eventPlatform + 
        type.subscriptionPrices.mapping + 
        type.subscriptionPrices.advancedVoterData
      ) / 4;
      saasSubscriptions += typeSubscriberCount * typeAvgPrice * businessAssumptions.monthlyMultiplier * (businessAssumptions.saasServiceTakeRate / 100);
    });
    
    // Marketplace
    const marketplace = (marketData.marketplaceListings * shareMultiplier * businessAssumptions.monthlyMultiplier) + 
                       (marketData.contractorGmvAnnual * shareMultiplier * (businessAssumptions.marketplaceCommissionRate / 100));
    
    // SMS Revenue (calculated from organization-specific SMS volumes)
    const totalSms = totalPrimarySms + totalGeneralSms;
    const smsRevenue = totalSms * smsProfit;
    
    // Consulting
    const totalConsulting = marketData.primaryConsulting + marketData.generalConsulting;
    const consulting = totalConsulting * shareMultiplier * (consultingMargin / 100) * businessAssumptions.monthlyMultiplier;
    
    // Event Platform (calculated by organization type with different pricing)
    let eventPlatform = 0;
    Object.values(organizationTypes).forEach(type => {
      const typeSubscriberCount = type.count * shareMultiplier * (type.captureRate / 100);
      eventPlatform += typeSubscriberCount * type.subscriptionPrices.eventPlatform * businessAssumptions.monthlyMultiplier * (businessAssumptions.eventPlatformUsageRate / 100);
    });
    
    return {
      mediaCommissions,
      saasSubscriptions,
      marketplace,
      transactionFees,
      smsRevenue,
      consulting,
      eventPlatform
    };
  };

  // Helper function to get total organizations
  const getTotalOrganizations = () => {
    return Object.values(organizationTypes).reduce((sum, type) => sum + type.count, 0);
  };

  // Helper function to toggle organization accordion
  const toggleOrganization = (key: string) => {
    setExpandedOrgs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const revenues = calculateRevenues();
  const totalRevenue = Object.values(revenues).reduce((a, b) => a + b, 0);
  const totalMonthlyOpEx = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);
  const operatingCosts = totalMonthlyOpEx * 12; // Annual OpEx
  const netIncome = totalRevenue - operatingCosts;
  const ebitdaMargin = ((totalRevenue - operatingCosts) / totalRevenue * 100) || 0;
  const roi = (netIncome / 300000 * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-mint-400 rounded-full opacity-10 animate-float-slow blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue rounded-full opacity-10 animate-float-reverse blur-3xl" />
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-mint-400 to-mint-600 rounded-xl flex items-center justify-center">
                <ChartBar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-medium text-ink">ADVOTECATE Pro-Forma</h1>
                <p className="text-sm text-muted">Interactive Financial Calculator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted">Total Revenue</p>
                <p className="text-2xl font-heading font-medium text-mint-600">
                  ${(totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">ROI</p>
                <p className="text-2xl font-heading font-medium text-success">
                  {roi.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-7 h-7 text-mint-600" />
            </div>
            <p className="text-xs text-muted mb-1">Total Revenue</p>
            <p className="text-xl font-heading font-medium text-ink">
              ${(totalRevenue / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Settings className="w-7 h-7 text-red-600" />
            </div>
            <p className="text-xs text-muted mb-1">Operating Expenses</p>
            <p className="text-xl font-heading font-medium text-red-600">
              ${(operatingCosts / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
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

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <p className="text-xs text-muted mb-1">Organizations</p>
            <p className="text-xl font-heading font-medium text-ink">
              {Math.round(getTotalOrganizations() * marketShare / 100).toLocaleString()}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-7 h-7 text-warning" />
            </div>
            <p className="text-xs text-muted mb-1">Cash at Year End</p>
            <p className="text-xl font-heading font-medium text-ink">
              ${((netIncome + 300000) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-heading font-medium text-ink mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-mint-600" />
            Interactive Controls
          </h2>

          {/* Market Share Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-medium text-ink flex items-center">
                  <Target className="w-5 h-5 mr-2 text-mint-600" />
                  Market Share
                </label>
                <p className="text-sm text-muted mt-1">
                  Base market share × individual organization capture rates = actual penetration
                </p>
              </div>
              <span className="text-2xl font-heading font-medium text-mint-600">
                {marketShare}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={marketShare}
              onChange={(e) => setMarketShare(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-mint-100 to-mint-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3EB489 0%, #3EB489 ${marketShare}%, #E9FBF6 ${marketShare}%, #E9FBF6 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted mt-2">
              <span>1%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Transaction Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Media Purchase Conversion Rate
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
                Percentage of captured campaigns that actually purchase media
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-xs text-muted mt-1">% of customers using multiple SaaS services</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Event Platform Usage (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={businessAssumptions.eventPlatformUsageRate}
                    onChange={(e) => setBusinessAssumptions({...businessAssumptions, eventPlatformUsageRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-100"
                  />
                  <p className="text-xs text-muted mt-1">% of customers using event platform</p>
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
              <h4 className="text-lg font-medium text-ink mb-4">Organization-Specific Market Data & Pricing</h4>
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
                    <h6 className="text-xs font-medium text-ink mb-2">Captured Market ({marketShare}% × Capture Rates)</h6>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted">Organizations</span>
                        <p className="font-medium text-mint-600">
                          {Math.round(Object.values(organizationTypes).reduce((sum, type) => 
                            sum + (type.count * (marketShare / 100) * (type.captureRate / 100)), 0
                          )).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted">Media Market</span>
                        <p className="font-medium text-mint-600">
                          ${((Object.values(organizationTypes).reduce((sum, type) => 
                            sum + (type.count * (marketShare / 100) * (type.captureRate / 100) * (type.primarySpend + type.generalSpend)), 0
                          )) / 1000000).toFixed(0)}M
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
                          <span className="bg-mint-100 text-mint-700 px-2 py-1 rounded text-xs font-medium">{type.captureRate}% capture</span>
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
                              <span className="text-sm font-medium text-ink">Our Capture Rate</span>
                              <span className="text-sm font-medium text-mint-600">{type.captureRate}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="range"
                                min="1"
                                max="80"
                                step="1"
                                value={type.captureRate}
                                onChange={(e) => {
                                  const newTypes = { ...organizationTypes };
                                  newTypes[key].captureRate = Number(e.target.value);
                                  setOrganizationTypes(newTypes);
                                }}
                                className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted mt-1">
                              <span>1%</span>
                              <span>80%</span>
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
                          <span className="font-medium text-mint-700 block mb-2">Our Captured Market</span>
                          <div className="space-y-1 text-mint-600 text-xs">
                            <div>Organizations: {Math.round(type.count * (marketShare / 100) * (type.captureRate / 100)).toLocaleString()}</div>
                            <div>Media: ${((type.primarySpend + type.generalSpend) * type.count * (marketShare / 100) * (type.captureRate / 100) / 1000000).toFixed(1)}M</div>
                            <div>Fundraising: ${((type.primaryFundraising + type.generalFundraising) * type.count * (marketShare / 100) * (type.captureRate / 100) / 1000000).toFixed(1)}M</div>
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
                consulting: 'Consulting',
                eventPlatform: 'Event Platform'
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
      </div>
    </div>
  );
};

export default ProFormaCalculator;
