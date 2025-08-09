# Pipeline Builder with Full Execution

A complete pipeline builder with visual node editor, validation, and actual data processing execution.

## Features

✅ **Drag & Drop Interface**: Create pipelines visually  
✅ **Node Connections**: Connect nodes with animated edges  
✅ **DAG Validation**: Ensures no circular dependencies  
✅ **Real Execution**: Actually processes data through the pipeline  
✅ **Multiple Node Types**: Input, Text, LLM, Output, Calculator, and more  
✅ **Output Generation**: See real results from your pipeline  

## Architecture

- **Frontend**: React + ReactFlow + Zustand
- **Backend**: FastAPI + Python
- **Execution Engine**: Topological sorting with async processing

## Quick Start

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Build and Execute Pipelines

1. **Create Pipeline**: Drag nodes from the toolbar
2. **Connect Nodes**: Draw connections between node handles
3. **Execute**: Click "Run Pipeline" to see real results

## Node Types & Functionality

### Input Nodes
- **Text Input**: Generates sample text data
- **File Input**: Simulates file processing
- **Custom Types**: Extensible input system

### Processing Nodes  
- **Text Node**: Process text with variable substitution
- **LLM Node**: Simulate AI/language model processing
- **Calculator Node**: Perform mathematical operations
- **Filter Node**: Data filtering operations

### Output Nodes
- **Multiple Formats**: JSON, CSV, XML, YAML, Text
- **Preview**: See formatted output before export
- **Size Metrics**: Track output size and statistics

## Execution Flow

1. **Validation**: Check for cycles (DAG validation)
2. **Topological Sort**: Determine execution order
3. **Sequential Processing**: Execute nodes with data flow
4. **Result Collection**: Gather outputs and statistics
5. **User Display**: Show comprehensive results

## Example Pipeline Results

```
🚀 Pipeline Execution Complete!

📊 Pipeline Statistics:
   • Nodes: 4
   • Edges: 3  
   • Valid DAG: Yes ✅
   • Total Execution Time: 2.34s
   • Status: success

🔄 Node Execution Results:

1. customInput (customInput-1):
   Status: success ✅
   Time: 0.501s
   Value: "Sample text input from test_input"

2. customText (customText-1):
   Status: success ✅  
   Time: 0.301s
   Processed Text: "Processing: Sample text input from test_input"

3. customLLM (customLLM-1):
   Status: success ✅
   Time: 1.502s
   Response: "[Claude-3 Response] Analyzed: 'Processing: Sample text input...'..."

4. customOutput (customOutput-1):
   Status: success ✅
   Time: 0.202s
   Format: json
   Size: 245 characters

📋 Final Outputs:

1. final_result (json):
{
  "type": "llm_response",
  "model": "Claude-3",
  "response": "[Claude-3 Response] Analyzed...",
  "confidence": 0.85
}
```

## API Endpoints

### POST /pipelines/parse
Execute a complete pipeline with validation and processing.

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "num_nodes": 4,
  "num_edges": 3,
  "is_dag": true,
  "execution_results": [...],
  "total_execution_time": 2.34,
  "status": "success"
}
```

## Development

### Adding New Node Types

1. **Backend**: Add execution logic in `execute_node()`
2. **Frontend**: Create node component extending `BaseNode`
3. **Registration**: Add to node types in `ui.js`

### Testing

```bash
# Test backend execution
cd backend
python test_execution.py

# Test full pipeline
# 1. Start both servers
# 2. Create pipeline in UI
# 3. Click "Run Pipeline"
```

## Technical Details

- **Async Processing**: Non-blocking node execution
- **Error Handling**: Graceful failure with detailed messages  
- **Data Flow**: Automatic input/output chaining between nodes
- **Performance Tracking**: Execution time measurement
- **Result Formatting**: Multiple output format support

## Future Enhancements

- Real API integrations (OpenAI, databases)
- File upload/download capabilities
- Pipeline saving/loading
- Real-time execution monitoring
- Advanced data transformations
