const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

/**
 * Parse resume from file
 * @param {string} filePath - Path to the resume file
 * @param {string} fileType - File type (pdf or docx)
 * @returns {Promise<string>} Parsed text content
 */
const parseResume = async (filePath, fileType) => {
  try {
    let text = '';
    
    if (fileType === 'pdf') {
      // Parse PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (fileType === 'docx') {
      // Parse DOCX
      const result = await mammoth.extractRawText({
        path: filePath
      });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Clean the text
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\n+/g, '\n');
    text = text.trim();
    
    return text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

module.exports = parseResume;