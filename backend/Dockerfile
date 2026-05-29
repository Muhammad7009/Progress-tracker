FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# 💡 Fixed: Points to the nested backend folder where app.py actually lives
CMD ["python", "backend/app.py"]