# Use a Python 3.10 base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy only requirements first to leverage Docker caching
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

# Set environment variable for cache location
ENV TRANSFORMERS_CACHE=/app/.cache
ENV HF_HOME=/app/.cache

# Create the cache directory and set permissions
RUN mkdir -p /app/.cache && chmod -R 777 /app/.cache

# Pre-download the Whisper model to cache (optional, improves speed)
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('medium', download_root='/app/.cache')"

# Expose the Gradio port
EXPOSE 7860

# Start the Gradio interface
CMD ["python", "app.py"]
