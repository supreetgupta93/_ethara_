# Ethara AI Frontend - Build & Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for containerized deployment)

## Development Workflow

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:5173

### 3. Make Changes
- Edit files in `src/` directory
- Changes hot-reload automatically
- Check browser console for errors

## Production Build

### 1. Build Optimized Bundle
```bash
npm run build
```

Output files are in the `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Optimized images
- Source maps (for debugging)

### 2. Preview Production Build
```bash
npm run preview
```

Test the production build locally at: http://localhost:4173

### 3. Deploy Built Files
Upload the `dist/` directory to your hosting:

```bash
# Example with rsync
rsync -avz dist/ user@server:/var/www/ethara-frontend/

# Example with FTP
ftp> put -r dist/* /www/
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t ethara-ai-frontend:latest .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=https://api.ethara.com \
  ethara-ai-frontend:latest
```

### Push to Registry
```bash
# Tag image
docker tag ethara-ai-frontend:latest myregistry/ethara-ai-frontend:latest

# Push
docker push myregistry/ethara-ai-frontend:latest
```

## Docker Compose Setup

### Full Stack (Frontend + Backend)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - ethara-network

  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/ethara
    depends_on:
      - db
    networks:
      - ethara-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=ethara
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ethara-network

volumes:
  postgres_data:

networks:
  ethara-network:
    driver: bridge
```

Deploy with: `docker-compose up -d`

## Kubernetes Deployment

### Create Namespace
```bash
kubectl create namespace ethara
```

### Deploy Frontend
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ethara-frontend
  namespace: ethara
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ethara-frontend
  template:
    metadata:
      labels:
        app: ethara-frontend
    spec:
      containers:
      - name: frontend
        image: myregistry/ethara-ai-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_API_URL
          value: "https://api.ethara.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ethara-frontend-service
  namespace: ethara
spec:
  type: LoadBalancer
  selector:
    app: ethara-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ethara-frontend-ingress
  namespace: ethara
spec:
  ingressClassName: nginx
  rules:
  - host: app.ethara.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ethara-frontend-service
            port:
              number: 80
  tls:
  - hosts:
    - app.ethara.com
    secretName: ethara-tls
```

Deploy with:
```bash
kubectl apply -f frontend-deployment.yaml
```

## Environment Configuration

### Development (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Production (.env.production)
```env
VITE_API_URL=https://api.ethara.com
```

### Staging (.env.staging)
```env
VITE_API_URL=https://staging-api.ethara.com
```

## Performance Optimization

### Enable Gzip Compression
```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
gzip_min_length 1000;
```

### Enable Browser Caching
```nginx
location /assets {
  expires 30d;
  add_header Cache-Control "public, immutable";
}

location / {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}
```

### Use CDN
```bash
# Upload dist/ to CloudFront, Cloudflare, or similar CDN
# Update CNAME to CDN endpoint
```

## Monitoring & Logging

### Application Monitoring
```bash
# Install monitoring tool
npm install --save-dev pm2

# Start with PM2
pm2 start "npm run preview" --name "ethara-frontend"

# Monitor
pm2 monit
```

### Log Aggregation
Configure application logs to be sent to:
- CloudWatch (AWS)
- Stackdriver (GCP)
- ELK Stack (self-hosted)

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
# Using Certbot
certbot certonly --standalone -d app.ethara.com

# Renewal
certbot renew
```

### Self-Signed (Testing)
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

## Health Check

### Verify Deployment
```bash
# Check frontend is responding
curl -I https://app.ethara.com

# Check API connection
curl https://api.ethara.com/health

# Check specific routes
curl https://app.ethara.com/dashboard
curl https://app.ethara.com/products
```

## Rollback

### Previous Version
```bash
# Tag current build
docker tag ethara-ai-frontend:latest ethara-ai-frontend:v1.0.0

# Deploy previous tag
docker run -p 3000:3000 ethara-ai-frontend:v1.0.0

# Or with Kubernetes
kubectl rollout undo deployment/ethara-frontend -n ethara
```

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
      working-directory: Frontend
    
    - name: Build
      run: npm run build
      working-directory: Frontend
    
    - name: Deploy to server
      run: |
        rsync -avz Frontend/dist/ ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}:/var/www/ethara-frontend/
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 ethara-ai-frontend
```

### CORS Errors
Check backend CORS configuration:
```python
# Backend (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.ethara.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Performance Metrics

Monitor in production:
- Page load time < 2 seconds
- Bundle size < 300KB gzipped
- Lighthouse score > 90
- API response time < 500ms
- Error rate < 0.1%

## Backup & Disaster Recovery

### Regular Backups
```bash
# Daily snapshots of dist/
tar -czf frontend-backup-$(date +%Y%m%d).tar.gz dist/

# Push to S3
aws s3 cp frontend-backup-*.tar.gz s3://ethara-backups/
```

### Recovery
```bash
# Download from backup
aws s3 cp s3://ethara-backups/frontend-backup-YYYYMMDD.tar.gz .

# Restore
tar -xzf frontend-backup-YYYYMMDD.tar.gz
docker run -p 3000:3000 -v $(pwd)/dist:/usr/share/nginx/html ethara-ai-frontend
```

---

For more information, see [PRODUCTION_AUDIT.md](./PRODUCTION_AUDIT.md) and [README.md](./README.md)
