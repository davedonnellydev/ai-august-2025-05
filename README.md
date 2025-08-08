# Project 05 #AIAugustAppADay: Resume Critique Tool

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-05)  

**📆 Date**: 07/Aug/2025  
**🎯 Project Objective**: Paste/upload your CV, get AI-generated feedback and tips.  
**🚀 Features**: Upload pdf or paste resume text; Have an 'Analyse' button where AI can analyse and critique; Have a 'rewrite' button where AI can rewrite your CV for you. Stretch goals: have the UI highlight areas for improvement. Compare original and ai version where UI displays diffs between original text and AI changes?  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API  
**▶️ Live Demo**: *[https://dave-donnelly-ai-august-05.netlify.app/](https://dave-donnelly-ai-august-05.netlify.app/)*  

## 🗒️ Summary

This was a fun project to work on because it was something I could see myself using, so I had lots of ideas pouring out and it all seemed well within reach. Here's what I had planned: [ai-august-2025-05.drawio.png](./ai-august-2025-05.drawio.png). I was shaping up to get my MVP features out but ran into a snag which caused me to finish the day's work with less than I had hoped! Over the last couple of days I've started to try and do is break the project into smaller chunks of work and work on each chunk on a different branch which I then merge with main (rather than just pushing to my main branch all the time). This was my saving grace yesterday and the reason there's at least something online today - I was working on a more complex structure for the feedback page and got to the very last bit trying to make it work, and when I started testing it, it kept failing on one particular API call. I tried a variety of little changes to see if they fixed it but the error remained. After googling the error I discovered that the particular API, designed to fetch the content of a document I had uploaded to OpenAI's servers earlier, was not designed to be retrieved by applications like that, only by their Assistants (AI agents) so the infrastructure I'd spent my last two hours of the day building was fundamentally not going to work. I had to rush out the door to meet people for dinner and my husband (to his credit) said, "why don't you just publish what you have and call it a learning opportunity?" and darn it, folks, I hate that he was right. I let it go and published my main branch with the less structured version of CV feedback given. I'll keep the above link up for record's sake, but I'm gonna clone this project and keep working on it because I genuinely  think it will help not just me but others out there.  

**Lessons learned**  
- Always test your APIs before building your application around the assumption that they will do what you want them to do.  
- CI/CD is an industry practice for a reason. Breaking the project into chunks so that I can deploy things one chunk at a time means *something* useful is out there sooner and if I don't get all the chunks done, at least that doesn't delay what's already built.
- Building something useful for myself and others is always going to be much more fulfilling than building something for the sake of building.  

**Final thoughts**  
I knew I was going to get a lot out of this challenge, but it's so reassuring to see that there are genuine lessons coming out of these days of building and failing fast.  

This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).  

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-05/actions/workflows/npm_test.yml/badge.svg)   
*Note: Test suite runs automatically with each push/merge.*  

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/davedonnellydev/ai-august-2025-05.git
   cd ai-august-2025-05
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: External API URLs
USER_API_URL=https://jsonplaceholder.typicode.com/users
PRODUCT_API_URL=https://dummyjson.com/products

# Optional: Proxy Settings
ENABLE_CACHE=true
CACHE_DURATION=300000
```

### Key Configuration Files

- **`next.config.mjs`** - Next.js configuration with bundle analyzer
- **`tsconfig.json`** - TypeScript configuration with path aliases (`@/*`)
- **`theme.ts`** - Mantine theme customization
- **`eslint.config.mjs`** - ESLint rules with Mantine and TypeScript support
- **`jest.config.cjs`** - Jest testing configuration
- **`.nvmrc`** - Node.js version (v24.3.0)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Component } from '@/components/Component';  // instead of '../../../components/Component'
```


## 📦 Available Scripts
### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run prettier:check` – checks files with Prettier
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `npm run storybook` – starts storybook dev server
- `npm run storybook:build` – build production storybook bundle to `storybook-static`
- `npm run prettier:write` – formats all files with Prettier


## 📜 License
![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-05)  
This project is licensed under the MIT License.  
