import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Plus, 
  Tag, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';

export const Home: React.FC = () => {
  // Mock revenue data for the bar chart - simplified for better visualization
  const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1600 },
    { day: 'Thu', revenue: 2200 },
    { day: 'Fri', revenue: 2800 },
    { day: 'Sat', revenue: 2400 },
    { day: 'Sun', revenue: 3200 },
  ];

  // Colors for the bars - gradient effect
  const barColors = ['#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#047857', '#059669'];

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Overview',
      description: 'Get a complete view of your revenue, profit, amount owed, and daily streak in one beautiful dashboard.',
    },
    {
      icon: TrendingUp,
      title: 'Revenue & Profit Charts',
      description: 'Visualize your financial progress with interactive charts showing trends and insights.',
    },
    {
      icon: Download,
      title: 'Export Reports',
      description: 'Export your financial data to PDF or CSV formats for accounting, tax preparation, or sharing with stakeholders.',
    },
    {
      icon: Plus,
      title: 'Quick Entry',
      description: 'Add financial entries with our floating action button or conversational interface.',
    },
    {
      icon: Tag,
      title: 'Category Manager',
      description: 'Organize your finances with custom categories and see detailed breakdowns of your spending.',
    },
    {
      icon: CreditCard,
      title: 'Debts & Credits',
      description: 'Track what you owe and what others owe you, with payment reminders and status tracking.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds and set up your financial categories to match your business needs.',
      preview: (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="bg-primary-600 p-3 rounded-xl mx-auto w-fit mb-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Your Account</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Start managing your finances in minutes</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3">
                <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
              </div>
              <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3">
                <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-dark-600 rounded w-2/3"></div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3">
              <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 dark:bg-dark-600 rounded w-4/5"></div>
            </div>
            <div className="bg-primary-600 rounded-lg p-3 text-center">
              <div className="h-2 bg-primary-400 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Log Your Entries',
      description: 'Add entries through our intuitive form with smart categorization and real-time calculations.',
      preview: (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Entry</h3>
            <div className="bg-primary-600 p-2 rounded-lg">
              <Plus className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2 w-16"></div>
                <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3">
                  <div className="h-2 bg-gray-400 dark:bg-dark-500 rounded w-20"></div>
                </div>
              </div>
              <div>
                <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2 w-12"></div>
                <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3 flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <div className="h-2 bg-gray-400 dark:bg-dark-500 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="h-2 bg-gray-300 dark:bg-dark-600 rounded mb-2 w-20"></div>
              <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3">
                <div className="h-2 bg-gray-400 dark:bg-dark-500 rounded w-32"></div>
              </div>
            </div>
            <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-600 dark:text-success-400 mr-2" />
                <span className="text-sm text-success-700 dark:text-success-300">Profit: $1,200</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Visualize & Manage',
      description: 'Watch your financial data come to life with real-time charts and actionable insights.',
      preview: (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Overview</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-2 bg-primary-300 dark:bg-primary-600 rounded mb-1 w-12"></div>
                    <div className="h-3 bg-primary-600 dark:bg-primary-400 rounded w-16"></div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-2 bg-success-300 dark:bg-success-600 rounded mb-1 w-10"></div>
                    <div className="h-3 bg-success-600 dark:bg-success-400 rounded w-14"></div>
                  </div>
                  <BarChart3 className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-24 bg-gradient-to-r from-primary-100 to-success-100 dark:from-primary-900/30 dark:to-success-900/30 rounded-lg relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary-600 dark:text-primary-400"
                points="10,45 30,35 50,40 70,25 90,20 110,30 130,15 150,10 170,20 190,15"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-success-600 dark:text-success-400"
                points="10,50 30,42 50,45 70,32 90,28 110,35 130,22 150,18 170,25 190,20"
              />
            </svg>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Take Control of Your{' '}
                <span className="text-primary-600 dark:text-primary-400">
                  Finances
                </span>{' '}
                with Rieno
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
                Track revenue, profit, debts, and more in real-time. No accounting degree needed.
                Perfect for freelancers, students, and small business owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center justify-center">
                  Login
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">4.9/5</span> • 1,200+ users
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,847</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-secondary-500" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Profit</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$8,234</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-primary-600" />
                    </div>
                  </Card>
                </div>
                
                {/* Replace line chart with beautiful bar chart */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Revenue</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</span>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis hide />
                        <Bar 
                          dataKey="revenue" 
                          radius={[4, 4, 0, 0]}
                          fill="url(#colorGradient)"
                        >
                          {revenueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index]} />
                          ))}
                        </Bar>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Peak: Sunday ($3.2k)</span>
                    <span className="text-success-600 dark:text-success-400">↗ +15% vs last week</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
              Powerful features designed specifically for freelancers, students, and small business owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={feature.title} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card h-full hover:shadow-card-hover dark:hover:shadow-dark-hover transition-shadow"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-primary-700 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              From setup to insights in minutes, not hours
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-primary-700 dark:text-primary-400">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-700 p-6 rounded-2xl border border-gray-200 dark:border-dark-600">
                    <div className="relative h-80 flex items-center justify-center">
                      {step.preview}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Built for the Modern Professional
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Rieno was created by freelancers, for freelancers. We understand the unique challenges 
                of managing finances when you're your own boss, studying, or running a small business.
              </p>
              <div className="space-y-4">
                {[
                  'No complex accounting jargon',
                  'Real-time insights and analytics',
                  'Designed for non-accountants',
                  'Secure and private by design'
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="card text-center">
                <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1,200+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="card text-center">
                <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="card text-center">
                <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$2M+</div>
                <div className="text-gray-600 dark:text-gray-400">Tracked Revenue</div>
              </div>
              <div className="card text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</div>
                <div className="text-gray-600 dark:text-gray-400">User Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of professionals who trust Rieno with their financial tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-secondary inline-flex items-center justify-center">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};