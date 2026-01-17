const axios = require('axios');
require('dotenv').config();

async function testGitHubModels() {
    try {
        console.log('='.repeat(50));
        console.log('Testing GitHub Models API...');
        console.log('Token present:', process.env.GITHUB_TOKEN ? 'YES' : 'NO');
        console.log('Token starts with:', process.env.GITHUB_TOKEN?.substring(0, 20) + '...');
        console.log('='.repeat(50));
        
        const response = await axios.post(
            'https://models.inference.ai.azure.com/chat/completions',
            {
                messages: [
                    { role: 'user', content: 'Say hi' }
                ],
                model: 'gpt-4o-mini',
                max_tokens: 10
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        console.log('\n✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('\n❌ ERROR OCCURRED:');
        console.log('Status Code:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
        console.log('Error Message:', error.message);
        console.log('\n');
        
        if (error.response?.status === 401) {
            console.log('🔴 DIAGNOSIS: Invalid token or insufficient permissions');
            console.log('Make sure your token has the "Models" scope enabled');
        } else if (error.response?.status === 404) {
            console.log('🔴 DIAGNOSIS: GitHub Models endpoint not found');
            console.log('You might not have access to GitHub Models yet');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('🔴 DIAGNOSIS: Cannot connect to API');
        }
    }
}

testGitHubModels();
