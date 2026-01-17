# Medium Clone

A full-stack blogging platform inspired by Medium, built with Next.js 14.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** MongoDB with Mongoose
- **Image Storage:** Cloudinary
- **State Management:** Recoil

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Google OAuth credentials
- Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd medium-clone
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret>
CLIENT_ID=<google-client-id>
CLIENT_SECRET=<google-client-secret>
MONGODB_URI=<mongodb-connection-string>
CLOUDINARY_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_SECRET=<cloudinary-api-secret>
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
│   ├── pages/        # Page-specific components
│   └── shared/       # Reusable components
├── lib/              # Database and service configurations
├── models/           # Mongoose models
└── utils/            # Helpers and state atoms
```

## License

MIT
