const ExcelJS = require('exceljs');

/**
 * Generate Excel file with ranked candidates
 * @param {Object} job - Job document
 * @param {Array} resumes - Resume documents
 * @returns {Promise<Buffer>} Excel file as buffer
 */
const generateExcel = async (job, resumes) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Candidates');
  
  // Add job info at the top
  worksheet.addRow(['Job Title:', job.title]);
  worksheet.addRow(['Company:', job.company]);
  worksheet.addRow(['Required Skills:', job.requiredSkills.join(', ')]);
  worksheet.addRow(['Experience Required:', `${job.experience} years`]);
  worksheet.addRow(['']);
  
  // Set up headers
  worksheet.addRow([
    'Candidate Name',
    'Email',
    'AI Score',
    'AI Category',
    'Recruiter Category',
    'Skills Match',
    'Experience',
    'Education',
    'Notes'
  ]);
  
  // Style headers
  worksheet.getRow(6).font = { bold: true };
  worksheet.getRow(6).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Add data
  resumes.forEach(resume => {
    const skillsMatch = resume.aiRanking.matchDetails.skillsMatch 
      ? `${resume.aiRanking.matchDetails.skillsMatch.matched.length}/${resume.aiRanking.matchDetails.skillsMatch.matched.length + resume.aiRanking.matchDetails.skillsMatch.missing.length}`
      : 'N/A';
      
    worksheet.addRow([
      resume.candidateName,
      resume.candidateEmail,
      resume.aiRanking.score,
      resume.aiRanking.category,
      resume.recruiterRanking.category || 'Not Ranked',
      skillsMatch,
      resume.experience,
      resume.education,
      resume.recruiterRanking.notes || ''
    ]);
  });
  
  // Create "Final Selection" worksheet
  const finalWorksheet = workbook.addWorksheet('Final Selection');
  
  // Add headers
  finalWorksheet.addRow([
    'Candidate Name',
    'Email',
    'Category',
    'Score',
    'Skills Match',
    'Notes'
  ]);
  
  // Style headers
  finalWorksheet.getRow(1).font = { bold: true };
  finalWorksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Add "Must Interview" section
  finalWorksheet.addRow(['MUST INTERVIEW CANDIDATES']);
  finalWorksheet.getRow(finalWorksheet.rowCount).font = { bold: true, color: { argb: '00008B' } };
  
  // Add must-interview candidates
  const mustInterview = resumes.filter(resume => 
    resume.recruiterRanking.category === 'must-interview' || 
    (resume.aiRanking.category === 'must-interview' && !resume.recruiterRanking.category)
  );
  
  mustInterview.forEach(resume => {
    finalWorksheet.addRow([
      resume.candidateName,
      resume.candidateEmail,
      resume.recruiterRanking.category || resume.aiRanking.category,
      resume.aiRanking.score,
      resume.skills.join(', '),
      resume.recruiterRanking.notes || ''
    ]);
  });
  
  // Add "Can Interview" section
  finalWorksheet.addRow(['']);
  finalWorksheet.addRow(['CAN INTERVIEW CANDIDATES']);
  finalWorksheet.getRow(finalWorksheet.rowCount).font = { bold: true, color: { argb: '006400' } };
  
  // Add can-interview candidates
  const canInterview = resumes.filter(resume => 
    resume.recruiterRanking.category === 'can-interview' || 
    (resume.aiRanking.category === 'can-interview' && !resume.recruiterRanking.category)
  );
  
  canInterview.forEach(resume => {
    finalWorksheet.addRow([
      resume.candidateName,
      resume.candidateEmail,
      resume.recruiterRanking.category || resume.aiRanking.category,
      resume.aiRanking.score,
      resume.skills.join(', '),
      resume.recruiterRanking.notes || ''
    ]);
  });
  
  // Format columns to be a reasonable width
  worksheet.columns.forEach(column => {
    column.width = 20;
  });
  
  finalWorksheet.columns.forEach(column => {
    column.width = 20;
  });
  
  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

module.exports = { generateExcel };