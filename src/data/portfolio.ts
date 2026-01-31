// Icon imports removed - icons are referenced by string names and mapped in components

export interface PortfolioConfig {
  personal: {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    email: string;
    location: string;
    availability: string;
  };
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  skills: string[];
  projects: {
    id: number | string;
    title: string;
    description: string;
    tags: string[];
    image?: string;
    iconName?: 'ShoppingCart' | 'DollarSign' | 'TrendingUp'; // Mapping for icons
    link?: string;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const portfolioData: PortfolioConfig = {
  personal: {
    name: 'Raghav Chawla',
    role: 'Python Developer & Data Science Enthusiast',
    tagline: 'Hi, I am Raghav Chawla',
    bio: 'Crafting intelligent solutions with AI, Machine Learning, and Modern Web Tech.',
    email: 'chawlaraghav78@gmail.com',
    location: 'Chandigarh, India',
    availability: 'Available for freelance work',
  },
  social: {
    github: 'https://github.com/RCcoders',
    linkedin: 'https://www.linkedin.com/in/raghav-chawla-29255b275/',
    instagram: 'https://instagram.com/_nx.raghav._',
    twitter: 'https://twitter.com/raghavchawla',
  },
  skills: [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'AWS',
    'TensorFlow',
    'PyTorch',
  ],
  projects: [
    {
      id: 1,
      title: 'Grocery Management GUI',
      description:
        'A comprehensive desktop application for grocery store management with inventory tracking, sales processing, and customer management features.',
      tags: ['Python', 'Tkinter', 'SQLite'],
      image: 'https://via.placeholder.com/600x400?text=Grocery+App',
      iconName: 'ShoppingCart',
    },
    {
      id: 2,
      title: 'Flask Expense Tracker',
      description:
        'A web-based expense tracking application built with Flask, featuring user authentication, category management, and expense analytics.',
      tags: ['Flask', 'Python', 'SQLAlchemy'],
      image: 'https://via.placeholder.com/600x400?text=Expense+Tracker',
      iconName: 'DollarSign',
    },
    {
      id: 3,
      title: 'Customer Churn Prediction',
      description:
        'Machine learning model to predict customer churn using advanced algorithms and data analysis techniques for business intelligence.',
      tags: ['Python', 'Scikit-learn', 'Pandas'],
      image: 'https://via.placeholder.com/600x400?text=Churn+Prediction',
      iconName: 'TrendingUp',
    },
  ],
  seo: {
    title: 'Raghav Chawla - Full Stack Developer',
    description:
      'Full Stack Developer crafting digital experiences with modern technologies and creative solutions. Specializing in React, Next.js, TypeScript, and cloud technologies.',
    keywords: [
      'Full Stack Developer',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Web Development',
      'Software Engineer',
      'Raghav Chawla',
    ],
  },
};
