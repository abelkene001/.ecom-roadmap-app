document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInputArea = document.getElementById('userInputArea');
    const roadmapContainer = document.getElementById('roadmapContainer');
    const roadmapContent = document.getElementById('roadmapContent');
    
    // Store user's answers
    let userProfile = {
        hasLiveStore: null,
        trafficSources: [],
        monthlyRevenue: null,
        hasEmailCampaigns: null,
        mainBottleneck: null,
        ninetyDayGoal: null
    };
    
    // Questions flow
    const questions = [
        {
            id: 'welcome',
            message: 'Welcome to the NestLaunch Opportunity Blueprint! I\'ll ask you a few questions to generate your personalized roadmap. Ready to uncover your biggest growth opportunities?',
            options: [
                { text: 'Let\'s do it!', next: 'hasLiveStore' }
            ]
        },
        {
            id: 'hasLiveStore',
            message: 'Do you currently have a live e-commerce store?',
            options: [
                { text: 'Yes', value: true, next: 'trafficSources' },
                { text: 'No', value: false, next: 'noStoreReason' }
            ],
            saveAs: 'hasLiveStore'
        },
        {
            id: 'noStoreReason',
            message: 'What\'s stopping you from launching your store?',
            options: [
                { text: 'No time', value: 'no_time', next: 'monthlyRevenue' },
                { text: 'Don\'t know how', value: 'no_knowledge', next: 'monthlyRevenue' },
                { text: 'Budget constraints', value: 'budget', next: 'monthlyRevenue' }
            ],
            saveAs: 'noStoreReason'
        },
        {
            id: 'trafficSources',
            message: 'Where is your traffic currently coming from? (Select all that apply)',
            options: [
                { text: 'Paid Ads', value: 'paid_ads', multi: true },
                { text: 'Organic/SEO', value: 'organic', multi: true },
                { text: 'Email/SMS', value: 'email', multi: true },
                { text: 'Influencers', value: 'influencers', multi: true },
                { text: 'None/Very little', value: 'none', multi: true },
                { text: 'Continue', next: 'monthlyRevenue' }
            ],
            saveAs: 'trafficSources',
            multiSelect: true
        },
        {
            id: 'monthlyRevenue',
            message: 'What\'s your average monthly revenue?',
            options: [
                { text: '$0 (Pre-launch)', value: '0', next: 'hasEmailCampaigns' },
                { text: '$1 - $1,000', value: '1-1000', next: 'hasEmailCampaigns' },
                { text: '$1,001 - $5,000', value: '1001-5000', next: 'hasEmailCampaigns' },
                { text: '$5,001 - $10,000', value: '5001-10000', next: 'hasEmailCampaigns' },
                { text: '$10,000+', value: '10000+', next: 'hasEmailCampaigns' }
            ],
            saveAs: 'monthlyRevenue'
        },
        {
            id: 'hasEmailCampaigns',
            message: 'Do you currently run email or SMS marketing campaigns?',
            options: [
                { text: 'Yes', value: true, next: 'retentionRate' },
                { text: 'No', value: false, next: 'lostCarts' }
            ],
            saveAs: 'hasEmailCampaigns'
        },
        {
            id: 'retentionRate',
            message: 'How satisfied are you with your customer retention rate?',
            options: [
                { text: 'Very satisfied', value: 'high', next: 'mainBottleneck' },
                { text: 'Somewhat satisfied', value: 'medium', next: 'mainBottleneck' },
                { text: 'Not satisfied', value: 'low', next: 'mainBottleneck' }
            ],
            saveAs: 'retentionRate'
        },
        {
            id: 'lostCarts',
            message: 'Are you losing potential sales due to abandoned carts with no follow-up?',
            options: [
                { text: 'Yes, likely', value: true, next: 'mainBottleneck' },
                { text: 'No, we recover them', value: false, next: 'mainBottleneck' },
                { text: 'Not sure', value: 'unknown', next: 'mainBottleneck' }
            ],
            saveAs: 'lostCarts'
        },
        {
            id: 'mainBottleneck',
            message: 'What\'s your #1 bottleneck right now?',
            options: [
                { text: 'Getting traffic', value: 'traffic', next: 'ninetyDayGoal' },
                { text: 'Converting visitors', value: 'conversions', next: 'ninetyDayGoal' },
                { text: 'Customer retention', value: 'retention', next: 'ninetyDayGoal' },
                { text: 'Scaling operations', value: 'scaling', next: 'ninetyDayGoal' }
            ],
            saveAs: 'mainBottleneck'
        },
        {
            id: 'ninetyDayGoal',
            message: 'What\'s your primary goal for the next 90 days?',
            options: [
                { text: 'Launch my store', value: 'launch', next: 'generating' },
                { text: 'Fix conversion leaks', value: 'fix_leaks', next: 'generating' },
                { text: 'Double my sales', value: 'double_sales', next: 'generating' },
                { text: 'Automate operations', value: 'automate', next: 'generating' }
            ],
            saveAs: 'ninetyDayGoal'
        },
        {
            id: 'generating',
            message: 'Thanks for sharing! I\'m analyzing your responses and generating your personalized e-commerce roadmap...',
            options: [],
            autoProgress: true,
            next: 'complete',
            delay: 2000
        },
        {
            id: 'complete',
            message: 'Your personalized roadmap is ready! Take a look below to see your biggest opportunities and recommended next steps.',
            options: [],
            showRoadmap: true
        }
    ];
    
    // Define service mapping logic
    const serviceMappings = {
        // Biggest Gap Analysis
        identifyBiggestGap: (profile) => {
            if (!profile.hasLiveStore) {
                return {
                    gap: 'No E-Commerce Store',
                    icon: 'fa-store',
                    description: 'You need a professional online store to start selling your products.',
                    quickWin: 'Launch a one-page Shopify store today with our free guide + $100}3g1 credits.',
                    recommendedService: 'Launch & Grow',
                    steps: [
                        'Create a simple "Coming Soon" page with email collector',
                        'Build a pre-launch audience on social media',
                        'Develop your minimum viable product lineup'
                    ]
                };
            } 
            
            if (profile.trafficSources.includes('none') || 
                (profile.trafficSources.length === 0 && profile.hasLiveStore)) {
                return {
                    gap: 'No Traffic Generation',
                    icon: 'fa-chart-line',
                    description: 'Your store needs visitors before it can generate sales.',
                    quickWin: 'Start a $5/day testing campaign with our product launch ad script (Meta & Google ready).',
                    recommendedService: 'Ads Setup & Management',
                    steps: [
                        'Identify your ideal customer avatar',
                        'Create compelling ad creatives that showcase your products',
                        'Set up proper tracking to measure ad performance'
                    ]
                };
            }
            
            if (!profile.hasEmailCampaigns || profile.lostCarts === true) {
                return {
                    gap: 'Abandonment & No Follow-up',
                    icon: 'fa-envelope',
                    description: 'You\'re losing sales without proper email/SMS follow-up systems.',
                    quickWin: 'Recover 15% of abandoned carts with our Klaviyo abandonment template (15-minute setup).',
                    recommendedService: 'Email Automation',
                    steps: [
                        'Set up abandoned cart recovery emails',
                        'Create a post-purchase follow-up sequence',
                        'Develop a re-engagement campaign for past customers'
                    ]
                };
            }
            
            if (profile.mainBottleneck === 'conversions') {
                return {
                    gap: 'Low Conversion Rate',
                    icon: 'fa-funnel-dollar',
                    description: 'Your store visitors aren\'t converting into customers at an optimal rate.',
                    quickWin: 'Add trust badges, reviews, and urgency timers with our free Conversion Booster pack.',
                    recommendedService: 'Landing Page Design',
                    steps: [
                        'Optimize your product pages with better images and copy',
                        'Streamline your checkout process to reduce friction',
                        'Implement A/B testing to continuously improve'
                    ]
                };
            }
            
            if (profile.mainBottleneck === 'retention' || 
                (profile.retentionRate === 'low' && profile.hasEmailCampaigns)) {
                return {
                    gap: 'Poor Customer Retention',
                    icon: 'fa-users',
                    description: 'You\'re not maximizing the lifetime value of your existing customers.',
                    quickWin: 'Launch a "VIP loyalty program" with our free template.',
                    recommendedService: 'Scale & Automate',
                    steps: [
                        'Create a segmented customer journey based on purchase history',
                        'Implement a loyalty/rewards program',
                        'Develop a referral program to leverage existing customers'
                    ]
                };
            }
            
            if (profile.mainBottleneck === 'scaling' || 
                (profile.monthlyRevenue === '10000+' && profile.ninetyDayGoal === 'automate')) {
                return {
                    gap: 'Manual Processes Limiting Growth',
                    icon: 'fa-rocket',
                    description: 'Your business needs automation to scale efficiently.',
                    quickWin: 'Free retention audit template to identify your biggest automation opportunities.',
                    recommendedService: 'Scale & Automate',
                    steps: [
                        'Automate inventory and order management',
                        'Create dashboards for monitoring key metrics',
                        'Implement systems to scale customer support'
                    ]
                };
            }
            
            // Default case if no specific gap is identified
            return {
                gap: 'Growth Optimization',
                icon: 'fa-level-up-alt',
                description: 'You need a comprehensive strategy to take your store to the next level.',
                quickWin: 'Complete e-commerce audit with our 20-point checklist.',
                recommendedService: profile.monthlyRevenue === '10000+' ? 'Scale & Automate' : 'Launch & Grow',
                steps: [
                    'Conduct a competitive analysis to find market gaps',
                    'Optimize your best-selling products for higher conversion',
                    'Implement a data-driven marketing strategy'
                ]
            };
        },
        
        // Recommended package logic
        getRecommendedPackage: (profile, biggestGap) => {
            // Launch & Grow package
            if (!profile.hasLiveStore || 
                profile.monthlyRevenue === '0' || 
                profile.monthlyRevenue === '1-1000' ||
                profile.ninetyDayGoal === 'launch') {
                return {
                    name: 'Launch & Grow',
                    price: '$1,500 (One-Time)',
                    features: [
                        '1 Sales Funnel',
                        '1 High-Converting Landing Page',
                        'Basic E-Commerce Store (Up to 10 Products)',
                        '1 Ad Campaign Setup',
                        '30-Day Email Support',
                        'Basic Analytics Dashboard',
                        '1 Revision Round'
                    ],
                    buttonText: 'Get Started Now',
                    ideal: 'Perfect for startups or businesses needing essential tools to launch.'
                };
            }
            
            // Scale & Automate package
            if (profile.monthlyRevenue === '5001-10000' || 
                profile.monthlyRevenue === '10000+' ||
                profile.ninetyDayGoal === 'automate' ||
                profile.ninetyDayGoal === 'double_sales' ||
                biggestGap.recommendedService === 'Scale & Automate') {
                return {
                    name: 'Scale & Automate',
                    price: '$2,500/Month (Subscription)',
                    features: [
                        'Multi-Platform Ad Management',
                        'Advanced Sales Funnels (Webinars, Upsells)',
                        'Unlimited Product E-Commerce Store',
                        'Monthly Cash Flow Reports',
                        'Dedicated Account Manager',
                        'Unlimited Revisions',
                        'A/B Testing & Optimization',
                        'Weekly Strategy Calls'
                    ],
                    buttonText: 'Schedule Strategy Session',
                    ideal: 'Ideal for growing businesses ready to expand and automate.'
                };
            }
            
            // Custom Solution (default)
            const recommendedServices = [];
            
            if (biggestGap.recommendedService === 'Ads Setup & Management') {
                recommendedServices.push('Ads Setup & Management — $600');
            }
            
            if (biggestGap.recommendedService === 'Landing Page Design') {
                recommendedServices.push('Landing Page Design — $1,200');
            }
            
            if (biggestGap.recommendedService === 'Email Automation') {
                recommendedServices.push('Email Automation — $800');
            }
            
            // If we have specific service recommendations
            if (recommendedServices.length > 0) {
                return {
                    name: 'Custom Solution',
                    price: 'Based on Selected Services',
                    features: recommendedServices,
                    buttonText: 'Build Your Custom Package',
                    ideal: 'Tailored specifically to address your biggest growth opportunity.',
                    isCustom: true
                };
            }
            
            // Default to Launch & Grow for most cases
            return {
                name: 'Launch & Grow',
                price: '$1,500 (One-Time)',
                features: [
                    '1 Sales Funnel',
                    '1 High-Converting Landing Page',
                    'Basic E-Commerce Store (Up to 10 Products)',
                    '1 Ad Campaign Setup',
                    '30-Day Email Support',
                    'Basic Analytics Dashboard',
                    '1 Revision Round'
                ],
                buttonText: 'Get Started Now',
                ideal: 'Perfect for startups or businesses needing essential tools to launch.'
            };
        }
    };
    
    // Display a chat message
    function displayMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        if (isUser) {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('bot-message');
        }
        
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Display user options
    function displayOptions(question) {
        userInputArea.innerHTML = '';
        
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                
                button.addEventListener('click', () => {
                    // Display user's choice
                    displayMessage(option.text, true);
                    
                    // Save the user's answer if specified
                    if (question.saveAs && !question.multiSelect) {
                        userProfile[question.saveAs] = option.value;
                    } else if (question.saveAs && question.multiSelect && option.multi) {
                        // Handle multi-select questions
                        if (!userProfile[question.saveAs]) {
                            userProfile[question.saveAs] = [];
                        }
                        
                        if (!userProfile[question.saveAs].includes(option.value)) {
                            userProfile[question.saveAs].push(option.value);
                        } else {
                            // Remove if already selected (toggle)
                            userProfile[question.saveAs] = userProfile[question.saveAs].filter(v => v !== option.value);
                            button.classList.remove('selected');
                        }
                        
                        // Toggle selected state for multi-select buttons
                        if (option.multi) {
                            button.classList.toggle('selected');
                            return; // Don't move to next question yet
                        }
                    }
                    
                    // Progress to the next question
                    if (option.next) {
                        const nextQuestion = questions.find(q => q.id === option.next);
                        if (nextQuestion) {
                            setTimeout(() => {
                                displayMessage(nextQuestion.message);
                                displayOptions(nextQuestion);
                                
                                // Handle auto-progress questions
                                if (nextQuestion.autoProgress && nextQuestion.next) {
                                    const delay = nextQuestion.delay || 1000;
                                    setTimeout(() => {
                                        const autoNextQuestion = questions.find(q => q.id === nextQuestion.next);
                                        if (autoNextQuestion) {
                                            displayMessage(autoNextQuestion.message);
                                            displayOptions(autoNextQuestion);
                                            
                                            // Show roadmap if specified
                                            if (autoNextQuestion.showRoadmap) {
                                                generateRoadmap();
                                            }
                                        }
                                    }, delay);
                                }
                                
                                // Show roadmap if specified
                                if (nextQuestion.showRoadmap) {
                                    generateRoadmap();
                                }
                            }, 600);
                        }
                    }
                });
                
                userInputArea.appendChild(button);
            });
        }
    }
    
    // Generate personalized roadmap
    function generateRoadmap() {
        // Identify biggest gap and recommended services
        const biggestGap = serviceMappings.identifyBiggestGap(userProfile);
        const recommendedPackage = serviceMappings.getRecommendedPackage(userProfile, biggestGap);
        
        // Build the roadmap HTML
        roadmapContent.innerHTML = `
            <div class="gap-section">
                <div class="gap-title">
                    <i class="fas ${biggestGap.icon}"></i>
                    <span>YOUR BIGGEST GAP: ${biggestGap.gap}</span>
                </div>
                <p>${biggestGap.description}</p>
                
                <div class="quick-win">
                    <strong>QUICK WIN:</strong> ${biggestGap.quickWin}
                </div>
                
                <div class="next-steps">
                    <h4>NEXT STEPS:</h4>
                    ${biggestGap.steps.map((step, index) => `
                        <div class="step-item">
                            <div class="step-number">${index + 1}</div>
                            <div>${step}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="solution-card">
                    <h3>${recommendedPackage.isCustom ? 'RECOMMENDED SERVICES:' : 'RECOMMENDED PACKAGE:'}</h3>
                    <div class="solution-price">${recommendedPackage.name} - ${recommendedPackage.price}</div>
                    <p><em>${recommendedPackage.ideal}</em></p>
                    
                    <div class="feature-list">
                        ${recommendedPackage.features.map(feature => `
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <div>${feature}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Show the roadmap container
        roadmapContainer.classList.remove('hidden');
        
        // Set up action button event listeners
        document.getElementById('downloadRoadmap').addEventListener('click', () => {
            alert('Your roadmap PDF is being prepared and will be sent to your email shortly. Please provide your email in the next step.');
        });
        
        document.getElementById('bookCall').addEventListener('click', () => {
            window.open('https://wa.me/message/ONVPYCEE6QSGC1', '_blank');
        });
    }
    
    // Start the conversation with the welcome message
    const welcomeQuestion = questions.find(q => q.id === 'welcome');
    displayMessage(welcomeQuestion.message);
    displayOptions(welcomeQuestion);
});