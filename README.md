# 🔥 GitHub ID Card Maker

[![GitHub stars](https://img.shields.io/github/stars/nishansr/Github-ID-Card-Maker?style=social)](https://github.com/nishansr/Github-ID-Card-Maker)
[![GitHub forks](https://img.shields.io/github/forks/nishansr/Github-ID-Card-Maker?style=social)](https://github.com/nishansr/Github-ID-Card-Maker)

> *"The best minds of my generation are thinking about how to make people click ads."*
> 
> *- Jeff Hammerbacher*

[![GitHub Card](https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=nishansr&card=1&theme=default&qr=true&stats=true&bio=true&followers=true)](https://github.com/nishansr)

Create beautiful, customizable GitHub profile cards that you can embed anywhere! Generate stunning visual representations of your GitHub profile with stats, QR codes, and multiple design templates.

## 🎯 Features

- **🎨 Multiple Card Templates** - Choose from 3 beautiful card designs
- **📊 GitHub Stats Integration** - Display repositories, stars, and top languages
- **🔗 QR Code Generation** - Quick access to your GitHub profile
- **🌙 Theme Support** - Light and dark themes available
- **📱 Responsive Design** - Works perfectly on all devices
- **🔧 Highly Customizable** - Toggle visibility of different sections
- **📋 Easy Embedding** - Copy-paste Markdown and HTML code
- **⚡ Real-time Preview** - See changes instantly as you customize

## 🚀 Quick Start

### Online Tool
Visit our web interface to create your card instantly:
1. Enter your GitHub username
2. Customize your card design and options
3. Copy the generated Markdown or HTML code
4. Embed it in your README or website!

### API Usage

Generate cards programmatically using our API:

```
https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=USERNAME&card=1&theme=dark
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user` | string | **required** | GitHub username |
| `card` | number | `1` | Card template (1, 2, or 3) |
| `theme` | string | `light` | Theme (`light`, `dark`, `default`) |
| `qr` | boolean | `true` | Show QR code |
| `stats` | boolean | `true` | Show GitHub stats |
| `bio` | boolean | `true` | Show bio |
| `followers` | boolean | `true` | Show followers count |

#### Examples

**Basic card:**
```markdown
![GitHub Card](https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=octocat)
```

**Dark theme with stats only:**
```markdown
![GitHub Card](https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=octocat&theme=dark&qr=false&bio=false&followers=false)
```

**Custom card template:**
```markdown
![GitHub Card](https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=octocat&card=2&theme=light)
```

## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishansr/Github-ID-Card-Maker.git
   cd Github-ID-Card-Maker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5174`

### Build for Production

```bash
npm run build
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure domain:**
   Follow Vercel's instructions to set up your custom domain.

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📖 Usage Examples

### In GitHub README

```markdown
# Hi there! 👋

![My GitHub Card](https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=yourusername&theme=dark)

## About Me
<!-- Your content here -->
```

### In HTML

```html
<div align="center">
  <a href="https://github.com/yourusername">
    <img src="https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=yourusername&card=2" alt="GitHub Card" />
  </a>
</div>
```

### With Custom Styling

```html
<img 
  src="https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app/api/card?user=yourusername" 
  alt="GitHub Card"
  style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>
```

## 🎨 Card Templates

### Card 1 - Classic
- Clean, professional design
- Prominent avatar and stats
- Perfect for portfolios

### Card 2 - Modern
- Sleek gradient background
- Minimalist layout
- Great for personal branding

### Card 3 - Detailed
- Comprehensive information display
- Rich visual elements
- Ideal for showcasing expertise

## 🔧 Customization Options

### Theme Options
- **Light**: Clean white background with dark text
- **Dark**: Dark background with light text  
- **Default**: Automatic theme based on system preference

### Visibility Controls
- **QR Code**: Toggle GitHub profile QR code
- **Stats**: Show/hide repository and star counts
- **Bio**: Display user bio information
- **Followers**: Show follower and following counts

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [GitHub Readme Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats)
- Built with React, TypeScript, and Tailwind CSS
- Powered by GitHub API
- QR code generation by [qrcode](https://www.npmjs.com/package/qrcode)

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/nishansr/Github-ID-Card-Maker)
![GitHub forks](https://img.shields.io/github/forks/nishansr/Github-ID-Card-Maker)
![GitHub issues](https://img.shields.io/github/issues/nishansr/Github-ID-Card-Maker)
![GitHub license](https://img.shields.io/github/license/nishansr/Github-ID-Card-Maker)

---

<div align="center">
  <strong>Made with ❤️ by the GitHub community</strong>
</div>