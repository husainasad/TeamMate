# Dockerfile for TeamMate Django Backend
FROM python:3.11-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
ENV DB_NAME=taskManagerDB
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_HOST=postgres-db
ENV DB_PORT=5432
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]