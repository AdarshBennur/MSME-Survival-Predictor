# MSME Survival Prediction - Machine Learning Pipeline

This project implements a comprehensive Machine Learning pipeline to predict MSME (Micro, Small, and Medium Enterprises) business survival using XGBoost classifier.

## 🎯 Objective

Predict whether an MSME business will survive or fail based on historical loan data, helping financial institutions and stakeholders make informed decisions.

## 📊 Dataset

The pipeline uses the LendingClub loan dataset (`accepted_2007_to_2018Q4.csv`) which contains detailed information about approved loans including:

- **Loan Information**: Amount, interest rate, term, grade
- **Borrower Profile**: Annual income, employment length, credit score (FICO)
- **Financial Metrics**: Debt-to-income ratio, revolving balance, credit utilization
- **Loan Outcome**: Current status (Fully Paid, Charged Off, Current, etc.)

## 🔍 Features

### 1. **Exploratory Data Analysis (EDA)**
- Dataset overview and memory usage analysis
- Missing values analysis and visualization
- Basic statistical summaries
- Loan status distribution visualization
- Correlation heatmap for numerical features

### 2. **Data Preprocessing**
- **Target Variable Creation**: Maps loan statuses to survival outcomes
  - `0` (Survived): Fully Paid, Current, In Grace Period
  - `1` (Failed): Charged Off, Default, Late payments
- **Feature Selection**: 23 relevant features for MSME survival prediction
- **Missing Value Handling**: Median imputation for numerical, mode for categorical
- **Categorical Encoding**: Label encoding for categorical variables
- **Feature Scaling**: StandardScaler for normalization

### 3. **Model Training & Evaluation**
- **Algorithm**: XGBoost Classifier with optimized hyperparameters
- **Cross-Validation**: 5-fold Stratified Cross-Validation
- **Train/Test Split**: 80/20 split with stratification
- **Comprehensive Metrics**:
  - Accuracy, Precision, Recall, F1-Score
  - Confusion Matrix visualization
  - Detailed classification report

### 4. **Feature Importance Analysis**
- XGBoost feature importance ranking
- Top 20 most important features visualization
- Insights into key survival predictors

### 5. **Model Persistence**
- Saves trained XGBoost model as `xgboost_model.pkl`
- Saves preprocessing components (scaler, label encoders, feature names)
- Ready for production deployment

### 6. **🚀 FastAPI Web Application**
- **Real-time Prediction API**: REST endpoints for business risk assessment
- **Interactive Documentation**: Auto-generated Swagger UI at `/docs`
- **Health Monitoring**: Built-in health check endpoints
- **Production Ready**: CORS support, logging, error handling
- **Easy Integration**: JSON input/output for seamless integration

## 🚀 Usage

### Prerequisites

Install required dependencies:

```bash
pip install -r requirements.txt
```

### Option 1: Running the Training Pipeline

```bash
python msme_survival_predictor.py
```

The pipeline will automatically:
1. Load and analyze the dataset
2. Perform comprehensive EDA
3. Preprocess the data
4. Train the XGBoost model
5. Evaluate performance
6. Save all model artifacts

### Option 2: Running the FastAPI Application

After training the model, you can serve it via the FastAPI web application:

```bash
# Navigate to the API directory
cd ml_api

# Start the FastAPI server
uvicorn main:app --reload
```

The API will be available at:
- **Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

#### Example API Usage

```python
import requests

# Make a prediction request
response = requests.post("http://localhost:8000/predict", json={
    "loan_amnt": 25000.0,
    "annual_inc": 80000.0,
    "grade": "A",
    "fico_range_low": 750,
    "dti": 15.0
})

result = response.json()
print(f"Risk Score: {result['risk_score']}")
print(f"Risk Level: {result['risk_level']}")
```

See the [API Documentation](ml_api/README.md) for complete usage instructions.

### Output Files

The pipeline generates several output files:

- **Models**: `model/`
  - `ensemble_trained_model.pkl` - Trained XGBoost ensemble model
  - `scaler.pkl` - Feature scaler
  - `label_encoders.pkl` - Categorical encoders
  - `feature_names.pkl` - Feature names list

- **Visualizations**:
  - `loan_status_distribution.png` - Target variable distribution
  - `correlation_heatmap.png` - Feature correlation matrix
  - `confusion_matrix.png` - Model performance matrix
  - `feature_importance.png` - Top features ranking

## 📈 Model Performance

The XGBoost model provides:
- **High Accuracy**: Typically 85%+ on test data
- **Balanced Performance**: Good precision and recall for both classes
- **Feature Insights**: Clear ranking of survival predictors
- **Cross-Validation**: Robust 5-fold CV performance

### Key Predictive Features

Based on feature importance analysis, key survival predictors typically include:
- Credit score (FICO range)
- Interest rate and loan grade
- Debt-to-income ratio
- Annual income
- Loan amount and installment
- Credit utilization and revolving balance

## 🛠️ Technical Specifications

- **Python Version**: 3.8+
- **Primary Algorithm**: XGBoost Classifier
- **Feature Engineering**: 23 selected features
- **Data Size**: Handles large datasets efficiently
- **Visualization**: Matplotlib & Seaborn plots
- **Model Serialization**: Pickle format
- **API Framework**: FastAPI with automatic documentation
- **Deployment**: Uvicorn ASGI server

## 🏗️ Project Structure

```
XGBoost-Model/
├── model/                          # Trained model artifacts
│   ├── ensemble_trained_model.pkl  # Main XGBoost model
│   ├── scaler.pkl                  # Feature scaler
│   ├── label_encoders.pkl          # Categorical encoders
│   └── feature_names.pkl           # Feature names
├── ml_api/                         # FastAPI application
│   ├── main.py                     # API server
│   ├── test_api.py                 # API test suite
│   └── README.md                   # API documentation
├── datasets/                       # Training datasets
├── visualisations/                 # Generated plots
├── xgboost_train.py               # Training pipeline
├── requirements.txt               # Dependencies
└── README.md                      # Project documentation
```

## 🔮 Future Enhancements

- **Hyperparameter Tuning**: Grid/Random search optimization
- **Feature Engineering**: Create new composite features
- **Model Ensemble**: Combine multiple algorithms
- **API Authentication**: Add security layers
- **Model Monitoring**: Performance tracking over time
- **Batch Predictions**: Support for bulk processing
- **Model Versioning**: Track and manage model versions
