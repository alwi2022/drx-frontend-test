# DRX Frontend Test — Roadmap

```bash
# Clone repo
git clone https://github.com/alwi2022/drx-frontend-test.git
cd drx-frontend-test

# Install dependencies
npm install

# Jalankan dev server (Vite)
npm run dev
Akses di: http://localhost:5173

## Build & Preview
```bash
npm run build
npm run preview
# default: http://localhost:4173


## Menjalankan dengan Docker 
```bash
docker build -t drx-frontend:prod .
docker run --rm -p 8080:80 drx-frontend:prod
# akses di http://localhost:8080

