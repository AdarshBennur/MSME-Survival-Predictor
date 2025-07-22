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
- Docker for containerization
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
   source activate_venv.sh
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
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
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

## Screenshots

![Landing Page](MSME-Beacon/images/1.%20LandingPage.png)
![Dashboard](MSME-Beacon/images/2.%20Dashboard.png)
![Risk Prediction](MSME-Beacon/images/3.%20RiskPrediction.png)
![Recommendations](MSME-Beacon/images/4.%20Recommendations.png)
![Insights](MSME-Beacon/images/5.%20Insights.png)
