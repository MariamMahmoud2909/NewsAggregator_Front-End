export interface INews {
  title: string;
  author: string;
  published_Date: string;   // Adjusted from 'published_Date'
  publishedDatePrecision: string;  // Adjusted from 'published_Date_Precision'
  link: string;
  cleanUrl: string;
  excerpt: string;
  summary: string;
  rights: string;
  rank: number;
  topic: string;
  country: string;
  language: string;
  authors: string[]; // Array for authors
  media: string;  // URL for media (image or video)
  isOpinion: boolean;  // Adjusted from 'is_Opinion'
  twitterAccount: string; // Adjusted from 'twitter_Account'
  _Id: string;   // Adjusted from '_Id'
}
