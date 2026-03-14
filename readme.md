Installation 

1. Create the environment
2. Activate the environment
3. Install the requirements
   pip install django 
   pip install django-rest-framework
   django-admin startproject milkman
   cd milkman
   python manage.py startapp staff


   create file staff/serializers.py
   create file staff/urls.py

   add the app - staff to install apps in settings.py
   add the rest_framework to install_apps in settings.py

   add a class "include to the imports of urls.py"
   add a path to urls.py for the staff app