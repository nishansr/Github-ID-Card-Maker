# GitHub ID Card Maker

GitHub ID Card Maker is a web application that allows you to create personalized ID cards for your GitHub profile. Simply enter your GitHub username, select from various templates, and download your customized ID card.

## Features

- **AI-Powered Generation**: Upload your username and let our AI create the perfect ID card to your needs.
- **Customizable Templates**: Choose from a variety of templates to create your unique ID card.
- **Instant Preview**: Get an instant preview of your ID card as you make changes.
- **Downloadable**: Download your customized ID card as a PNG image.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nishansr/github-id-card-maker.git
   cd github-id-card-maker

   ```

2. Install dependencies:

````bash
npm install

```

3. Start the development server:
```bash
  npm run dev

```

4. Open your browser and navigate to
 http://localhost:3000.
````

### Project Structure
src/
├── assets/                 # Images and other assets
├── components/             # React components
│   ├── cards/              # Card components
│   │   ├── Card1.tsx
│   │   ├── Card2.tsx
│   │   └── Card3.tsx
│   ├── sections/           # Section components
│   │   ├── AboutScreen.tsx
│   │   ├── ContactScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── CustomAlert.tsx     # Custom alert component
│   └── Home.tsx            # Home component
├── App.tsx                 # Main app component
├── index.tsx               # Entry point
└── ...                     # Other files