# MSME Survival Predictor

A comprehensive AI-powered platform that helps Micro, Small, and Medium Enterprises (MSMEs) assess business risk, predict survival likelihood, and receive actionable recommendations for sustainable growth.

## Project Description

MSME Survival Predictor combines advanced machine learning with an intuitive web interface to provide businesses with accurate risk assessments, personalized recommendations, and detailed insights based on their financial and operational data.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Context API for state management

### Backend
- Node.js/Express (Web application backend)
- Flask/FastAPI (ML service)
- MongoDB Atlas (Database)

### Machine Learning
- XGBoost Classifier
- Feature engineering pipeline
- Standardized data preprocessing

### DevOps
- Shell scripts for development automation

## Features

- **Risk Assessment**: Advanced AI model predicts business survival probability
- **Interactive Dashboard**: Visual representation of key business metrics
- **Detailed Insights**: Analysis of factors influencing risk predictions
- **Custom Recommendations**: Actionable advice based on risk assessment
- **Bulk Processing**: Support for CSV uploads to analyze multiple businesses
- **User Authentication**: Secure login and profile management
- **Responsive Design**: Optimized for both desktop and mobile devices

## Installation & Setup

### Prerequisites
- Node.js 14+
- Python 3.8+
- npm or yarn

### Quick Start
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/MSME-Survival-Predictor.git
   cd MSME-Survival-Predictor
   ```

2. Run the development script
   ```bash
   cd MSME-Beacon
   chmod +x run_dev.sh
   ./run_dev.sh
   ```

3. Start the ML service (optional, for real predictions)
   ```bash
   cd XGBoost-Model
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cd ml_api
   python main.py
   ```

### Manual Setup

#### Frontend
```bash
cd MSME-Beacon/frontend
npm install
npm start
```

#### Backend
```bash
cd MSME-Beacon/backend
npm install
npm start
```

#### ML Service
```bash
cd XGBoost-Model
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ml_api
python main.py
```

## Usage

1. Access the web application at http://localhost:3000
2. Navigate to the Risk Prediction page
3. Enter your business data or upload a CSV file
4. View your risk assessment, recommendations, and insights
5. Explore the dashboard for visualizations of your business metrics

## Deployment Guide for Beginners

This comprehensive guide will walk you through the process of deploying the MSME Survival Predictor to production using Render for the backend and ML model, and Vercel for the frontend.

### Step 1: Prepare Your Environment

First, make sure you have accounts set up on the following platforms:
- [GitHub](https://github.com/) - For hosting your code repository
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For database hosting
- [Render](https://render.com/) - For hosting the backend and ML model
- [Vercel](https://vercel.com/) - For hosting the frontend

### Step 2: Run the Deployment Preparation Script

This script will set up all components of the project for deployment:

```bash
# Make the script executable
chmod +x prepare_for_deployment.sh

# Run the script
./prepare_for_deployment.sh
```

The script automatically:
- Creates virtual environments
- Installs dependencies
- Generates deployment configuration files
- Sets up environment templates

### Step 3: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Cluster**:
   - Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier works for getting started)
   - Set up a database user with read/write permissions
   - Configure network access (IP whitelist) to allow connections from anywhere (0.0.0.0/0)

2. **Get Your Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials

### Step 4: Deploy the ML Model to Render (First)

Deploy the ML model first because the backend will need its URL:

1. **Push Your Code to GitHub**:
   - Make sure your project is in a GitHub repository

2. **Create a New Web Service on Render**:
   - Sign up or log in to [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure the ML Service**:
   - Name: `msme-ml-service` (or any name you prefer)
   - Root Directory: `XGBoost-Model`
   - Environment: `Python`
   - Build Command: `./render_build.sh`
   - Start Command: `./render_start.sh`
   - Select an appropriate plan (the free plan works for testing)
   - Click "Create Web Service"

4. **Note the Service URL**:
   - Once deployed, Render will provide a URL for your service (e.g., `https://msme-ml-service.onrender.com`)
   - Save this URL for the next step

### Step 5: Deploy the Backend to Render

1. **Create Another Web Service on Render**:
   - Click "New" and select "Web Service"
   - Connect to the same GitHub repository

2. **Configure the Backend Service**:
   - Name: `msme-backend` (or any name you prefer)
   - Root Directory: `MSME-Beacon/backend`
   - Environment: `Node`
   - Build Command: `./render_build.sh`
   - Start Command: `./render_start.sh`
   - Select an appropriate plan
   - Click "Advanced" to add environment variables

3. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string from Step 3
   - `JWT_SECRET`: A secure random string (e.g., generate one at [randomkeygen.com](https://randomkeygen.com/))
   - `ML_SERVICE_URL`: The URL of your ML service from Step 4
   - `NODE_ENV`: `production`
   - `PORT`: `5001` (or any port Render allows)

4. **Create the Web Service**:
   - Click "Create Web Service"
   - Note the service URL (e.g., `https://msme-backend.onrender.com`)

### Step 6: Deploy the Frontend to Vercel

1. **Push Your Code to GitHub**:
   - Make sure your project is in a GitHub repository

2. **Import Your Project to Vercel**:
   - Sign up or log in to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your project

3. **Configure the Frontend Deployment**:
   - Framework Preset: `Create React App`
   - Root Directory: `MSME-Beacon/frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Click "Environment Variables" to add variables

4. **Add Environment Variables**:
   - `REACT_APP_API_URL`: The URL of your backend API from Step 5, followed by `/api` (e.g., `https://msme-backend.onrender.com/api`)

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Once complete, Vercel will provide a URL for your frontend (e.g., `https://msme-survival-predictor.vercel.app`)

### Step 7: Update Cross-Origin Settings

1. **Update Backend CORS Settings**:
   - Go to your Render dashboard
   - Select your backend service
   - Add a new environment variable:
   - `FRONTEND_URL`: The URL of your frontend from Step 6
   - Click "Save Changes" and wait for the service to redeploy

### Step 8: Test Your Deployment

1. **Access Your Frontend**:
   - Open the frontend URL provided by Vercel
   - Sign up for an account or log in
   - Navigate to the Risk Prediction page
   - Enter business data and test the prediction functionality

2. **Troubleshooting**:
   - If you encounter issues, check the logs in your Render and Vercel dashboards
   - Verify that all environment variables are set correctly
   - Ensure your MongoDB Atlas cluster is accessible

### Step 9: Set Up Custom Domain (Optional)

For a more professional look, you can set up custom domains for your services:

1. **Vercel Custom Domain**:
   - In your Vercel project settings, go to "Domains"
   - Add your custom domain and follow the verification steps

2. **Render Custom Domain**:
   - In your Render service settings, go to "Custom Domains"
   - Add your custom domain and follow the verification steps

3. **Update Environment Variables**:
   - If using custom domains, update the `FRONTEND_URL` and `ML_SERVICE_URL` environment variables accordingly

## Maintenance and Updates

### Updating Your Deployment

1. **Push Changes to GitHub**:
   - Make your code changes locally
   - Commit and push to GitHub

2. **Automatic Deployment**:
   - Both Render and Vercel will automatically detect changes and redeploy your services

### Monitoring

1. **Render Dashboard**:
   - Monitor your backend and ML service performance
   - Check logs for any errors

2. **Vercel Dashboard**:
   - Monitor your frontend performance
   - Check deployment status and analytics

3. **MongoDB Atlas Dashboard**:
   - Monitor database performance and storage usage

## Troubleshooting Common Issues

### Connection Issues
- Verify that all environment variables are set correctly
- Check CORS settings in the backend
- Ensure MongoDB Atlas IP whitelist includes your service IPs

### Performance Issues
- Consider upgrading your Render plan for better performance
- Optimize database queries and indexes
- Implement caching strategies

### Database Issues
- Check MongoDB Atlas logs for connection errors
- Verify database user permissions
- Ensure your database is not reaching storage limits

## Security Considerations

- Regularly update your JWT_SECRET
- Implement rate limiting for API endpoints
- Set up MongoDB Atlas backups
- Enable HTTPS for all services
- Regularly update dependencies to patch security vulnerabilities

## Screenshots

![Landing Page](MSME-Beacon/images/1.%20LandingPage.png)
![Dashboard](MSME-Beacon/images/2.%20Dashboard.png)
![Risk Prediction](MSME-Beacon/images/3.%20RiskPrediction.png)
![Recommendations](MSME-Beacon/images/4.%20Recommendations.png)
![Insights](MSME-Beacon/images/5.%20Insights.png)

---

For additional support or questions, please open an issue on the GitHub repository.
