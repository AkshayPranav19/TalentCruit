# Python_Api/Dockerfile
FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3-dev \
      libgomp1 \
      poppler-utils \
      tesseract-ocr \
      libglib2.0-0 libsm6 libxrender1 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=${PORT}

CMD ["uvicorn", "LLM_api:app", "--host", "0.0.0.0", "--port", "${PORT}"]
