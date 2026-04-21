# Invoice Management App

A fully functional invoice management React application built.

## Live Demo
https://invoice-app-one-vert.vercel.app/
## Setup Instructions

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd invoice-app

# 2. Copy all files from this zip into the project root
# The src/ folder replaces the default CRA src/
# The illustration-empty.svg goes into public/

# 3. Install dependencies
npm install

# 4. Run locally
npm start

# 5. Build for production
npm run build
```

## Deploying to Vercel (recommended)
1. Push to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Framework: Create React App (auto-detected)
4. Deploy — done

## Architecture

```
src/
├── context/
│   └── InvoiceContext.jsx   # Global state, localStorage, CRUD operations
├── utils/
│   └── helpers.js           # formatCurrency, formatDate, validateInvoice
├── components/
│   ├── Sidebar/             # Navigation bar + theme toggle
│   ├── Filter/              # Status filter dropdown with checkboxes
│   ├── InvoiceList/         # Invoice list page with empty state
│   ├── InvoiceDetail/       # Invoice detail view + actions
│   ├── InvoiceForm/         # Create / edit form with validation
│   └── Modal/               # Delete confirmation modal
├── App.js                   # Router + form orchestration
└── index.css                # Design tokens + global styles
```

## Design System (from Figma)
- **Font**: League Spartan (via Google Fonts)
- **Primary**: `#7C5DFA` purple / `#9277FF` hover
- **Status colors**: Green `#33D69F`, Orange `#FF8F00`, Red `#EC5757`
- **Light bg**: `#F8F8FB`, Dark bg: `#141625`
- **Cards**: White (light) / `#1E2139` (dark)

## Features
- Full CRUD — create, view, edit, delete invoices
- Save as Draft or Send (Pending)
- Mark Pending invoices as Paid
- Filter by status (Draft / Pending / Paid)
- Light / Dark mode with localStorage persistence
- Invoice data persisted in localStorage
- Form validation with inline error messages
- Delete confirmation modal with focus trap + ESC key
- Fully responsive: 320px mobile → tablet → desktop

## Accessibility Notes
- All form fields have `<label for="">` associations
- Modal traps focus and closes on ESC
- Buttons use `<button>` with descriptive `aria-label`
- Status badges use `aria-label` for screen readers
- Skip-focus and keyboard navigation fully supported
- WCAG AA colour contrast in both light and dark modes

## Trade-offs
- Used Create React App for simplicity; Vite would be faster for dev
- No backend — data persists in localStorage only
- Payment terms use a select; a date-picker could be added for exactness

## Improvements Beyond Requirements
- Sample invoices preloaded on first visit
- Animated form panel slide-in via CSS
- Accessible filter dropdown with custom checkboxes