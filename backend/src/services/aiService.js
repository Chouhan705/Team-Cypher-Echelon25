const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const analyzeResumeWithGemini = async (resumeText, jobDetails) => {
  try {
    const prompt = `
      I need to analyze how well a candidate's resume matches a job description.
      
      JOB DETAILS:
      Title: ${jobDetails.title}
      Description: ${jobDetails.description}
      Required Skills: ${jobDetails.requiredSkills.join(', ')}
      Preferred Skills: ${jobDetails.preferredSkills.join(', ')}
      Required Experience: ${jobDetails.experience} years
      Required Education: ${jobDetails.education}
      
      RESUME TEXT:
      ${resumeText}
      
      Please analyze and return a JSON object with the following:
      1. "score": A number from 0-100 representing overall match
      2. "category": One of ["must-interview", "can-interview", "maybe-interview", "reject"]
      3. "matchDetails": An object with:
         - "skillsMatch": Object with "matched" and "missing" skills arrays
         - "experienceMatch": Boolean indicating if experience requirement is met
         - "educationMatch": Boolean indicating if education requirement is met
         - "analysis": Brief text analysis of strengths and weaknesses
      
      Return ONLY the JSON object with no additional text.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      }
    );

    // Extract the response text
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the response
    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Could not parse JSON from Gemini response');
    }
    
    const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
    const result = JSON.parse(jsonString);
    
    return result;
  } catch (error) {
    console.error('Error with Gemini API:', error);
    // Fallback response if the API fails
    return {
      score: 50,
      category: 'maybe-interview',
      matchDetails: {
        skillsMatch: {
          matched: [],
          missing: []
        },
        experienceMatch: false,
        educationMatch: false,
        analysis: 'Error analyzing resume. Please review manually.'
      }
    };
  }
};

module.exports = analyzeResumeWithGemini;