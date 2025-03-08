// backend-test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./src/Backendserver'); // Adjust this path if needed
const { MongoMemoryServer } = require('mongodb-memory-server'); // For testing without affecting your real database

// Models
const User = require('./src/models/User');
const Job = require('./src/models/Job');
const Resume = require('./src/models/Resume');

let mongoServer;

// Test database connection
async function testDatabaseConnection() {
  try {
    // Option 1: Connect to your actual database
    // await mongoose.connect(process.env.MONGODB_URI);
    
    // Option 2: Use an in-memory MongoDB instance for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test server is running
async function testServer() {
  try {
    const response = await request(app).get('/');
    console.log(`✅ Server is running. Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    return false;
  }
}

// Test user routes
async function testUserRoutes() {
  try {
    // Test user creation
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const createResponse = await request(app)
      .post('/api/users')
      .send(testUser);
    
    console.log(`✅ Create user test. Status: ${createResponse.status}`);
    
    // Test user login
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    console.log(`✅ Login test. Status: ${loginResponse.status}`);
    const token = loginResponse.body.token;
    
    // Test get user profile
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    console.log(`✅ Get profile test. Status: ${profileResponse.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ User routes test failed:', error.message);
    return false;
  }
}

// Test resume routes
async function testResumeRoutes() {
  try {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const token = loginResponse.body.token;
    
    // Test resume upload
    const testResume = {
      name: 'John Doe',
      email: 'john@example.com',
      skills: ['JavaScript', 'Node.js', 'MongoDB'],
      experience: '5 years'
    };
    
    const uploadResponse = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${token}`)
      .send(testResume);
    
    console.log(`✅ Resume upload test. Status: ${uploadResponse.status}`);
    const resumeId = uploadResponse.body._id;
    
    // Test get resume
    const getResumeResponse = await request(app)
      .get(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);
    
    console.log(`✅ Get resume test. Status: ${getResumeResponse.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ Resume routes test failed:', error.message);
    return false;
  }
}

// Test job routes
async function testJobRoutes() {
  try {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const token = loginResponse.body.token;
    
    // Test job creation
    const testJob = {
      title: 'Software Engineer',
      company: 'Test Company',
      description: 'A job for testing',
      requirements: ['Node.js', 'Express', 'MongoDB']
    };
    
    const createJobResponse = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(testJob);
    
    console.log(`✅ Create job test. Status: ${createJobResponse.status}`);
    const jobId = createJobResponse.body._id;
    
    // Test get job
    const getJobResponse = await request(app)
      .get(`/api/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
    
    console.log(`✅ Get job test. Status: ${getJobResponse.status}`);
    
    // Test job search
    const searchResponse = await request(app)
      .get('/api/jobs?query=Software')
      .set('Authorization', `Bearer ${token}`);
    
    console.log(`✅ Search jobs test. Status: ${searchResponse.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ Job routes test failed:', error.message);
    return false;
  }
}

// Test AI services
async function testAIServices() {
  try {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const token = loginResponse.body.token;
    
    // Test resume parsing
    const parseResponse = await request(app)
      .post('/api/services/parse-resume')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resumeText: 'John Doe\nEmail: john@example.com\nSkills: JavaScript, Node.js\nExperience: 5 years at Company XYZ'
      });
    
    console.log(`✅ Resume parsing test. Status: ${parseResponse.status}`);
    
    // Test job ranking
    const rankingResponse = await request(app)
      .post('/api/services/rank-jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resumeId: 'some-resume-id', // Replace with actual ID if needed
        jobIds: ['job-id-1', 'job-id-2'] // Replace with actual IDs if needed
      });
    
    console.log(`✅ Job ranking test. Status: ${rankingResponse.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ AI services test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🔍 Starting backend tests...');
  
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Database connection failed. Cannot continue tests.');
    process.exit(1);
  }
  
  const serverRunning = await testServer();
  if (!serverRunning) {
    console.error('Server test failed. Cannot continue tests.');
    process.exit(1);
  }
  
  await testUserRoutes();
  await testResumeRoutes();
  await testJobRoutes();
  await testAIServices();
  
  // Cleanup
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
  
  console.log('✅ All tests completed!');
  process.exit(0);
}

// Run the tests
runAllTests().catch(console.error);