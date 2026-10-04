import { PostCopy } from '../posts';

export type BPost = PostCopy & { opening: string[] };

const mk = (key: string, headline: string, opening: string[], tags: string, image: PostCopy['image']): BPost => ({ key, headline, lines: opening, opening, tags, image });

export const B_POSTS: Record<string, BPost> = {
  riya: mk('riya', 'People & Culture Leader · Ex-Deloitte · GenZ Expert',
    ["Zeko AI made me revisit a question I've asked on many interview panels: is our interview really structured?"],
    '#ZekoAI #StructuredInterviewing #PeopleAndCulture', { title: 'Evidence over gut feel', kicker: 'Structured interviews', hue: 262 }),
  jyoti: mk('jyoti', 'ATS-Resume Expert | YourSweet HR | Career Coach',
    ['I review resumes for a living, and Zeko AI caught my eye for one reason: a resume tells you what someone claims, an ATS what keywords matched.'],
    '#ZekoAI #ATS #ResumeInsights', { title: 'Resume first. Evidence next.', kicker: 'Capability intelligence', hue: 232 }),
  gunjan: mk('gunjan', 'People & Culture Leader | Building High-Impact, People-First Organizations',
    ['A structured interview with an unstructured decision is just a nicer-looking gut call.', 'Zeko AI is one HR tech idea that goes after that last step.'],
    '#ZekoAI #TalentDecisions #HRTech', { title: 'Decisions you can point to', kicker: 'HR tech', hue: 200 }),
  shubhangi: mk('shubhangi', 'HR, Recruitment & Operations specialist | Co-founder',
    ['Zeko AI is built around a gap I keep seeing in recruitment ops: the hunch.', "I track time-to-hire, offer acceptance and drop-offs. What I can't track is why a good candidate got rejected on a feeling."],
    '#ZekoAI #Recruitment #WorkforceIntelligence', { title: 'Every decision, a trail', kicker: 'Workforce intelligence', hue: 285 }),
  sunidhi: mk('sunidhi', 'HR Professional | NMIMS | Content Creator',
    ['Three interviewers. Three different opinions of the same candidate. One final decision nobody can fully explain.', 'Sound familiar? It is the moment Zeko AI was built for.'],
    '#ZekoAI #HRLeaders #HiringDecisions', { title: 'Capability you can verify', kicker: 'Conversation intelligence', hue: 310 }),
  ashish1: mk('ashish', 'Founder – The AI Edge | AI, Business & Future of Work',
    ["Structured interviews were supposed to fix hiring. They didn't fully. The final call still leans on gut feel.",
      "I've been looking at a new tool that turns adaptive talent conversations into verified capability data. It gives decision makers evidence instead of impressions."],
    '#AI #FutureOfWork #Hiring', { title: 'Impressions vs. evidence', kicker: 'Hiring decisions', hue: 250 }),
  ashish2: mk('ashish', 'Founder – The AI Edge | AI, Business & Future of Work',
    ["Structured interviews were supposed to fix hiring. They didn't fully. The final call still leans on gut feel.",
      'Zeko AI is aimed at exactly that step: it turns adaptive talent conversations into verified capability data, so decision makers get evidence instead of impressions.'],
    '#ZekoAI #AI #FutureOfWork #Hiring', { title: 'Impressions vs. evidence', kicker: 'Hiring decisions', hue: 250 }),
};

export const DARIKA_FIRST = "We are excited to announce Zeko AI, a revolutionary new platform and the world's number one choice for enterprise workforce intelligence. Book a walkthrough today and transform your hiring overnight.";
export const DARIKA_MARKS = ['excited to announce', 'revolutionary', "world's number one", 'transform your hiring overnight'];
export const PRIYANSHU_FIRST = "Zeko AI removes gut decisions from hiring completely and guarantees the perfect hire every time. No more mistakes, no more regrets. Founders, this is the only tool you'll ever need for talent decisions.";
export const PRIYANSHU_MARKS = ['removes gut decisions from hiring completely', 'guarantees the perfect hire every time', 'the only tool'];

export const CHECKS = ['Zeko AI in line 1', '#ZekoAI', 'People & Culture angle', 'No absolute claims', 'No press-release tone'];
