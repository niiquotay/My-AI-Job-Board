import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserProfile, Message, Application, AptitudeQuestion } from "../types";

export const analyzeMatch = async (user: UserProfile, job: Job): Promise<{ 
  score: number; 
  reason: string;
  details: { technical: number; culture: number; experience: number }
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze match between user and job.
    User Profile: ${JSON.stringify(user)}
    Job: ${job.title} - ${job.description} at ${job.city}, ${job.country}. Eligible countries: ${job.allowedCountries.join(', ')}.
    Return JSON with score (0-100), one-sentence reason, and 0-100 scores for technical, culture, experience.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          details: {
            type: Type.OBJECT,
            properties: {
              technical: { type: Type.NUMBER },
              culture: { type: Type.NUMBER },
              experience: { type: Type.NUMBER }
            },
            required: ["technical", "culture", "experience"]
          }
        },
        required: ["score", "reason", "details"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateAptitudeTest = async (job: Job, numQuestions: number): Promise<AptitudeQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a Psychometric Assessment Specialist at Yale and Cambridge University.
  Generate ${numQuestions} scenario-based aptitude questions for the role of "${job.title}" at "${job.company}".
  
  JOB CONTEXT:
  ${job.description}
  ${job.responsibilities}
  
  GUIDELINES:
  - Style: High-stakes academic rigour (Yale/Cambridge style).
  - Structure: Each question must start with a complex workplace scenario relevant to the role.
  - Options: Exactly 4 plausible options for each.
  - Evaluation: Focus on strategic reasoning, problem-solving, and professional judgement.
  
  Return a JSON array of AptitudeQuestion objects:
  {
    "id": "string",
    "scenario": "string (the question text)",
    "options": ["string", "string", "string", "string"],
    "correctIndex": number (0-3)
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                scenario: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER }
              },
              required: ["id", "scenario", "options", "correctIndex"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{"questions": []}');
  return parsed.questions;
};

export const editProfileImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType,
          },
        },
        {
          text: `You are a professional corporate photographer and editor. Refine this profile picture to look more professional based on this request: "${prompt}". Ensure the resulting image is sharp, well-lit, and suitable for a high-level executive profile on LinkedIn or AI-JobConnect. Maintain the subject's identity but enhance the attire, background, or lighting as requested.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate edited image part.");
};

export const getEmployerInsights = async (jobs: Job[], applications: Application[]): Promise<{
  marketPosition: string;
  candidateQuality: string;
  actionItems: string[];
  rolePerformance: Array<{ jobTitle: string; status: string }>;
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataContext = JSON.stringify({
    activeJobs: jobs.map(j => ({ title: j.title, salary: j.salary, location: j.city })),
    applicationVolume: applications.length,
    statuses: applications.map(a => a.status)
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an elite Recruitment Strategy Consultant. Analyze the following hiring data for an employer and provide high-level management insights.
    Data: ${dataContext}
    
    Return JSON with:
    - marketPosition: 1-sentence assessment of how competitive their roles/salaries are.
    - candidateQuality: 1-sentence assessment of the current talent pipeline.
    - actionItems: 3 specific, punchy strategic recommendations.
    - rolePerformance: An array of objects, each containing "jobTitle" and a "status" (a 3-word performance status like "Critical - Underpaid" or "High Demand - Stable").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          marketPosition: { type: Type.STRING },
          candidateQuality: { type: Type.STRING },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          rolePerformance: { 
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                jobTitle: { type: Type.STRING },
                status: { type: Type.STRING }
              },
              required: ["jobTitle", "status"]
            }
          }
        },
        required: ["marketPosition", "candidateQuality", "actionItems", "rolePerformance"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateJobSection = async (
  section: 'definition' | 'responsibilities' | 'requirements' | 'full_rewrite',
  jobTitle: string,
  companyName: string,
  existingContent?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  if (section === 'definition') {
    prompt = `Generate a high-stakes executive summary for a "${jobTitle}" role at "${companyName}". 
    Focus on the role's strategic mission, organizational impact, and primary objectives. 
    Tone: Sophisticated, authoritative, and compelling. Keep it to 2-3 impactful sentences.`;
  } else if (section === 'responsibilities') {
    prompt = `Generate a detailed list of 5-8 primary roles, responsibilities, and day-to-day duties for a "${jobTitle}" role at "${companyName}". Use professional action verbs.`;
  } else if (section === 'requirements') {
    prompt = `Generate a comprehensive list of candidate prerequisites (education, years of experience, technical skills, and certifications) for a "${jobTitle}" role at "${companyName}".`;
  } else {
    prompt = `Professionally rewrite and optimize the following job posting for high conversion. Title: "${jobTitle}" at "${companyName}". Existing content: "${existingContent}". Ensure the tone is elite, modern, and compelling.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "AI generation failed. Please try again.";
};

export const generateProfessionalDraft = async (
  category: string, 
  platform: string, 
  context: string, 
  user: UserProfile, 
  job?: Job
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are a world-class professional communications expert.
    Task: Draft a high-impact ${category} for ${platform}.
    User Context: ${user.name}, a ${user.role}.
    Specific Request Details: ${context}
    ${job ? `Target Job Context: ${job.title} at ${job.company}.` : ''}
    
    Guidelines:
    - Tone: Professional, confident, and persuasive.
    - Format: Ready to send. If it's a WhatsApp/Text, keep it brief. If it's a Resignation or Offer Letter, follow formal standards.
    - Include placeholders like [Date] or [Recipient Name] where appropriate.
    - Focus on the user's value proposition.
    
    Return ONLY the text of the draft.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "Drafting failed. Please try again.";
};

export const generateInterviewQuestions = async (job: Job, user: UserProfile): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 high-stakes behavioral interview questions for a ${job.title} role at ${job.company}. 
    Candidate profile: ${user.experienceSummary} experience with skills: ${user.skills.join(', ')}.
    Return as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const analyzeInterviewResponse = async (question: string, transcript: string, activeProtocols: string[] = []): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an AI Interview Coach. Analyze this candidate's interview response.
    Question: ${question}
    Transcript: ${transcript}
    
    CRITICAL EVALUATION FOCUS:
    ${activeProtocols.includes('Behavioral Analysis') ? '- Deep Behavioral Analysis: Evaluate confidence, professional sentiment, and leadership presence.' : ''}
    ${activeProtocols.includes('STAR Grading') ? '- STAR Method Rigor: Strictly grade alignment with Situation, Task, Action, and Result structure.' : ''}
    ${activeProtocols.length === 0 ? '- General technical and professional competence.' : ''}
    
    Provide a JSON object with: 
    - confidenceScore (0-100)
    - contentScore (0-100)
    - feedback (A detailed 2-sentence summary)
    - strengths (array of 3 strings)
    - improvements (array of 3 strings)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          confidenceScore: { type: Type.NUMBER },
          contentScore: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["confidenceScore", "contentScore", "feedback", "strengths", "improvements"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const enhanceProfileSection = async (sectionName: string, content: string, user: UserProfile): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an elite executive career consultant. Professionally rewrite the following "${sectionName}" to sound high-impact, achievement-oriented, and compelling. 
    Current Content: "${content}"
    User Role: ${user.role}
    
    CRITICAL GUIDELINES:
    - Tone: Authoritative, professional, and sophisticated.
    - Focus: Quantifiable results, elite leadership qualities, and strategic execution.
    - Style: Use powerful action verbs (e.g., Orchestrated, Spearheaded, Revolutionized).
    - Transformation: Turn standard tasks into high-stakes achievements.
    
    Return ONLY the professionally rewritten text.`,
  });
  return response.text || "";
};

export const generateTailoredResume = async (user: UserProfile, job?: Job): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const jobContext = job ? `Tailor this resume specifically for the ${job.title} position at ${job.company}. Description: ${job.description}` : "Create a high-impact professional resume.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a full professional resume in Markdown format for the following user. 
    User Profile: ${JSON.stringify(user)}
    ${jobContext}
    Focus on quantifiable achievements, strong action verbs, and optimal formatting for ATS systems.`,
  });
  return response.text || "";
};

export const parseResume = async (input: { text?: string, base64?: string, mimeType?: string }): Promise<Partial<UserProfile>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `EXHAUSTIVE EXTRACTION PROTOCOL: EXTRACT EVERY SINGLE DETAIL FROM THIS RESUME. ZERO DATA LOSS.
    
    CRITICAL INSTRUCTIONS FOR WORK HISTORY:
    1. EXHAUSTIVE VERBATIM MANIFEST: For each role, you MUST extract and include EVERY SINGLE job function, responsibility, duty, and achievement mentioned in the original CV.
    2. ABSOLUTE NO-TRUNCATION POLICY: Do NOT summarize bullet points. Do NOT capture only the first few lines. Capture the ENTIRE depth of the role as described in the source text.
    3. DETAILED SYNTHESIS: Convert the original list into a detailed, high-impact professional narrative in the 'description' field that remains 100% faithful to the source's content density.
    
    TOTAL EXTRACTION REQUIREMENTS:
    - Extract ALL Education history (Degrees, Schools, Years).
    - Extract ALL Certifications, Licenses, and Credentials (ensure names are verbatim).
    - Extract ALL Projects (Names, exhaustive Descriptions, Years).
    - Extract ALL Technical, Digital, and Soft Skills.
    - Extract Personal Website or Portfolio URLs.
    - Capture Phone numbers, Email, and Location (City/Country).
    
    Return a JSON object exactly matching this schema:
    {
      "name": "Full name string",
      "email": "Primary email string",
      "phone": "Contact number string",
      "city": "City string",
      "country": "Country string",
      "role": "Target/Current Title string",
      "linkedinUrl": "LinkedIn profile URL string",
      "portfolioUrl": "Personal website or portfolio URL string",
      "skills": ["Array of core soft/strategic skills"],
      "digitalSkills": ["Array of software, tools, and technical stacks"],
      "certifications": ["Array of strings for all professional certifications/licenses"],
      "experienceSummary": "e.g., '15+ years'",
      "bio": "A detailed 2-sentence executive value proposition",
      "workHistory": [
        {
          "role": "string",
          "company": "string",
          "period": "string",
          "description": "EXHAUSTIVE VERBATIM MANIFEST OF ALL FUNCTIONS AND ACHIEVEMENTS. NO TRUNCATION."
        }
      ],
      "education": [
        {
          "degree": "string",
          "school": "string",
          "year": "string"
        }
      ],
      "projects": [
        {
          "name": "string",
          "description": "Full detailed description of impact and deliverables",
          "year": "string"
        }
      ],
      "hobbies": ["Array of personal interests"]
    }`;

  const parts: any[] = [];
  if (input.base64 && input.mimeType) {
    parts.push({
      inlineData: {
        data: input.base64,
        mimeType: input.mimeType
      }
    });
  }
  if (input.text) {
    parts.push({ text: input.text });
  } else if (!input.base64) {
    parts.push({ text: "No data provided." });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const parseJobDescription = async (input: { text?: string, base64?: string, mimeType?: string }): Promise<Partial<Job>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `EXHAUSTIVE EXTRACTION PROTOCOL: EXTRACT EVERY SINGLE DETAIL FROM THIS JOB DESCRIPTION.
    
    Return a JSON object matching this schema:
    {
      "title": "Job title string",
      "category": "Formal Jobs | Skilled Labour | Growth & Start Up",
      "location": "Remote | Onsite | Hybrid",
      "city": "City string",
      "country": "Country string",
      "responsibilities": "Detailed responsibilities string",
      "requirements": "Detailed requirements string",
      "jobRank": "Senior Management | Middle Level | Entry Level | Intern | Executive",
      "employmentType": "Full-time | Part-time | Contract | Internship | Volunteering"
    }`;

  const parts: any[] = [];
  if (input.base64 && input.mimeType) {
    parts.push({ inlineData: { data: input.base64, mimeType: input.mimeType } });
  }
  if (input.text) {
    parts.push({ text: input.text });
  }
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json"
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const getCareerAdvice = async (history: Message[], user: UserProfile, currentJob?: Job) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an elite Career Coach at AI-JobConnect. 
      The user is ${user.name}, a ${user.role} living in ${user.city}, ${user.country}. 
      They have skills: ${user.skills.join(', ')}.
      Current context: They are looking at a ${currentJob?.title || 'general job list'}.
      Provide punchy, actionable, and encouraging advice. Keep responses under 60 words.`,
    },
  });

  const lastMessage = history[history.length - 1].text;
  return await chat.sendMessageStream({ message: lastMessage });
};

export const generateJobDescription = async (title: string, company: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a compelling, modern 150-word job description for a "${title}" position at "${company}".`,
  });
  return response.text || "Job description generation failed.";
};