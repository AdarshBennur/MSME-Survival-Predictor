#!/usr/bin/env python3
"""
Import Validation Script for XGBoost MSME Risk Prediction Project
================================================================

This script validates all imports and helps diagnose import issues.
Run this to verify that all dependencies are properly installed.

Usage:
    python fix_imports.py
"""

import sys
import os
import subprocess
from pathlib import Path

def check_python_version():
    """Check Python version"""
    print("🐍 Python Version Check")
    print("-" * 30)
    print(f"Python Version: {sys.version}")
    print(f"Python Path: {sys.executable}")
    
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        return False
    else:
        print("✅ Python version is compatible")
        return True

def check_virtual_environment():
    """Check if running in virtual environment"""
    print("\n🏠 Virtual Environment Check")
    print("-" * 30)
    
    in_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    
    if in_venv:
        print("✅ Running in virtual environment")
        print(f"Virtual Env: {sys.prefix}")
        return True
    else:
        print("❌ Not running in virtual environment")
        print("Please activate your virtual environment with: source .venv/bin/activate")
        return False

def check_core_imports():
    """Check core Python imports"""
    print("\n📦 Core Imports Check")
    print("-" * 30)
    
    core_modules = [
        'os', 'sys', 'pickle', 'logging', 'datetime', 'typing', 'pathlib'
    ]
    
    success = True
    for module in core_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            success = False
    
    return success

def check_data_science_imports():
    """Check data science imports"""
    print("\n🔬 Data Science Libraries Check")
    print("-" * 30)
    
    ds_modules = [
        ('pandas', 'pd'),
        ('numpy', 'np'),
        ('matplotlib.pyplot', 'plt'),
        ('seaborn', 'sns'),
        ('sklearn', None),
        ('xgboost', 'xgb'),
        ('lightgbm', 'lgb'),
        ('imblearn', None),
        ('feature_engine', None)
    ]
    
    success = True
    for module_info in ds_modules:
        module = module_info[0]
        alias = module_info[1]
        
        try:
            if alias:
                exec(f"import {module} as {alias}")
            else:
                __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            success = False
    
    return success

def check_api_imports():
    """Check FastAPI imports"""
    print("\n🌐 API Libraries Check")
    print("-" * 30)
    
    api_modules = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'requests'
    ]
    
    success = True
    for module in api_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            success = False
    
    return success

def check_local_imports():
    """Check local project imports"""
    print("\n🏗️ Local Project Imports Check")
    print("-" * 30)
    
    # Add current directory to path
    current_dir = Path(__file__).parent.absolute()
    if str(current_dir) not in sys.path:
        sys.path.insert(0, str(current_dir))
    
    local_imports = [
        'ml_api',
        'ml_api.main',
        'ml_api.test_api'
    ]
    
    success = True
    for module in local_imports:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            success = False
    
    return success

def check_model_files():
    """Check if model files exist"""
    print("\n🤖 Model Files Check")
    print("-" * 30)
    
    model_files = [
        'model/ensemble_trained_model.pkl',
        'model/scaler.pkl',
        'model/label_encoders.pkl',
        'model/feature_names.pkl'
    ]
    
    success = True
    for file_path in model_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} (missing)")
            success = False
    
    return success

def check_python_path():
    """Check Python path configuration"""
    print("\n🛣️ Python Path Check")
    print("-" * 30)
    
    current_dir = str(Path(__file__).parent.absolute())
    ml_api_dir = str(Path(__file__).parent / "ml_api")
    
    print("Current Python Path:")
    for i, path in enumerate(sys.path):
        print(f"  {i}: {path}")
    
    print(f"\nProject directory: {current_dir}")
    print(f"ML API directory: {ml_api_dir}")
    
    if current_dir in sys.path:
        print("✅ Project directory in Python path")
    else:
        print("❌ Project directory NOT in Python path")
        print("   Add this to your PYTHONPATH or IDE configuration")
    
    return current_dir in sys.path

def suggest_fixes():
    """Suggest fixes for common issues"""
    print("\n🔧 Suggested Fixes")
    print("-" * 30)
    
    print("1. Virtual Environment:")
    print("   source .venv/bin/activate")
    
    print("\n2. Install Dependencies:")
    print("   pip install -r requirements.txt")
    
    print("\n3. Install Project in Development Mode:")
    print("   pip install -e .")
    
    print("\n4. Set Environment Variables:")
    print("   export PYTHONPATH=/Users/adarsh/Downloads/XGBoost-Model:$PYTHONPATH")
    
    print("\n5. IDE Configuration (VS Code/Cursor):")
    print("   - Set Python interpreter to: .venv/bin/python")
    print("   - Reload window after changing interpreter")
    print("   - Check that .vscode/settings.json is properly configured")
    
    print("\n6. Check Model Files:")
    print("   - Ensure all .pkl files are in the model/ directory")
    print("   - Run training script if model files are missing")

def run_all_checks():
    """Run all import checks"""
    print("🚀 XGBoost MSME Risk Prediction - Import Validation")
    print("=" * 60)
    
    checks = [
        ("Python Version", check_python_version),
        ("Virtual Environment", check_virtual_environment),
        ("Core Imports", check_core_imports),
        ("Data Science Libraries", check_data_science_imports),
        ("API Libraries", check_api_imports),
        ("Local Project Imports", check_local_imports),
        ("Model Files", check_model_files),
        ("Python Path", check_python_path)
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"❌ Error in {check_name}: {e}")
            results.append((check_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for check_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{check_name:<25} {status}")
        
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Checks: {len(results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All checks passed! Your environment is properly configured.")
    else:
        print(f"\n⚠️ {failed} check(s) failed.")
        suggest_fixes()
    
    return failed == 0

if __name__ == "__main__":
    success = run_all_checks()
    
    if not success:
        print("\n" + "=" * 60)
        print("🔍 If you're still experiencing import issues in your IDE:")
        print("1. Restart your IDE completely")
        print("2. Make sure the Python interpreter is set to .venv/bin/python")
        print("3. Reload the window/workspace")
        print("4. Clear IDE cache if available")
        print("5. Run this script again to verify fixes")
    
    sys.exit(0 if success else 1) 