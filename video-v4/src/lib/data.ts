export type Creator = {
  key: string; name: string; photo: string; location: string; tagline: string;
  followers: string; avgLikes: number; engagement: string;
  impressions: number; likes: number; comments: number; rank: number;
  status: 'approved-first' | 'sent-back';
};

// photo files live in public/photos (use staticFile('photos/<file>'))
export const CREATORS: Creator[] = [
  { key: 'riya', name: 'Riya Dadhich', photo: 'photos/riya-dadhich.webp', location: 'Mumbai Metropolitan Region', tagline: 'People & Culture Leader · Ex-Deloitte · GenZ Expert', followers: '34,628', avgLikes: 154, engagement: '0.47%', impressions: 17800, likes: 262, comments: 21, rank: 3, status: 'approved-first' },
  { key: 'gunjan', name: 'Gunjan Mishra', photo: 'photos/gunjan-mishra.webp', location: 'Delhi, India', tagline: 'People & Culture Leader | Building High-Impact, People-First Organizations', followers: '1,04,277', avgLikes: 321, engagement: '0.32%', impressions: 34200, likes: 512, comments: 38, rank: 4, status: 'approved-first' },
  { key: 'shubhangi', name: 'Shubhangi Shrivastava', photo: 'photos/shubhangi-shrivastava.webp', location: 'India', tagline: 'HR, Recruitment & Operations specialist | Co-founder', followers: '2,45,658', avgLikes: 745, engagement: '0.32%', impressions: 61500, likes: 905, comments: 64, rank: 13, status: 'approved-first' },
  { key: 'sunidhi', name: 'Sunidhi', photo: 'photos/sunidhi.webp', location: 'Vadodara, Gujarat, India', tagline: 'HR Professional | NMIMS | Content Creator', followers: '1,11,324', avgLikes: 138, engagement: '0.14%', impressions: 26400, likes: 401, comments: 27, rank: 12, status: 'approved-first' },
  { key: 'darika', name: 'Darika Jain', photo: 'photos/darika-jain.webp', location: 'Gurugram, Haryana, India', tagline: 'HR Strategist turned LinkedIn Positioning Specialist | 2x WEF Awardee', followers: '8,19,422', avgLikes: 668, engagement: '0.09%', impressions: 68900, likes: 1085, comments: 72, rank: 16, status: 'sent-back' },
  { key: 'priyanshu', name: 'Priyanshu Manas', photo: 'photos/priyanshu-manas.webp', location: 'New Delhi, Delhi, India', tagline: 'Founder @ Manstar Media | Turning Founders into Category Leaders', followers: '6,602', avgLikes: 235, engagement: '3.64%', impressions: 14300, likes: 318, comments: 41, rank: 10, status: 'sent-back' },
  { key: 'jyoti', name: 'Jyoti Vyas', photo: 'photos/jyoti-vyas.webp', location: 'Vadodara, Gujarat, India', tagline: 'ATS-Resume Expert | YourSweet HR | Career Coach', followers: '7,062', avgLikes: 226, engagement: '3.46%', impressions: 12100, likes: 289, comments: 35, rank: 11, status: 'approved-first' },
  { key: 'ashish', name: 'Ashish Shukla', photo: 'photos/ashish-shukla.webp', location: 'Ahmedabad, Gujarat, India', tagline: 'Founder – The AI Edge | AI, Business & Future of Work', followers: '46,795', avgLikes: 789, engagement: '1.97%', impressions: 44800, likes: 728, comments: 63, rank: 1, status: 'sent-back' },
];

export const TOTALS = { impressions: 280000, likes: 4500, comments: 361, engagement: '1.74%', budgetUsed: '₹1,47,000', budget: '₹1,50,000' };
export const SENTIMENT = { positive: 71, neutral: 25, negative: 4 };
export const AUDIENCE = { role: 'HR Manager / Talent Acquisition 41%', location: 'Delhi NCR 24%', industry: 'IT Services 27%', seniority: 'Senior 34%' };
