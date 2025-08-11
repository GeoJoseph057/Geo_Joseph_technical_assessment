# Pipeline Builder - Frontend Only Version

This is a standalone frontend-only version of the Pipeline Builder application. All backend dependencies have been removed and replaced with local mock functionality.

## Features

- ✅ **Frontend-Only**: No backend server required
- ✅ **Local Execution**: Pipeline execution happens locally with mock data
- ✅ **Save/Load**: Save and load pipelines using browser localStorage and file downloads
- ✅ **Export**: Export pipelines as JSON files
- ✅ **All Node Types**: Input, Output, LLM (mock), Calculator, Timer, Filter, etc.
- ✅ **Dark/Light Mode**: Toggle between themes
- ✅ **Responsive UI**: Works on desktop and mobile
- ✅ **Drag & Drop**: Create pipelines by dragging nodes from toolbar

## Changes Made

### Backend Dependencies Removed
- Removed all `fetch()` calls to `localhost:8001`
- Replaced backend pipeline execution with local mock execution
- Added local DAG validation and cycle detection
- Created mock outputs for all node types

### New Features Added
- **Local Storage**: Save pipelines to browser's localStorage
- **File Import/Export**: Load and save pipeline JSON files
- **Mock Execution**: Simulate pipeline execution with realistic outputs
- **Enhanced Error Handling**: Better error messages for local execution
- **Visual Status Indicators**: Shows "Local Mode" in header

### File Changes
1. **`src/ui.js`**: Replaced backend `executePipeline` with local execution logic
2. **`src/submit.js`**: Added save/load/export functionality, removed backend calls
3. **`src/store.js`**: Added `setNodes` and `setEdges` functions for loading pipelines
4. **`src/App.js`**: Added "Local Mode" indicator in header
5. **Root `package.json`**: Added for Vercel deployment
6. **`vercel.json`**: Configured for proper React app deployment

## Local Development

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

The application is configured for Vercel deployment:

1. **Automatic Build**: Vercel will run `npm run build` from root
2. **Output Directory**: Serves files from `frontend/build/`
3. **SPA Routing**: All routes redirect to `index.html` for React Router

### Vercel Configuration
- Uses `vercel.json` for build and routing configuration
- Builds the React app and serves static files
- Handles SPA routing correctly

## Usage

1. **Create Pipeline**: Drag nodes from the sidebar to the canvas
2. **Connect Nodes**: Drag between node handles to create connections
3. **Configure Nodes**: Click on nodes to edit their properties
4. **Execute Pipeline**: Click the "Run Pipeline" button or use Ctrl+Enter
5. **View Results**: Results panel opens automatically showing execution details
6. **Save/Load**: Use the save/load buttons to persist your work

## Mock Features

Since this is frontend-only, the following features are simulated:

- **LLM Responses**: Returns mock AI responses with fake token counts
- **API Calls**: Simulated with realistic delays and responses
- **File Processing**: Uses mock file content
- **External Integrations**: All replaced with mock responses

The mock system provides realistic outputs and execution times to demonstrate the UI functionality.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires modern browser with ES6+ support.
