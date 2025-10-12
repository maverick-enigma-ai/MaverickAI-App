// Sample scenario categories and examples for MaverickAI Enigma Radar™

export type ScenarioCategory = 'corporate' | 'personal' | 'wealth' | 'legal';

export interface SampleScenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  text: string;
}

// Sample scenarios for each category
export const sampleScenarios: Record<ScenarioCategory, SampleScenario[]> = {
  corporate: [
    {
      id: 'corp_1',
      category: 'corporate',
      title: 'Undermining Colleague',
      text: 'My colleague is using passive-aggressive tactics in meetings, undermining my contributions while maintaining a friendly facade. They consistently interrupt me during presentations, then later present similar ideas as their own. This has been escalating over the past 3 months, and I notice other team members starting to distance themselves from collaborative projects with me.'
    },
    {
      id: 'corp_2',
      category: 'corporate',
      title: 'Demanding Client',
      text: 'A major client is pushing aggressive deadlines while continuously expanding project scope without additional budget. They use urgency language and imply our competitors would be "more flexible." The project manager seems intimidated and keeps accepting changes. I\'m concerned this pattern will burn out the team and set unsustainable precedents.'
    },
    {
      id: 'corp_3',
      category: 'corporate',
      title: 'Credit Theft',
      text: 'My manager is taking credit for my strategic initiatives in executive meetings. When I present ideas in our team meetings, they enthusiastically support them, but then present them to leadership as their own insights. I discovered this when a C-suite executive complimented "my manager\'s innovative approach" on a project I designed and executed entirely.'
    },
    {
      id: 'corp_4',
      category: 'corporate',
      title: 'Toxic Boss',
      text: 'My supervisor uses inconsistent feedback and moving goalposts to maintain control. They praise work privately but criticize it publicly, making me second-guess my abilities. Performance reviews contain vague criticism that can\'t be addressed. I\'ve noticed they do this primarily to team members who show independence or strong performance.'
    },
    {
      id: 'corp_5',
      category: 'corporate',
      title: 'Office Politics',
      text: 'Two senior leaders are using our team as pawns in their power struggle. One VP wants aggressive innovation while the other demands risk mitigation. They each privately ask team members to support their position, creating divided loyalties. Projects are getting caught in approval limbo as they battle for influence.'
    }
  ],
  
  personal: [
    {
      id: 'pers_1',
      category: 'personal',
      title: 'Manipulative Friend',
      text: 'A close friend constantly uses guilt and emotional manipulation to get their way. They\'ll make plans, then cancel last minute with dramatic reasons, but expect me to drop everything when they need support. When I set boundaries, they accuse me of being "selfish" or "not a real friend." I\'m starting to feel drained after every interaction.'
    },
    {
      id: 'pers_2',
      category: 'personal',
      title: 'Family Dynamics',
      text: 'My parent uses subtle put-downs disguised as concern or humor in family gatherings. They\'ll make comments about my career choices, relationship status, or lifestyle, then claim they\'re "just joking" if I express discomfort. Other family members stay silent, creating an environment where I\'m made to feel oversensitive for reacting.'
    },
    {
      id: 'pers_3',
      category: 'personal',
      title: 'Controlling Partner',
      text: 'My romantic partner has been gradually isolating me from friends and activities. It started subtly—expressing concern about certain friends, then disappointment when I made plans without them. Now they track my location "for safety" and get upset if I don\'t respond to messages immediately. They frame everything as caring, but I feel controlled.'
    },
    {
      id: 'pers_4',
      category: 'personal',
      title: 'Friendship Rivalry',
      text: 'A friend has turned our relationship into a constant competition. Every achievement I share is met with either one-upmanship or subtle undermining. They celebrate publicly when I struggle but become distant when I succeed. Social gatherings feel like performance evaluations rather than connections.'
    },
    {
      id: 'pers_5',
      category: 'personal',
      title: 'Sibling Jealousy',
      text: 'My sibling uses family events to highlight my perceived failures while painting themselves as the "successful one." They make passive-aggressive comments about my choices, then act hurt if I don\'t seem supportive of their achievements. Our parents seem oblivious or uncomfortable addressing the dynamic, leaving me to either tolerate it or be seen as causing family conflict.'
    }
  ],
  
  wealth: [
    {
      id: 'wealth_1',
      category: 'wealth',
      title: 'Investment Pressure',
      text: 'A financial advisor is pushing aggressive investment strategies that feel misaligned with my risk tolerance. They use technical jargon to make me feel uninformed, then emphasize limited-time opportunities and the success of "smart clients" who acted quickly. When I ask detailed questions, they deflect or imply I\'m overthinking simple decisions.'
    },
    {
      id: 'wealth_2',
      category: 'wealth',
      title: 'Business Partner Conflict',
      text: 'My business partner is making unilateral financial decisions that impact our company\'s direction. They authorized significant expenses without discussion, claiming urgent opportunities couldn\'t wait for "committee approval." They control vendor relationships and financial reporting, making it difficult to verify information independently. I sense deliberate opacity in our financial operations.'
    },
    {
      id: 'wealth_3',
      category: 'wealth',
      title: 'Inheritance Manipulation',
      text: 'A family member has gained sole access to an elderly relative\'s finances, claiming to "help with management." Other family members notice changed behavior in the relative—anxiety about money, vague answers about assets, and reluctance to discuss finances. The family member deflects questions about specific transactions and has begun to isolate the relative from independent financial advice.'
    },
    {
      id: 'wealth_4',
      category: 'wealth',
      title: 'Vendor Overcharging',
      text: 'A long-term service provider has been gradually increasing fees and adding charges for previously included services. When questioned, they cite market changes and suggest my expectations are outdated. I\'ve noticed inconsistencies in invoicing and difficulty getting itemized breakdowns. They subtly imply that finding alternatives would be more expensive and disruptive.'
    },
    {
      id: 'wealth_5',
      category: 'wealth',
      title: 'Luxury Lifestyle Pressure',
      text: 'My social circle maintains an expensive lifestyle that creates pressure to overspend. Events, vacations, and everyday activities assume high budgets. When I suggest more modest alternatives, I receive subtle judgment or exclusion from planning. I\'m spending beyond my means to maintain these relationships but feeling increasingly stressed about financial sustainability.'
    }
  ],
  
  legal: [
    {
      id: 'legal_1',
      category: 'legal',
      title: 'Contract Manipulation',
      text: 'During a business negotiation, the other party keeps introducing last-minute contract changes, claiming they\'re "standard" or "minor clarifications." Each modification slightly shifts liability or terms in their favor. When I request time to review with counsel, they express disappointment about the delay and hint at other interested parties. The pressure to sign feels orchestrated.'
    },
    {
      id: 'legal_2',
      category: 'legal',
      title: 'Custody Manipulation',
      text: 'My co-parent is using our child as leverage in custody discussions. They make unilateral schedule changes, then frame my objections as inflexibility. They document any perceived parenting flaws while dismissing their own issues. Communication has become tactical rather than collaborative, with everything seemingly designed to build a case rather than co-parent effectively.'
    },
    {
      id: 'legal_3',
      category: 'legal',
      title: 'Employment Termination',
      text: 'My employer has begun documenting minor issues after years of strong performance reviews. They\'ve changed reporting structures, excluded me from key meetings, and reassigned my projects. HR meetings focus on vague "performance concerns" that feel fabricated. I suspect they\'re building a termination case, possibly to avoid obligations like severance or equity vesting.'
    },
    {
      id: 'legal_4',
      category: 'legal',
      title: 'Property Dispute',
      text: 'A neighbor is making false claims about property boundaries and creating conflicts over shared spaces. They\'ve installed structures that encroach on my land, then act offended when I raise concerns. They reference "long-standing arrangements" that don\'t match property records. Their aggressive approach seems designed to establish adverse possession claims.'
    },
    {
      id: 'legal_5',
      category: 'legal',
      title: 'Partnership Dissolution',
      text: 'My business partner wants to dissolve our partnership but is using information asymmetry to negotiate favorable terms. They have deeper knowledge of our financial position and client relationships. They frame their preferred terms as "fair market value" while restricting my access to complete records. The negotiation feels adversarial despite years of collaboration.'
    }
  ]
};

// Get a random scenario from a category
export function getRandomScenario(category: ScenarioCategory): SampleScenario {
  const scenarios = sampleScenarios[category];
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
}

// Get random scenarios for all enabled categories
export function getRandomScenarios(enabledCategories: ScenarioCategory[]): SampleScenario[] {
  return enabledCategories.map(category => getRandomScenario(category));
}

// Category display information
export const categoryInfo: Record<ScenarioCategory, { 
  label: string; 
  icon: string; 
  color: string;
  gradient: string;
}> = {
  corporate: {
    label: 'Corporate',
    icon: '💼',
    color: 'cyan',
    gradient: 'from-cyan-400 to-blue-500'
  },
  personal: {
    label: 'Personal',
    icon: '👥',
    color: 'purple',
    gradient: 'from-purple-400 to-pink-500'
  },
  wealth: {
    label: 'Wealth',
    icon: '💰',
    color: 'yellow',
    gradient: 'from-yellow-400 to-orange-500'
  },
  legal: {
    label: 'Legal',
    icon: '⚖️',
    color: 'teal',
    gradient: 'from-teal-400 to-green-500'
  }
};