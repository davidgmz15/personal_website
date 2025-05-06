# Personal Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases your projects, professional experience, and provides a way for visitors to get in touch with you.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive
- 🌙 Dark mode support
- ⚡ Fast performance with Next.js
- 🎭 Smooth animations with Framer Motion
- 📝 Contact form
- 🖼️ Project showcase
- 📊 Experience timeline

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personal Information

1. Update the content in `src/app/page.tsx`:
   - Hero section text
   - About section content
   - Professional experience

2. Add your projects in `src/components/Projects.tsx`:
   - Project title
   - Description
   - Technologies used
   - Live demo URL
   - GitHub repository URL
   - Project image (add to `public` directory)

### Styling

- Colors and theme can be modified in `tailwind.config.js`
- Global styles can be updated in `src/app/globals.css`
- Component-specific styles are in their respective component files

### Contact Form

The contact form in `src/components/ContactForm.tsx` currently simulates form submission. To make it functional:

1. Set up a backend API endpoint to handle form submissions
2. Update the `handleSubmit` function in `ContactForm.tsx` to send data to your API
3. Add proper error handling and validation

## Deployment

This portfolio can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Heroicons
- Headless UI

## License

MIT License - feel free to use this template for your own portfolio!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
