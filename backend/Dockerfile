# Use official Python image
FROM python:3.11-slim

# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Prevent Python buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements first for Docker layer caching
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Expose Django port
EXPOSE 8000

# Start command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]