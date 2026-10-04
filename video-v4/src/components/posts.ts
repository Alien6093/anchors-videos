export type PostCopy = {
  key: string;
  headline: string;      // creator headline under name
  lines: string[];       // visible excerpt lines
  tags: string;
  image: { title: string; kicker: string; hue: number };
};

export const POSTS: Record<string, PostCopy> = {
  riya: {
    key: 'riya', headline: 'People & Culture Leader, ex-Deloitte',
    lines: ['Ask any hiring panel if their interviews are structured. Most will say yes.', 'Now ask how the final call was made.'],
    tags: '#ZekoAI #StructuredInterviewing #PeopleAndCulture',
    image: { title: 'Evidence over gut feel', kicker: 'Structured interviews', hue: 262 },
  },
  jyoti: {
    key: 'jyoti', headline: 'ATS-Resume Expert | YourSweet HR | Career Coach',
    lines: ['I review resumes for a living. A resume tells you what someone claims.', 'An ATS tells you what keywords matched.'],
    tags: '#ZekoAI #ATS #ResumeInsights',
    image: { title: 'Resume first. Evidence next.', kicker: 'Capability intelligence', hue: 232 },
  },
  ashish1: {
    key: 'ashish', headline: 'Founder - The AI Edge | AI, Business & Future of Work',
    lines: ['Structured interviews were supposed to fix hiring. They didn\'t fully.', 'The final call still leans on gut feel.'],
    tags: '#AI #HR #Hiring',
    image: { title: 'Impressions vs. evidence', kicker: 'Hiring decisions', hue: 250 },
  },
  ashish2: {
    key: 'ashish', headline: 'Founder - The AI Edge | AI, Business & Future of Work',
    lines: ['Structured interviews were supposed to fix hiring. Zeko AI shows why they didn\'t fully:', 'the final call still leans on gut feel.'],
    tags: '#ZekoAI #AIinHR #Hiring',
    image: { title: 'Impressions vs. evidence', kicker: 'Hiring decisions', hue: 250 },
  },
  darika1: {
    key: 'darika', headline: 'HR Strategist turned LinkedIn Positioning Specialist | 2x WEF Awardee',
    lines: ['We are thrilled to announce a revolutionary, game-changing solution for the future of HR! Zeko AI is the world\'s number one platform...'],
    tags: '#ZekoAI #HR #Innovation',
    image: { title: 'Proof behind every hire', kicker: 'Talent intelligence', hue: 275 },
  },
  darika2: {
    key: 'darika', headline: 'HR Strategist turned LinkedIn Positioning Specialist | 2x WEF Awardee',
    lines: ['Here is a pattern I keep seeing across HR strategy work: the interview is structured, the scorecard is filled, and the final decision is still made on instinct.'],
    tags: '#ZekoAI #HRStrategy #TalentIntelligence',
    image: { title: 'Proof behind every hire', kicker: 'Talent intelligence', hue: 275 },
  },
  priyanshu1: {
    key: 'priyanshu', headline: 'Founder @ Manstar Media | Turning Founders into Category Leaders',
    lines: ['Bias in hiring? Gone. Zeko AI removes gut decisions completely and guarantees the perfect hire every time.'],
    tags: '#ZekoAI #Hiring #Startups',
    image: { title: 'Decisions with proof', kicker: 'Founder hiring', hue: 245 },
  },
};
