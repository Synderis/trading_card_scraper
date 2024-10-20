# Stage 1: Build React frontend
FROM node:18 AS frontend-build

WORKDIR /app/scraper_front_end

# Copy the package.json and install dependencies
COPY scraper_front_end/package*.json ./
RUN npm install

# Copy the rest of the frontend files and build the app
COPY scraper_front_end/ ./
RUN npm run build

# Stage 2: Build Python backend with Uvicorn
FROM python:3.12-slim

WORKDIR /app

# Copy requirements.txt and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the entire project, including the Python backend and React frontend
COPY . /app/

# Copy the built React app to the static folder
COPY --from=frontend-build /app/scraper_front_end/build /app/static

# Expose the backend port (e.g., 8000)
EXPOSE 8000

# Command to run the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
