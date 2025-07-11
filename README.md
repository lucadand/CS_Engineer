# CS Engineer

A modern web application for managing and displaying Customer Support Engineer assignments at Nando's UK Head Office.

## Features

- **Engineer Assignment**: Assign and display the current CS Engineer for the day.
- **Status Management**: Set engineer status (available/busy) with automatic status reset based on time.
- **Admin Panel**: Assign engineers for specific dates via a secure admin page.
- **Ticket Logging**: Log demo support tickets with categories and priorities.
- **Feedback System**: Collect user feedback with ratings, emojis, and confetti celebration (using canvas-confetti).
- **Responsive UI**: Beautiful, mobile-first design using Tailwind CSS and DaisyUI.
- **Authentication**: (Planned/Optional) NextAuth integration for secure admin access.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Next.js API routes
- **Database**: MongoDB (with Mongoose ODM)
- **Confetti Animation**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/cs-engineer.git
   cd cs-engineer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and set your `MONGODB_URI`.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- **Home Page**: View the current CS Engineer, their status, and availability.
- **Admin Page**: `/admin` — Assign the engineer for a specific date.
- **Log Ticket**: Use the "Demo Ticket" button to log a support ticket.
- **Feedback**: Submit feedback and enjoy a confetti celebration!

## Project Structure

- `app/` — Next.js App Router pages and components
- `app/components/` — UI and feature components
- `app/models/` — Mongoose models
- `app/actions/` — Server actions for data fetching and mutations
- `app/lib/` — Database connection utilities

## Customization

- **Branding**: Update logos and colors in `public/` and Tailwind config.
- **Authentication**: Integrate NextAuth for admin access if needed.
- **Styling**: Tailwind and DaisyUI make it easy to adjust the look and feel.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is for demonstration and internal use at Nando's UK Head Office.

---

_Built with ❤️ using Next.js, Tailwind CSS, MongoDB, and canvas-confetti._
