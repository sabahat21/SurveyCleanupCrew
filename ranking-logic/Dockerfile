# Use a lightweight base image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full application
COPY . .

# Expose the Flask port (default: 5000)
EXPOSE 5000

# Run the Flask application
CMD ["python", "app.py"]
