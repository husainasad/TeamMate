## TeamMate: A task management platform
[Guide for Django Backend](https://www.w3schools.com/django/)
[Guide for Integrating React with Django](https://medium.com/@devsumitg/how-to-connect-reactjs-django-framework-c5ba268cb8be)

### App users can do the following:
- View All Assigned Tasks
- View Individual Tasks in detail
- View task members
- Edit task
- Task owners can add and remove members from task
- Task owners can delete the task

### Backend Server
- [Optional] Install dependencies ```pip install -r requirements.txt```
- Set up database and update config.ini with db details
- Make migrations ```python manage.py makemigrations```
- Make schema ```python manage.py migrate```
- Run tests ```python manage.py test```
- Run server ```python manage.py runserver```

### Frontend Server
- [Optional] Install dependencies ```npm install```
- Update backend IP in API.js
- Run server ```npm start```

### Containerization
The steps to containerize the application have been explained in detail in 'DevOps.md'