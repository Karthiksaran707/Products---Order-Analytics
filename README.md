# Product & Order Analytics Web Application

### Products Management
- **Editable Products Table**: Edit product title, category, unit price, and COGS inline
- **Add New Products**: Create new products with validation
- **Real-time Validation**: Ensures unit price and COGS are greater than 0
- **Persistent Storage**: All changes are saved to a local JSON file

### Order Analytics
- **Real-time Calculations**: Automatically calculates metrics for 10 orders
- **Recalculate Button**: Updates analytics when product prices change
- **Comprehensive Metrics**: Displays Gross Sales, Discounts, Taxes, Shipping, Sales, Total COGS, Gross Profit, and Gross Margin
- **Visual Indicators**: Color-coded profit margins and totals
- **Summary Cards**: Quick overview of total sales, profit, and average margin

## 📋 Business Logic & Formulas

All calculations follow these strict formulas:

1. **Gross Sales** = Σ(Product Unit Price × Quantity) for all line items
2. **Total COGS** = Σ(Product COGS × Quantity) for all line items
3. **Sales** = Gross Sales + Taxes - Discounts + Shipping
4. **Gross Profit** = Sales - Total COGS
5. **Gross Margin** = (Gross Profit / Sales) × 100

**Rounding Rule**: All decimal values are displayed with a maximum of 1 decimal place.

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "e:\8th sem\Products & Order Analytics"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers:

1. **Start the Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Axios** for API communication
- **Custom animations** and glassmorphism effects

### Backend
- **Node.js** with Express framework
- **CORS** enabled for cross-origin requests
- **JSON file storage** for data persistence (no database required)
