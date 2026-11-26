# Precision Tech — An E-Commerce System Integrating YOLO and OCR for PC Customization

Final Year Project. Precision Tech is an online PC parts store with AI help built in. A shopper uploads a photo of a PC component. **YOLO** finds and classifies the part, and **OCR (Tesseract)** reads the model text printed on it. The system then matches the result against the product catalogue. Customers can then build a full PC with compatibility checking, add it to the cart and check out.

**Live demo:** https://precision-tech.vercel.app (frontend) · backend on Render

## Why

Buying PC parts online is hard for non-technical users. They have to identify components, read specifications and check that the CPU, motherboard, RAM and PSU work together. Users who want to upgrade an existing PC also have to read and search for model numbers by hand. This project automates the identification step and guides the build.

## Objectives

- Follow software engineering methodologies throughout development.
- Integrate YOLO object detection to identify PC components in user-uploaded images.
- Apply OCR to read model names and text from detected parts.
- Design a structured, scalable database for products, specifications, compatibility rules and users.
- Provide compatibility checking and part recommendations.
- Evaluate detection accuracy, OCR accuracy, response time and usability.

## Features

| Area | What it does |
|------|--------------|
| **Image search** | Upload a photo → YOLO detects the component → OCR reads the label → matching products are shown |
| **Catalogue** | Browse by category, filter by brand and specs, view product details, compare products side by side |
| **PC Builder** | Pick parts one category at a time, filtered to compatible products only; save builds to your account |
| **Cart & checkout** | Cart synced to your account, shipping calculation, simulated payment, order confirmation |
| **Accounts** | Sign up / log in with Supabase Auth, profile and order history |
| **Admin panel** | Protected admin routes to manage products, stock and orders |

## Architecture

```
┌──────────────────────┐   REST (Vite proxy in dev,   ┌──────────────────────────┐
│ React 19 + Vite      │   VITE_API_URL in prod)      │ FastAPI (Python)         │
│ Tailwind / shadcn-ui │ ───────────────────────────► │  /analyze → YOLO + OCR   │
│ (Vercel)             │                              │  /search, /suggest, ...  │
└──────────┬───────────┘                              │  /api/cart, /api/orders  │
           │ Auth                                     │ (Render, Docker)         │
           ▼                                          └────────────┬─────────────┘
┌──────────────────────────────────────────────────────────────────▼─────────────┐
│ Supabase — PostgreSQL (products, stock, carts, builds, orders, users), Auth    │
└────────────────────────────────────────────────────────────────────────────────┘
```

### The `/analyze` pipeline

1. The uploaded image is decoded with OpenCV.
2. **YOLO** (Ultralytics) detects components and returns a category, confidence and bounding box for each.
3. Each box is cropped, and **Tesseract OCR** reads the text on it.
4. The YOLO class is mapped to a database category. The best OCR text is then searched against that category's products.
5. The response lists each detection with its OCR text and the matching products.

### Model

- Dataset: PC component images (web search + Amazon listings), sorted into 8 classes and split 70/20/10 into train/val/test. It was later expanded with Amazon images classified by CLIP.
- Compared YOLO11n, YOLOv8n, YOLO12n and YOLOv5nu. The best model reached **99.0% mAP50**.
- Detected classes cover the major parts: CPU, GPU, RAM, motherboard, PSU and storage.

## Tech stack

- **Frontend:** React 19, Vite 7, React Router 7, Tailwind CSS 4, shadcn/ui (Radix), lucide-react
- **Backend:** FastAPI, Uvicorn, Ultralytics YOLO, pytesseract, OpenCV, Pydantic
- **Database / Auth:** Supabase (PostgreSQL + Row Level Security)
- **Deployment:** Vercel (frontend), Render Docker service (backend)

## Repository layout

This repo holds the **frontend**. The backend and ML training material live in a sibling folder, `../FYP Dataset/`.

```
src/
  app/            app shell / layout
  components/ui/  shared UI components (shadcn)
  features/       one folder per feature: api/, components/, pages/
    home, catalog, builder, cart, auth, admin, about, contact
  lib/            client.js (backend fetch wrapper), supabase.js
  config/         category definitions
migrations/       Supabase SQL: tables, RLS policies, stock RPC functions
Report Document/  FYP report chapters, diagrams and figures
```

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.10+ with Tesseract OCR installed
- A Supabase project with the SQL in `migrations/` applied
- Trained YOLO weights (`best.pt`)

### 1. Frontend

Create `.env` in this folder:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
# Production only. In dev, Vite proxies API calls to http://localhost:8000
VITE_API_URL=
```

```bash
npm install
npx vite          # http://localhost:5173
```

### 2. Backend (in `../FYP Dataset`)

```bash
pip install -r requirements.txt
# set YOLO_WEIGHTS_PATH, TESSERACT_CMD, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

`npm run dev` starts both servers together through `start_backend.py`. Its Python path is hard-coded to the author's machine, so edit `package.json` before using it.

### Build

```bash
npm run build     # output in dist/
npm run lint
```

## Testing

The backend has 14 pytest cases (`../FYP Dataset/tests`) covering all modules. System, usability and acceptance testing are documented in Chapter 6 of the report (`Report Document/chapter6.md`).

## Limitations

- Detection and OCR accuracy depend on image quality (lighting, blur, hidden or reflective labels).
- Only standard components are recognised. Rare or newly released models may not be in the training data.
- Compatibility checks are based on specifications and cannot guarantee real-world compatibility (BIOS, firmware).
- Payment is simulated; there is no real payment gateway.
- On Render's free tier (512 MB RAM), `/analyze` can time out or run out of memory.

## Report

The full FYP report (chapters 1–6, diagrams, Gantt chart, poster) is in [`Report Document/`](Report%20Document/).
