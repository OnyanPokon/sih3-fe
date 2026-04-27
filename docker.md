# Panduan Docker Frontend SPMB

## Pilihan cara jalan
- **Pakai build lokal (lebih cepat untuk dev/QA)**  
  - Pastikan sudah ada folder `dist` (sekali saja: `npm run build` atau `npm run build:staging`).  
  - File `.env.staging` dan `.env.production` ikut dikirim ke build (agar Vite membaca variabelnya).  
  - Jalankan: `PORT_DOCKER=8080 docker compose up -d`  
  - Default port 8080; ubah via env `PORT_DOCKER`.
- **Build image penuh (untuk staging/production)**  
  - File: `docker-compose.build.yml` + `Dockerfile`.  
  - Build & run produksi (default):  
    `PORT_DOCKER=8004 docker compose -f docker-compose.build.yml up --build -d`  
  - Build & run staging:  
    `PORT_DOCKER=8002 BUILD_CMD=build:staging docker compose -f docker-compose.build.yml up --build -d`  
  - Hanya build tanpa run:  
    `BUILD_CMD=build:staging docker compose -f docker-compose.build.yml build`  
  - Port di-host: `PORT_DOCKER` (default 8080). Contoh: `PORT_DOCKER=9000 ... up --build -d`.

## Ringkasan file
- `Dockerfile`  
  - Multi-stage: Node 22-alpine build → Nginx serve.  
  - Arg `BUILD_CMD` default `build:prod`; override dengan `BUILD_CMD=build:staging`.
- `docker-compose.yml`  
  - Hanya serve `./dist` via `nginx:1.27-alpine`.  
  - Mount `nginx.conf` untuk fallback SPA.  
  - Port: `${PORT_DOCKER:-8080}:80`.
- `docker-compose.build.yml`  
  - Build image dari source memakai `Dockerfile`.  
  - Meneruskan arg `BUILD_CMD` dan env `PORT_DOCKER`.
  - Sertakan file env: `.env.staging` / `.env.production` sudah tidak di-ignore.
- `nginx.conf`  
  - `try_files ... /index.html` untuk SPA. Cache panjang untuk `/assets/`.

## Operasional singkat
- Lihat log: `docker compose logs -f`
- Hentikan: `docker compose down` (atau sertakan `-f docker-compose.build.yml` jika pakai file build)
- Bersihkan container & volume: `docker compose down -v`
