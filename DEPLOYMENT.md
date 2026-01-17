# Deploying to Render

Follow these steps to deploy Hope AI to Render:

## Prerequisites
- A GitHub account
- A Render account (sign up at https://render.com)
- Your GitHub Personal Access Token with Models scope

## Deployment Steps

### 1. Push Your Code to GitHub
Your code is already on GitHub at: `https://github.com/Hack-And-Slash13/AI-repository`

### 2. Sign Up/Login to Render
1. Go to https://render.com
2. Sign up or log in with your GitHub account

### 3. Create a New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: `Hack-And-Slash13/AI-repository`
4. Click **"Connect"**

### 4. Configure the Service

Fill in these settings:

- **Name**: `hope-ai` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Instance Type**: `Free`

### 5. Add Environment Variables

Click **"Advanced"** and add:

- **Key**: `GITHUB_TOKEN`
- **Value**: Your GitHub Personal Access Token (the one with Models scope)

### 6. Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy your app (takes 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://hope-ai.onrender.com`

### 7. Access Your App

Open your Render URL in a browser and start chatting with your AI!

## Important Notes

- **Free tier limitations**: The free instance may sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.
- **Environment variables**: Never commit `.env` file to GitHub - always set variables in Render dashboard
- **GitHub Token**: Make sure your token has the "Models" scope enabled
- **Logs**: Check logs in Render dashboard if something goes wrong

## Updating Your App

When you push changes to GitHub:
1. Render will automatically detect the changes
2. It will rebuild and redeploy automatically

## Troubleshooting

If deployment fails:
- Check the Render logs for errors
- Verify your `GITHUB_TOKEN` is set correctly
- Make sure your token has Models permission
- Check that all dependencies are in `package.json`

## Need Help?

Check Render's documentation: https://render.com/docs
