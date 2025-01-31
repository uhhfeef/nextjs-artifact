# Next.js Artifact - Claude-Style Chart Rendering

A Next.js implementation that successfully replicates Anthropic Claude's Artifacts feature, specifically focusing on secure and isolated chart rendering using Recharts within iframes.

## 📸 Demo

![Chart Renderer Demo](/public/assets/chart-demo.png)

## 🎯 Problem Solved

This project tackles a significant challenge in modern web applications: safely rendering interactive charts in an isolated environment while maintaining full functionality. Inspired by Anthropic Claude's Artifacts feature, I've created a solution that:

- Isolates chart rendering to prevent conflicts with the main application
- Maintains security through iframe sandboxing
- Handles dynamic chart generation without compromising performance
- Successfully replicates the functionality seen in Claude's Artifacts

## 🚀 Key Features

- **Isolated Chart Rendering**: Charts are rendered in a separate iframe environment
- **Secure Dependency Management**: CDN dependencies loaded in correct order
- **Dynamic Code Processing**: Automatic transpilation and code adjustment
- **Error Handling**: Robust error management for chart rendering
- **Modern Tech Stack**: Built with Next.js and TypeScript

## 🛠️ Technical Implementation

The core of this solution lies in the `ChartRenderer` component, which:

1. Creates an isolated iframe environment
2. Loads dependencies in the correct sequence:
   ```html
   - React 18.2.0
   - ReactDOM 18.2.0
   - PropTypes 15.8.1
   - Recharts 2.10.4
   ```
3. Processes and adjusts code for iframe compatibility
4. Handles errors and provides appropriate styling

## 🔧 How It Works

1. **Isolation**: Each chart is rendered in its own iframe, preventing conflicts with the main application's dependencies
2. **Dependency Management**: CDN resources are loaded from reliable sources (cdnjs)
3. **Code Processing**: 
   - Module imports are removed
   - Exports are adjusted for iframe compatibility
   - Global variable access is properly handled

## 📚 Key Learnings

- Proper script loading order is crucial for dependency management
- CDN source selection impacts reliability (cdnjs vs unpkg)
- PropTypes are essential for React component validation
- Iframe isolation provides better security and prevents conflicts

## 🎉 Success Metrics

The implementation successfully replicates Claude's Artifacts functionality, providing:
- Isolated chart rendering
- Reliable performance
- Clean integration with Next.js
- Secure dependency management

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000`

## 📝 License

MIT

---

Built with ❤️ by Afeef Khan
