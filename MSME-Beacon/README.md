# MSME Risk Prediction System

A comprehensive full-stack web application for micro, small, and medium enterprises (MSMEs) to assess business risk using machine learning.

## Features

- **Risk Prediction**: Trained XGBoost model to predict business risk levels based on key business metrics
- **Multiple Input Methods**: Support for both manual input and bulk CSV file processing
- **Interactive Dashboard**: Visual representation of risk metrics and trends
- **Detailed Insights**: Analysis of factors influencing risk predictions
- **Custom Recommendations**: Personalized suggestions based on risk assessment

## Architecture

The application consists of:

- **Frontend**: React-based SPA with Tailwind CSS for UI components
- **Backend**: Flask REST API that handles prediction requests and serves data
- **ML Model**: XGBoost model trained on MSME business data

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## Setup Instructions

### Clone the repository

```bash
git clone <repository-url>
cd msme-risk-prediction
```

### Run the development environment

The easiest way to start the application is to use the included development script:

```bash
chmod +x run_dev.sh  # Make the script executable
./run_dev.sh         # Run the development script
```

This script will:
1. Create a Python virtual environment if needed
2. Install backend dependencies
3. Install frontend dependencies
4. Start both the backend and frontend servers

### Manual Setup

If you prefer to set up the environment manually:

#### Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Run the Flask server
python app.py
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Usage

Once both servers are running:

1. Access the web interface at http://localhost:3000
2. Navigate to the Risk Prediction page
3. Choose between manual input or CSV upload
4. View and analyze the risk prediction results

### Manual Input

Enter your business metrics in the provided form:
- Monthly sales
- Stock value
- Number of customers
- Monthly expenses
- Monthly profit
- Number of employees
- Average transaction value
- Return rate
- Marketing spend

### CSV Upload

Prepare a CSV file with the following columns:
- monthly_sales
- stock_value
- num_customers
- monthly_expenses
- monthly_profit
- num_employees
- avg_transaction_value
- return_rate
- marketing_spend

Upload the CSV file on the Risk Prediction page to get bulk predictions.

## API Endpoints

The backend provides the following API endpoints:

- `POST /predict-manual`: Process manual input data and return risk prediction
- `POST /predict-bulk`: Process CSV file data and return multiple risk predictions
- `GET /recommendations`: Get recommendations based on risk factors
- `GET /insights`: Get detailed analysis of business data and risk factors
- `GET /dashboard-data`: Get overview statistics for the dashboard
- `GET /help-support`: Get FAQ and guidance information

## Project Structure

```
msme-risk-prediction/
├── backend/               # Flask backend API
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── xgboost_model.json # Trained ML model
├── frontend/              # React frontend application
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main application component
│   └── package.json       # Node.js dependencies
└── run_dev.sh             # Development startup script
```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- XGBoost for the machine learning library
- React for the frontend framework
- Flask for the backend API
- Tailwind CSS for the styling 