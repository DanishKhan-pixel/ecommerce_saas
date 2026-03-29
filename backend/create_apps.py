import os

apps = ['accounts', 'vendors', 'categories', 'products', 'cart', 'orders', 'payments', 'reviews']

for app in apps:
    os.makedirs(app, exist_ok=True)
    open(os.path.join(app, '__init__.py'), 'w').close()
    open(os.path.join(app, 'admin.py'), 'w').write("from django.contrib import admin\n")
    
    app_class = app.capitalize()
    apps_content = f"""from django.apps import AppConfig\n\nclass {app_class}Config(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = '{app}'\n"""
    open(os.path.join(app, 'apps.py'), 'w').write(apps_content)
    
    open(os.path.join(app, 'models.py'), 'w').write("from django.db import models\n")
    open(os.path.join(app, 'tests.py'), 'w').write("from django.test import TestCase\n")
    open(os.path.join(app, 'views.py'), 'w').write("from django.shortcuts import render\n")
