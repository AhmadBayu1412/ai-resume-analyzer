/**
 * Represents a job opening or opportunity.
 */
interface Job {
  /** The professional title of the role. */
  title: string;
  /** Detailed information about job responsibilities and requirements. */
  description: string;
  /** The geographical location or work setup (e.g., Remote, On-site). */
  location: string;
  /** List of essential technical or soft skills required for the role. */
  requiredSkills: string[];
}

/**
 * Represents a user's uploaded resume and its associated analysis data.
 */
interface Resume {
  /** Unique identifier for the resume entry. */
  id: string;
  /** The name of the company the resume is targeted towards. */
  companyName?: string;
  /** The specific job title the resume is tailored for. */
  jobTitle?: string;
  /** Path to the visual thumbnail/screenshot of the resume. */
  imagePath: string;
  /** Path to the source PDF file. */
  resumePath: string;
  /** Detailed AI-generated feedback results. */
  feedback: Feedback;
}

/**
 * Encapsulates the evaluation metrics and actionable insights for a resume.
 */
interface Feedback {
  /** Cumulative score of the resume (0-100). */
  overallScore: number;
  /** Assessment of the resume's compatibility with Applicant Tracking Systems. */
  ATS: {
    score: number;
    tips: {
      /** Category of feedback: 'good' for positive points, 'improve' for areas to change. */
      type: "good" | "improve";
      /** Short summary of the ATS finding. */
      tip: string;
    }[];
  };
  /** Evaluation of the writing style, professional tone, and readability. */
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      /** Detailed explanation/reasoning behind the suggestion. */
      explanation: string;
    }[];
  };
  /** Quality analysis of the professional experience and bullet points. */
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  /** Evaluation of the document hierarchy, logical flow, and formatting. */
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  /** Analysis of skill keywords, relevance, and industry standard alignment. */
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}
