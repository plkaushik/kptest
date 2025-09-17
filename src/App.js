import React, { useState, useMemo, useEffect } from 'react';
import { User, ArrowRight, CheckCircle, Plus, Edit3, Trash2, DollarSign, Home, Heart, TrendingUp, Save, BarChart3, ArrowLeft, FileText, Info, LogOut, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useAuth } from './auth.js';
import { LoginForm, SignupForm } from './AuthComponents.jsx';

const LifeFinancialPlanner = () => {
  // Authentication state
  const { user, loading: authLoading, login, signup, logout, updateUserProfile, updateUserScenarios, isAuthenticated } = useAuth();
  const [authStep, setAuthStep] = useState('login'); // 'login' or 'signup'
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // App state
  const [step, setStep] = useState('profile_setup'); // 'profile_setup', 'scenario_list', 'scenario_create', 'scenario_results', 'methodology', 'scenario_comparison'
  const [basicProfile, setBasicProfile] = useState({
    name: '',
    age: '',
    gender: '',
    lifeStage: ''
  });
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState({
    id: '',
    name: '',
    description: '',
    currentIncome: 50000,
    currentDebt: 0,
    currentSavings: 5000,
    monthlyExpenses: 3000,
    salaryGrowthRate: 3,
    housingStatus: 'renting',
    monthlyRent: 1500,
    homePrice: 300000,
    downPaymentPercent: 20,
    yearsUntilBuying: 3,
    relationshipStatus: 'single',
    partnerIncome: 0,
    planToHaveChildren: false,
    numberOfChildren: 0,
    ageFirstChild: 30,
    locationCost: 'average'
  });
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedScenariosForComparison, setSelectedScenariosForComparison] = useState([]);
  const [profileValidationErrors, setProfileValidationErrors] = useState({});
  const [showProfileValidationErrors, setShowProfileValidationErrors] = useState(false);
  const [scenarioValidationErrors, setScenarioValidationErrors] = useState({});
  const [showScenarioValidationErrors, setShowScenarioValidationErrors] = useState(false);

  const lifeStageOptions = [
    { value: 'high_school', label: 'High School Student', desc: 'Planning for college' },
    { value: 'college', label: 'College Student', desc: 'Currently in school' },
    { value: 'recent_grad', label: 'Recent Graduate', desc: 'Just finished school, starting career' },
    { value: 'early_career', label: 'Early Career', desc: '1-5 years work experience' },
    { value: 'established', label: 'Established Professional', desc: '5+ years, considering major life changes' },
    { value: 'mid_career', label: 'Mid-Career', desc: 'Peak earning years, family considerations' },
    { value: 'pre_retirement', label: 'Pre-Retirement', desc: 'Planning for retirement transition' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  // Authentication handlers
  const handleLogin = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError('');
    const result = await login(email, password);
    if (!result.success) {
      setAuthError(result.error);
    }
    setIsAuthLoading(false);
  };

  const handleSignup = async (email, password, name) => {
    setIsAuthLoading(true);
    setAuthError('');
    const result = await signup(email, password, name);
    if (!result.success) {
      setAuthError(result.error);
    } else {
      // After successful signup, load user's existing profile if any
      if (result.user && result.user.profile && result.user.profile.name) {
        setBasicProfile(result.user.profile);
        setScenarios(result.user.scenarios || []);
        setStep('scenario_list');
      }
    }
    setIsAuthLoading(false);
  };

  const handleLogout = () => {
    logout();
    setBasicProfile({ name: '', age: '', gender: '', lifeStage: '' });
    setScenarios([]);
    setStep('profile_setup');
    setAuthStep('login');
    setAuthError('');
  };

  // Load user data when authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      if (user.profile && user.profile.name) {
        setBasicProfile(user.profile);
        setScenarios(user.scenarios || []);
        setStep('scenario_list');
      } else {
        setStep('profile_setup');
      }
    }
  }, [user, isAuthenticated]);

  // Listen for auth form switching
  useEffect(() => {
    const handleSwitchToSignup = () => setAuthStep('signup');
    const handleSwitchToLogin = () => setAuthStep('login');
    
    window.addEventListener('switchToSignup', handleSwitchToSignup);
    window.addEventListener('switchToLogin', handleSwitchToLogin);
    
    return () => {
      window.removeEventListener('switchToSignup', handleSwitchToSignup);
      window.removeEventListener('switchToLogin', handleSwitchToLogin);
    };
  }, []);

  const handleProfileUpdate = (field, value) => {
    setBasicProfile(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when user starts typing
    if (profileValidationErrors[field]) {
      setProfileValidationErrors(prev => ({ ...prev, [field]: '' }));
      setShowProfileValidationErrors(false);
    }
  };

  const handleScenarioUpdate = (field, value) => {
    setCurrentScenario(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when user starts typing
    if (scenarioValidationErrors[field]) {
      setScenarioValidationErrors(prev => ({ ...prev, [field]: '' }));
      setShowScenarioValidationErrors(false);
    }
  };

  // Save profile and update user data
  const saveBasicProfile = () => {
    // Validate required fields
    const errors = {};
    if (!basicProfile.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!basicProfile.age) {
      errors.age = 'Age is required';
    }
    if (!basicProfile.gender) {
      errors.gender = 'Gender selection is required';
    }
    if (!basicProfile.lifeStage) {
      errors.lifeStage = 'Life stage selection is required';
    }

    if (Object.keys(errors).length > 0) {
      setProfileValidationErrors(errors);
      setShowProfileValidationErrors(true);
      return;
    }

    setProfileValidationErrors({});
    setShowProfileValidationErrors(false);
    
    if (isAuthenticated && user) {
      updateUserProfile(basicProfile);
    }
    setStep('scenario_list');
  };

  const saveScenario = () => {
    // Validate required fields
    const errors = {};
    if (!currentScenario.name.trim()) {
      errors.name = 'Scenario name is required';
    }

    if (Object.keys(errors).length > 0) {
      setScenarioValidationErrors(errors);
      setShowScenarioValidationErrors(true);
      return;
    }

    setScenarioValidationErrors({});
    setShowScenarioValidationErrors(false);

    const scenarioToSave = {
      ...currentScenario,
      id: currentScenario.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedScenarios = currentScenario.id 
      ? scenarios.map(s => s.id === currentScenario.id ? scenarioToSave : s)
      : [...scenarios, scenarioToSave];
    
    setScenarios(updatedScenarios);
    
    // Update user's scenarios in auth system
    if (isAuthenticated && user) {
      updateUserScenarios(updatedScenarios);
    }
    
    setStep('scenario_list');
  };

  const createNewScenario = () => {
    setCurrentScenario({
      id: '',
      name: '',
      description: '',
      currentIncome: 50000,
      currentDebt: 0,
      currentSavings: 5000,
      monthlyExpenses: 3000,
      salaryGrowthRate: 3,
      housingStatus: 'renting',
      monthlyRent: 1500,
      homePrice: 300000,
      downPaymentPercent: 20,
      yearsUntilBuying: 3,
      relationshipStatus: 'single',
      partnerIncome: 0,
      planToHaveChildren: false,
      numberOfChildren: 0,
      ageFirstChild: 30,
      locationCost: 'average'
    });
    setStep('scenario_create');
  };

  const editScenario = (scenario) => {
    setCurrentScenario(scenario);
    setStep('scenario_create');
  };

  const deleteScenario = (scenarioId) => {
    const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
    setScenarios(updatedScenarios);
    
    // Update user's scenarios in auth system
    if (isAuthenticated && user) {
      updateUserScenarios(updatedScenarios);
    }
  };

  const runAnalysis = (scenario) => {
    const results = calculateLifeProjection(scenario, basicProfile);
    setAnalysisResults({ scenario, results });
    setStep('scenario_results');
  };

  const compareScenarios = (scenarioIds) => {
    const comparisons = scenarioIds.map(id => {
      const scenario = scenarios.find(s => s.id === id);
      const results = calculateLifeProjection(scenario, basicProfile);
      return { scenario, results };
    });
    setSelectedScenariosForComparison(comparisons);
    setStep('scenario_comparison');
  };

  // Calculate additional metrics for enhanced analysis
  const calculateEnhancedMetrics = (results, scenario) => {
    const metrics = {
      cashFlowAnalysis: [],
      emergencyFundStatus: [],
      expenseRatios: [],
      retirementReadiness: {}
    };

    results.forEach((year, index) => {
      // Cash Flow Analysis
      const monthlyCashFlow = (year.income - year.expenses) / 12;
      metrics.cashFlowAnalysis.push({
        age: year.age,
        year: year.year,
        monthlyCashFlow: Math.round(monthlyCashFlow),
        annualCashFlow: Math.round(year.income - year.expenses),
        income: year.income,
        expenses: year.expenses,
        isPositive: monthlyCashFlow > 0
      });

      // Emergency Fund Status (months of expenses covered)
      const monthsOfExpenses = year.netWorth > 0 ? (year.netWorth / (year.expenses / 12)) : 0;
      metrics.emergencyFundStatus.push({
        age: year.age,
        year: year.year,
        monthsCovered: Math.min(Math.round(monthsOfExpenses), 24), // Cap at 24 months for chart readability
        isAdequate: monthsOfExpenses >= 6,
        netWorth: year.netWorth,
        monthlyExpenses: year.expenses / 12
      });

      // Expense Ratios
      const housingRatio = year.income > 0 ? (year.housingExpenses / year.income) * 100 : 0;
      const livingRatio = year.income > 0 ? (year.livingExpenses / year.income) * 100 : 0;
      const savingsRatio = year.income > 0 ? (year.savings / year.income) * 100 : 0;
      
      metrics.expenseRatios.push({
        age: year.age,
        year: year.year,
        housingRatio: Math.round(housingRatio),
        livingRatio: Math.round(livingRatio),
        savingsRatio: Math.round(savingsRatio),
        totalExpenseRatio: Math.round(housingRatio + livingRatio)
      });
    });

    // Retirement Readiness Calculation
    const finalYear = results[results.length - 1];
    const currentAge = parseInt(basicProfile.age);
    const retirementAge = 65;
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const finalNetWorth = finalYear.netWorth;
    
    // Rule of thumb: 25x annual expenses for retirement (4% withdrawal rule)
    const finalAnnualExpenses = finalYear.expenses;
    const recommendedRetirementAmount = finalAnnualExpenses * 25;
    const retirementReadinessPercent = (finalNetWorth / recommendedRetirementAmount) * 100;
    
    // Average savings rate over projection
    const avgSavingsRate = results.reduce((sum, year) => {
      return sum + (year.income > 0 ? (year.savings / year.income) * 100 : 0);
    }, 0) / results.length;

    metrics.retirementReadiness = {
      currentAge,
      retirementAge,
      yearsToRetirement,
      projectedNetWorth: finalNetWorth,
      recommendedAmount: recommendedRetirementAmount,
      readinessPercent: Math.round(retirementReadinessPercent),
      avgSavingsRate: Math.round(avgSavingsRate),
      grade: retirementReadinessPercent >= 100 ? 'A' : 
             retirementReadinessPercent >= 80 ? 'B' : 
             retirementReadinessPercent >= 60 ? 'C' : 
             retirementReadinessPercent >= 40 ? 'D' : 'F',
      monthsEmergencyFund: metrics.emergencyFundStatus[0]?.monthsCovered || 0
    };

    return metrics;
  };

  // Financial calculation engine
  const calculateLifeProjection = (scenario, profile) => {
    const locationMultipliers = {
      low: { housing: 0.7, salary: 0.9, living: 0.8 },
      average: { housing: 1.0, salary: 1.0, living: 1.0 },
      high: { housing: 1.8, salary: 1.3, living: 1.3 }
    };
    
    const projection = [];
    const regionData = locationMultipliers[scenario.locationCost];
    
    let currentAge = parseInt(profile.age);
    let netWorth = scenario.currentSavings - scenario.currentDebt;
    let annualIncome = scenario.currentIncome * regionData.salary;
    let isMarried = scenario.relationshipStatus === 'married';
    let isPartnered = scenario.relationshipStatus !== 'single';
    let childrenBorn = 0;
    let ownHouse = scenario.housingStatus === 'owns';
    let monthlyHousing = scenario.housingStatus === 'living_with_family' ? 0 : 
                        (ownHouse ? (scenario.homePrice * regionData.housing * 0.004) :
                         scenario.monthlyRent * regionData.housing);
    
    if (isPartnered) {
      annualIncome += scenario.partnerIncome * regionData.salary;
    }
    
    for (let year = 0; year < 45; year++) {
      currentAge = parseInt(profile.age) + year;
      
      // House purchase
      if (!ownHouse && scenario.housingStatus === 'renting' && year >= scenario.yearsUntilBuying) {
        ownHouse = true;
        const housePrice = scenario.homePrice * regionData.housing;
        const downPaymentAmount = housePrice * (scenario.downPaymentPercent / 100);
        netWorth -= downPaymentAmount;
        monthlyHousing = (housePrice - downPaymentAmount) * 0.055 / 12;
      }
      
      // Children
      if (scenario.planToHaveChildren && currentAge >= scenario.ageFirstChild && childrenBorn < scenario.numberOfChildren) {
        const yearsFromFirst = currentAge - scenario.ageFirstChild;
        const newChildren = Math.min(Math.floor(yearsFromFirst / 2) + 1, scenario.numberOfChildren) - childrenBorn;
        childrenBorn += newChildren;
      }
      
      // Annual calculations
      const inflationFactor = Math.pow(1.025, year);
      const realIncome = annualIncome * Math.pow(1 + scenario.salaryGrowthRate / 100, year);
      const baseExpenses = scenario.monthlyExpenses * 12;
      const childExpenses = childrenBorn * 12000;
      const livingExpenses = (baseExpenses + childExpenses) * regionData.living * inflationFactor;
      const housingExpenses = monthlyHousing * 12 * inflationFactor;
      
      const totalExpenses = livingExpenses + housingExpenses;
      const savingsAmount = Math.max(0, realIncome - totalExpenses);
      const investmentGains = netWorth > 0 ? netWorth * 0.07 : 0;
      
      netWorth += savingsAmount + investmentGains;
      
      projection.push({
        age: currentAge,
        year: currentAge,
        netWorth: Math.round(netWorth),
        income: Math.round(realIncome),
        expenses: Math.round(totalExpenses),
        savings: Math.round(savingsAmount),
        married: isMarried,
        partnered: isPartnered,
        children: childrenBorn,
        homeOwner: ownHouse,
        livingExpenses: Math.round(livingExpenses),
        housingExpenses: Math.round(housingExpenses),
        childExpenses: Math.round(childExpenses * regionData.living * inflationFactor)
      });
    }
    
    return projection;
  };

  const isProfileComplete = () => {
    return basicProfile.name && basicProfile.age && basicProfile.gender && basicProfile.lifeStage;
  };

  const isScenarioComplete = () => {
    return currentScenario.name.trim() !== '';
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication forms if not logged in
  if (!isAuthenticated) {
    return authStep === 'login' ? (
      <LoginForm 
        onLogin={handleLogin} 
        loading={isAuthLoading} 
        error={authError} 
      />
    ) : (
      <SignupForm 
        onSignup={handleSignup} 
        loading={isAuthLoading} 
        error={authError} 
      />
    );
  }

  // Profile Setup Component
  if (step === 'profile_setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
          {/* Validation Error Banner */}
          {showProfileValidationErrors && Object.keys(profileValidationErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-medium text-red-800">Please complete all required fields:</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(profileValidationErrors).map(([field, error]) => (
                  <li key={field} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Life Financial Planner</h1>
            <p className="text-gray-600">Let's start with some basic information about you</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={basicProfile.name}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How old are you?
              </label>
              <input
                type="number"
                value={basicProfile.age}
                onChange={(e) => handleProfileUpdate('age', e.target.value)}
                placeholder="Age"
                min="16"
                max="75"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender (optional, helps with life expectancy calculations)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleProfileUpdate('gender', option.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      basicProfile.gender === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your current life stage?
              </label>
              <div className="space-y-3">
                {lifeStageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleProfileUpdate('lifeStage', option.value)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      basicProfile.lifeStage === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          basicProfile.lifeStage === option.value ? 'text-blue-700' : 'text-gray-800'
                        }`}>
                          {option.label}
                        </h3>
                        <p className={`text-sm ${
                          basicProfile.lifeStage === option.value ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {option.desc}
                        </p>
                      </div>
                      {basicProfile.lifeStage === option.value && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={saveBasicProfile}
              disabled={!isProfileComplete()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isProfileComplete()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Financial Scenarios
              <ArrowRight className="h-5 w-5" />
            </button>
            
            {!isProfileComplete() && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Please complete all fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Scenario List View
  if (step === 'scenario_list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {basicProfile.name}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your financial scenarios and explore different life paths
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <button
                  onClick={createNewScenario}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  New Scenario
                </button>
              </div>
            </div>

            {scenarios.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No scenarios yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first financial scenario to start exploring different life paths
                </p>
                <button
                  onClick={createNewScenario}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Scenario
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{scenario.name}</h3>
                        {scenario.description && (
                          <p className="text-gray-600 mt-1">{scenario.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editScenario(scenario)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteScenario(scenario.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Income:</span>
                        <span>${scenario.currentIncome?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Housing:</span>
                        <span className="capitalize">{scenario.housingStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span className="font-medium">Status:</span>
                        <span className="capitalize">{scenario.relationshipStatus.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <button 
                        onClick={() => runAnalysis(scenario)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Run Analysis →
                      </button>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedScenariosForComparison.some(s => s.scenario.id === scenario.id)}
                          onChange={(e) => {
                            if (e.target.checked && selectedScenariosForComparison.length < 3) {
                              const results = calculateLifeProjection(scenario, basicProfile);
                              setSelectedScenariosForComparison(prev => [...prev, { scenario, results }]);
                            } else {
                              setSelectedScenariosForComparison(prev => 
                                prev.filter(s => s.scenario.id !== scenario.id)
                              );
                            }
                          }}
                          className="rounded"
                          disabled={!selectedScenariosForComparison.some(s => s.scenario.id === scenario.id) && selectedScenariosForComparison.length >= 3}
                        />
                        Compare
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Compare Scenarios Button */}
            {selectedScenariosForComparison.length >= 2 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-blue-800">
                      {selectedScenariosForComparison.length} scenarios selected for comparison
                    </h4>
                    <p className="text-sm text-blue-600">
                      {selectedScenariosForComparison.map(s => s.scenario.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedScenariosForComparison([])}
                      className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 border border-blue-200 rounded"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setStep('scenario_comparison')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Compare Scenarios
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setStep('profile_setup');
                  setBasicProfile({ name: '', age: '', gender: '', lifeStage: '' });
                  setScenarios([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scenario Creator
  if (step === 'scenario_create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setStep('scenario_list')}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {currentScenario.id ? 'Edit Scenario' : 'Create New Scenario'}
                </h1>
                <p className="text-gray-600">Define your financial situation and goals</p>
              </div>
            </div>

            {/* Validation Error Banner */}
            {showScenarioValidationErrors && Object.keys(scenarioValidationErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(scenarioValidationErrors).map(([field, error]) => (
                    <li key={field} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-8">
              {/* Basic Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Scenario Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scenario Name *
                    </label>
                    <input
                      type="text"
                      value={currentScenario.name}
                      onChange={(e) => handleScenarioUpdate('name', e.target.value)}
                      placeholder="e.g., Current Situation, Dream Job Path, Conservative Plan"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={currentScenario.description}
                      onChange={(e) => handleScenarioUpdate('description', e.target.value)}
                      placeholder="Brief description of this scenario..."
                      rows="2"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Basics */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Financial Basics</h3>
                  </div>
                  <button
                    onClick={() => setStep('methodology')}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                    View Methodology
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Annual Income
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        max="500000"
                        step="1000"
                        value={currentScenario.currentIncome}
                        onChange={(e) => handleScenarioUpdate('currentIncome', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Debt
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        max="500000"
                        step="1000"
                        value={currentScenario.currentDebt}
                        onChange={(e) => handleScenarioUpdate('currentDebt', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Savings
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        max="500000"
                        step="1000"
                        value={currentScenario.currentSavings}
                        onChange={(e) => handleScenarioUpdate('currentSavings', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Living Expenses
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        max="20000"
                        step="100"
                        value={currentScenario.monthlyExpenses}
                        onChange={(e) => handleScenarioUpdate('monthlyExpenses', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="3000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Excludes housing costs</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Salary Growth Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        step="0.5"
                        value={currentScenario.salaryGrowthRate}
                        onChange={(e) => handleScenarioUpdate('salaryGrowthRate', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="3"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Typical range: 2-5%</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setStep('scenario_list')}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveScenario}
                  disabled={!isScenarioComplete()}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isScenarioComplete()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  {currentScenario.id ? 'Update Scenario' : 'Save Scenario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scenario Results View
  if (step === 'scenario_results' && analysisResults) {
    const { scenario, results } = analysisResults;
    const enhancedMetrics = calculateEnhancedMetrics(results, scenario);
    const finalYear = results[results.length - 1];
    const peakNetWorth = results.reduce((max, year) => year.netWorth > max.netWorth ? year : max);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setStep('scenario_list')}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{scenario.name}</h1>
                <p className="text-gray-600">Comprehensive financial analysis over {results.length} years</p>
              </div>
            </div>

            {/* Enhanced Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Net Worth at {finalYear.age}</h4>
                <p className="text-2xl font-bold">${finalYear.netWorth.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Retirement Readiness</h4>
                <p className="text-2xl font-bold">Grade {enhancedMetrics.retirementReadiness.grade}</p>
                <p className="text-xs opacity-75">{enhancedMetrics.retirementReadiness.readinessPercent}% of goal</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Avg Savings Rate</h4>
                <p className="text-2xl font-bold">{enhancedMetrics.retirementReadiness.avgSavingsRate}%</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Emergency Fund</h4>
                <p className="text-2xl font-bold">{enhancedMetrics.retirementReadiness.monthsEmergencyFund} mos</p>
              </div>
            </div>
          </div>

          {/* Net Worth Chart */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Net Worth Progression</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value, name) => [`${value?.toLocaleString()}`, name]}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  name="Net Worth"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between">
              <button
                onClick={() => setStep('scenario_list')}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Scenarios
              </button>
              <button
                onClick={() => editScenario(scenario)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Scenario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">Please refresh the page and try again.</p>
        <button
          onClick={() => setStep('profile_setup')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default LifeFinancialPlanner;
