from setuptools import setup, find_packages

setup(
    name="xgboost-msme-risk-prediction",
    version="1.0.0",
    description="MSME Business Risk Prediction using XGBoost Ensemble Model",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "pandas>=2.0.0",
        "numpy>=1.24.0",
        "matplotlib>=3.7.0",
        "seaborn>=0.12.0",
        "scikit-learn>=1.3.0",
        "xgboost>=1.7.0",
        "pickle-mixin>=1.0.2",
        "lightgbm>=4.0.0",
        "imbalanced-learn>=0.13.0",
        "feature-engine>=1.8.0",
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "pydantic>=2.0.0",
        "requests>=2.32.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=23.0.0",
            "isort>=5.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ]
    },
    package_data={
        "": ["*.pkl", "*.json"],
    },
    include_package_data=True,
) 