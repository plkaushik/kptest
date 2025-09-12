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

          {/* Cash Flow Analysis */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enhancedMetrics.cashFlowAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'income') return [`${value?.toLocaleString()}`, 'Annual Income'];
                    if (name === 'expenses') return [`${value?.toLocaleString()}`, 'Annual Expenses'];
                    return [`${value?.toLocaleString()}`, name];
                  }}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="income"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="annualCashFlow" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={false}
                  name="Net Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Annual Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Annual Expenses</span>
              </div>
            </div>
          </div>

          {/* Emergency Fund Status */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Fund Coverage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enhancedMetrics.emergencyFundStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis domain={[0, 24]} label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} months`, 
                    name === 'monthsCovered' ? 'Emergency Fund Coverage' : name
                  ]}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="monthsCovered" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="monthsCovered"
                />
                {/* Reference line at 6 months */}
                <Line 
                  type="monotone" 
                  dataKey={() => 6} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Recommended (6 months)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>Shows months of expenses covered by your net worth. Recommended: 6+ months for financial security.</p>
            </div>
          </div>

          {/* Expense Ratios */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Ratios (% of Income)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enhancedMetrics.expenseRatios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis domain={[0, 100]} label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => {
                    const nameMap = {
                      housingRatio: 'Housing',
                      livingRatio: 'Living Expenses', 
                      savingsRatio: 'Savings Rate'
                    };
                    return [`${value}%`, nameMap[name] || name];
                  }}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="housingRatio" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.8}
                  name="housingRatio"
                />
                <Area 
                  type="monotone" 
                  dataKey="livingRatio" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.8}
                  name="livingRatio"
                />
                <Area 
                  type="monotone" 
                  dataKey="savingsRatio" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="savingsRatio"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Housing (Goal: &lt;30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Living Expenses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Savings Rate (Goal: &gt;20%)</span>
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

  // Scenario Comparison View
  if (step === 'scenario_comparison' && selectedScenariosForComparison.length >= 2) {
    const colors = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
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
                <h1 className="text-3xl font-bold text-gray-800">Scenario Comparison</h1>
                <p className="text-gray-600">Comparing {selectedScenariosForComparison.length} scenarios</p>
              </div>
            </div>

            {/* Comparison Summary Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
                    {selectedScenariosForComparison.map((comp, index) => (
                      <th key={comp.scenario.id} className="text-left py-3 px-4 font-medium" style={{color: colors[index]}}>
                        {comp.scenario.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Final Net Worth',
                      getValue: (results) => `${results[results.length - 1].netWorth.toLocaleString()}`
                    },
                    {
                      label: 'Retirement Grade',
                      getValue: (results, scenario) => {
                        const metrics = calculateEnhancedMetrics(results, scenario);
                        return `${metrics.retirementReadiness.grade} (${metrics.retirementReadiness.readinessPercent}%)`;
                      }
                    },
                    {
                      label: 'Avg Savings Rate',
                      getValue: (results, scenario) => {
                        const metrics = calculateEnhancedMetrics(results, scenario);
                        return `${metrics.retirementReadiness.avgSavingsRate}%`;
                      }
                    },
                    {
                      label: 'Peak Net Worth',
                      getValue: (results) => {
                        const peak = results.reduce((max, year) => year.netWorth > max.netWorth ? year : max);
                        return `${peak.netWorth.toLocaleString()} (age ${peak.age})`;
                      }
                    }
                  ].map((metric, metricIndex) => (
                    <tr key={metricIndex} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-700">{metric.label}</td>
                      {selectedScenariosForComparison.map((comp, index) => (
                        <td key={comp.scenario.id} className="py-3 px-4" style={{color: colors[index]}}>
                          {metric.getValue(comp.results, comp.scenario)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Worth Comparison Chart */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Net Worth Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  dataKey="age" 
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value, name) => [`${value?.toLocaleString()}`, name]}
                  labelFormatter={(age) => `Age ${age}`}
                />
                {selectedScenariosForComparison.map((comp, index) => (
                  <Line 
                    key={comp.scenario.id}
                    type="monotone" 
                    dataKey="netWorth"
                    data={comp.results}
                    stroke={colors[index]}
                    strokeWidth={3}
                    name={comp.scenario.name}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-4">
              {selectedScenariosForComparison.map((comp, index) => (
                <div key={comp.scenario.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{backgroundColor: colors[index]}}></div>
                  <span className="text-sm">{comp.scenario.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Flow Comparison */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Annual Savings Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  dataKey="age" 
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value, name) => [`${value?.toLocaleString()}`, name]}
                  labelFormatter={(age) => `Age ${age}`}
                />
                {selectedScenariosForComparison.map((comp, index) => (
                  <Line 
                    key={comp.scenario.id}
                    type="monotone" 
                    dataKey="savings"
                    data={comp.results}
                    stroke={colors[index]}
                    strokeWidth={2}
                    name={comp.scenario.name}
                    connectNulls={false}
                  />
                ))}
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
                onClick={() => setSelectedScenariosForComparison([])}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }import React, { useState, useMemo } from 'react';
import { User, ArrowRight, CheckCircle, Plus, Edit3, Trash2, DollarSign, Home, Heart, TrendingUp, Save, BarChart3, ArrowLeft, FileText, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const LifeFinancialPlanner = () => {
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

  const handleProfileUpdate = (field, value) => {
    setBasicProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScenarioUpdate = (field, value) => {
    setCurrentScenario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fixed: Use React state instead of localStorage
  const saveBasicProfile = () => {
    // Store in React state - localStorage not supported in Claude artifacts
    setStep('scenario_list');
  };

  const saveScenario = () => {
    const scenarioToSave = {
      ...currentScenario,
      id: currentScenario.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedScenarios = currentScenario.id 
      ? scenarios.map(s => s.id === currentScenario.id ? scenarioToSave : s)
      : [...scenarios, scenarioToSave];
    
    setScenarios(updatedScenarios);
    // Removed localStorage - not supported in Claude artifacts
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
    // Removed localStorage - not supported in Claude artifacts
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

  // Profile Setup Component
  if (step === 'profile_setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
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
              <button
                onClick={createNewScenario}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Scenario
              </button>
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

  // Methodology View
  if (step === 'methodology') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setStep('scenario_create')}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">Financial Methodology</h1>
                <p className="text-gray-600">Understanding how your financial projections are calculated</p>
              </div>
              <button
                onClick={() => {
                  const methodologyContent = document.getElementById('methodology-content');
                  const blob = new Blob([methodologyContent.innerText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'financial-methodology.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Download
              </button>
            </div>

            <div id="methodology-content" className="prose max-w-none space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
                <p className="text-gray-700">
                  This financial planner uses a comprehensive model to project your net worth over 45 years, 
                  accounting for income growth, expenses, major life events, and investment returns.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Income Variables
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Current Annual Income:</strong> Your gross yearly salary before taxes</li>
                    <li><strong>Salary Growth Rate:</strong> Annual percentage increase (typical: 2-5%)</li>
                    <li><strong>Partner Income:</strong> Additional household income if married/partnered</li>
                    <li><strong>Location Multiplier:</strong> Adjusts salary based on cost of living</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Expense Variables</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Monthly Living Expenses:</strong> Food, utilities, transportation, entertainment</li>
                    <li><strong>Housing Costs:</strong> Rent or mortgage + property taxes + insurance</li>
                    <li><strong>Child Expenses:</strong> $12,000/year per child (childcare, education, etc.)</li>
                    <li><strong>Inflation Rate:</strong> 2.5% annual increase in expenses</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-600" />
                  Housing Calculations
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium mb-2">Renting:</h4>
                    <ul className="space-y-1">
                      <li>• Monthly rent × location multiplier</li>
                      <li>• Increases with inflation annually</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Home Purchase:</h4>
                    <ul className="space-y-1">
                      <li>• Down payment reduces net worth initially</li>
                      <li>• Monthly payment = (Price - Down) × 0.55% (includes mortgage, taxes, insurance)</li>
                      <li>• Assumes 5.5% interest rate + property costs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Investment & Growth Assumptions
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Investment Return:</strong> 7% annual return on positive net worth</li>
                  <li><strong>Savings Rate:</strong> Income - Expenses = Annual Savings (if positive)</li>
                  <li><strong>Compound Growth:</strong> Returns reinvested annually</li>
                  <li><strong>No Debt Interest:</strong> Assumes debt is paid down without interest calculation</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Location Cost Multipliers</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-green-700">Low Cost Area</h4>
                    <ul className="text-gray-600">
                      <li>Housing: 70%</li>
                      <li>Salary: 90%</li>
                      <li>Living: 80%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Average Cost Area</h4>
                    <ul className="text-gray-600">
                      <li>Housing: 100%</li>
                      <li>Salary: 100%</li>
                      <li>Living: 100%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">High Cost Area</h4>
                    <ul className="text-gray-600">
                      <li>Housing: 180%</li>
                      <li>Salary: 130%</li>
                      <li>Living: 130%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Life Event Modeling</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Marriage/Partnership:</strong> Combines incomes and expenses</li>
                  <li><strong>Children:</strong> Added every 2 years starting at specified age</li>
                  <li><strong>Home Purchase:</strong> Occurs after specified waiting period</li>
                  <li><strong>Career Progression:</strong> Income grows annually by specified rate</li>
                </ul>
              </div>

              <div className="bg-red-100 border border-red-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Important Disclaimers</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• These projections are estimates based on assumptions and should not be considered financial advice</li>
                  <li>• Actual market returns vary significantly and can include negative years</li>
                  <li>• Tax implications are not included in calculations</li>
                  <li>• Emergency expenses and major life changes are not modeled</li>
                  <li>• Consult with a qualified financial advisor for personalized guidance</li>
                </ul>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-gray-500">
                  This methodology is designed to provide general projections for planning purposes only.
                  <br />
                  Generated by Life Financial Planner - {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setStep('scenario_create')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Scenario Creation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scenario Results View
  if (step === 'scenario_results' && analysisResults) {
    const { scenario, results } = analysisResults;
    const finalYear = results[results.length - 1];
    const peakNetWorth = results.reduce((max, year) => year.netWorth > max.netWorth ? year : max);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto">
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
                <p className="text-gray-600">Financial projection over {results.length} years</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Net Worth at {finalYear.age}</h4>
                <p className="text-3xl font-bold">${finalYear.netWorth.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
                <h4 className="text-sm font-medium opacity-90">Peak Net Worth</h4>
                <p className="text-3xl font-bold">${peakNetWorth.netWorth.toLocaleString()}</p>
                <p className="text-xs opacity-75">at age {peakNetWorth.age}</p>
              </div>
            </div>

            {/* Net Worth Chart */}
            <div className="bg-white border rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Net Worth Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value, name) => [`$${value?.toLocaleString()}`, name]}
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

            {/* Fixed: Completed the incomplete return statement */}
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