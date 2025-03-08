from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()  # Load environment variables from .env file
app = Flask(__name__)

# Enable CORS (very basic - for development ONLY)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

@app.route('/')
def hello_world():
    return "Python Backend is Running!"


# *** GEMINI API INTEGRATION ***
def extract_resume_data(resume_text, api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-pro-latest')  # Or 'gemini-pro'

    prompt = f"""You are an expert resume parser. Extract the following information from the resume text provided below.
    If a skill or skill level is not explicitly mentioned, fill it with null. Provide extracted skills in the skill level array.
    Extract ALL skills and soft skills found in the resume.
    Format your response as a JSON object.

    Resume Text:
    {resume_text}

    Extract:
    {{
      "name": "Full Name",
      "skills": [
        {{ "skill": "Skill 1", "level": "Skill Level (e.g., Beginner, Intermediate, Advanced, Expert, null)" }}
      ],
      "softSkills": [
        {{ "skill": "Soft Skill 1", "level": "Skill Level (e.g., Beginner, Intermediate, Advanced, Expert, null)" }}
      ],
      "experience": "Summary of Experience",
      "qualifications": "List of Qualifications"
    }}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text
        print(text)
        try:
            import json
            json_data = json.loads(text)
            return json_data
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"Raw response from Gemini: {text}")
            return {"error": f"Failed to parse JSON: {str(e)}. Check console for raw response."}
    except Exception as e:
        print(f"Gemini API error: {e}")
        return {"error": f"Gemini API error: {str(e)}"}


def generate_standard_employee(position, api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-pro-latest')  # Or 'gemini-pro'

    prompt = f"""You are an expert in human resources and talent acquisition. Based on your extensive knowledge of current market trends, industry reports, and skill graphs, create a standard employee profile for the position of {position}.

    Include the following:
    *   A comprehensive list of basic and adequate required skills with skill levels (Beginner, Intermediate, Advanced, Expert).  Provide specific technologies and tools.
    *   A list of essential soft skills with skill levels.
    *   A detailed summary of the typical required experience, including years of experience and types of projects.
    *   A list of essential qualifications, including degrees, certifications, and other relevant credentials.

    Format your response as a JSON object:
    {{
      "position": "{position}",
      "requiredSkills": [
        {{ "skill": "Skill 1", "level": "Skill Level" }}
      ],
      "requiredSoftSkills": [
        {{ "skill": "Soft Skill 1", "level": "Skill Level" }}
      ],
      "requiredExperience": "Summary of Required Experience",
      "requiredQualifications": "List of Required Qualifications"
    }}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text
        try:
            import json
            json_data = json.loads(text)
            return json_data
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"Raw response from Gemini: {text}")
            return {"error": f"Failed to parse JSON: {str(e)}. Check console for raw response."}
    except Exception as e:
        print(f"Gemini API error: {e}")
        return {"error": f"Gemini API error: {str(e)}"}


def rank_resume(resume_data, standard_profile):
    match_score = 0

    # Skill Matching
    if resume_data and 'skills' in resume_data and standard_profile and 'requiredSkills' in standard_profile:
        for resume_skill in resume_data['skills']:
            for required_skill in standard_profile['requiredSkills']:
                if 'skill' in resume_skill and 'skill' in required_skill and \
                   resume_skill['skill'].lower() == required_skill['skill'].lower():
                    match_score += 1

    # Experience Matching (Simplified)
    if resume_data and 'experience' in resume_data and standard_profile and 'requiredExperience' in standard_profile:
        if standard_profile['requiredExperience'].lower() in resume_data['experience'].lower():
            match_score += 2

    # Define Ranking Categories
    ranking = "Not a Fit"
    if match_score >= 5:
        ranking = "Top Talent"
    elif match_score >= 3:
        ranking = "Good Fit"
    elif match_score >= 1:
        ranking = "Potential Fit"

    return {"ranking": ranking, "matchScore": match_score}


# *** API Endpoints ***
@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    api_key = os.getenv("GEMINI_API_KEY")
    resume_text = request.json.get('resumeText')

    if not resume_text:
        return jsonify({"error": "Resume text is required."}), 400

    try:
        resume_data = extract_resume_data(resume_text, api_key)
        if "error" in resume_data:
            return jsonify({"error": resume_data["error"]}), 500
        return jsonify(resume_data), 200
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return jsonify({"error": "Failed to parse resume."}), 500


@app.route('/api/generate-standard-profile', methods=['POST'])
def generate_standard_profile_route():
    api_key = os.getenv("GEMINI_API_KEY")
    position = request.json.get('position')

    if not position:
        return jsonify({"error": "Position is required."}), 400

    try:
        standard_profile = generate_standard_employee(position, api_key)
        if "error" in standard_profile:
            return jsonify({"error": standard_profile["error"]}), 500
        return jsonify(standard_profile), 200
    except Exception as e:
        print(f"Error generating standard profile: {e}")
        return jsonify({"error": "Failed to generate standard profile."}), 500


@app.route('/api/rank-resume', methods=['POST'])
def rank_resume_route():
    resume_data = request.json.get('resumeData')
    standard_profile = request.json.get('standardProfile')

    if not resume_data or not standard_profile:
        return jsonify({"error": "Resume data and standard profile are required."}), 400

    try:
        ranking_result = rank_resume(resume_data, standard_profile)
        return jsonify(ranking_result), 200
    except Exception as e:
        print(f"Error ranking resume: {e}")
        return jsonify({"error": "Failed to rank resume."}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8000)