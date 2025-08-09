# trunk-ignore-all(black)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from collections import defaultdict, deque
import asyncio
import json
import re
import time

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def execute_filter_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Filter node - real data filtering"""
    import pandas as pd
    
    node_data = node.get('data', {})
    filter_type = node_data.get('filterType', 'contains')
    filter_value = node_data.get('filterValue', '')
    filter_field = node_data.get('filterField', 'text')
    
    await asyncio.sleep(0.1)
    
    try:
        if isinstance(input_data, dict):
            # Filter dictionary data
            if filter_type == 'contains':
                filtered_data = {k: v for k, v in input_data.items() 
                               if filter_value.lower() in str(v).lower()}
            elif filter_type == 'equals':
                filtered_data = {k: v for k, v in input_data.items() 
                               if str(v).lower() == filter_value.lower()}
            elif filter_type == 'greater_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = {k: v for k, v in input_data.items() 
                                   if isinstance(v, (int, float)) and v > filter_num}
                except ValueError:
                    filtered_data = input_data
            elif filter_type == 'less_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = {k: v for k, v in input_data.items() 
                                   if isinstance(v, (int, float)) and v < filter_num}
                except ValueError:
                    filtered_data = input_data
            else:
                filtered_data = input_data
                
        elif isinstance(input_data, list):
            # Filter list data
            if filter_type == 'contains':
                filtered_data = [item for item in input_data 
                               if filter_value.lower() in str(item).lower()]
            elif filter_type == 'equals':
                filtered_data = [item for item in input_data 
                               if str(item).lower() == filter_value.lower()]
            elif filter_type == 'greater_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = [item for item in input_data 
                                   if isinstance(item, (int, float)) and item > filter_num]
                except ValueError:
                    filtered_data = input_data
            else:
                filtered_data = input_data
                
        elif isinstance(input_data, str):
            # Filter text data
            if filter_type == 'contains':
                filtered_data = input_data if filter_value.lower() in input_data.lower() else ""
            elif filter_type == 'equals':
                filtered_data = input_data if input_data.lower() == filter_value.lower() else ""
            elif filter_type == 'remove_words':
                words_to_remove = filter_value.split(',')
                filtered_text = input_data
                for word in words_to_remove:
                    filtered_text = filtered_text.replace(word.strip(), '')
                filtered_data = filtered_text.strip()
            elif filter_type == 'extract_numbers':
                import re
                numbers = re.findall(r'-?\d+\.?\d*', input_data)
                filtered_data = [float(n) for n in numbers if n]
            else:
                filtered_data = input_data
        else:
            filtered_data = input_data
            
        return {
            'type': 'filter',
            'filter_type': filter_type,
            'filter_value': filter_value,
            'original_data': input_data,
            'filtered_data': filtered_data,
            'items_before': len(input_data) if isinstance(input_data, (list, dict)) else 1,
            'items_after': len(filtered_data) if isinstance(filtered_data, (list, dict)) else 1 if filtered_data else 0,
            'filter_efficiency': f"{((len(filtered_data) if isinstance(filtered_data, (list, dict)) else 1 if filtered_data else 0) / (len(input_data) if isinstance(input_data, (list, dict)) else 1)) * 100:.1f}%" if input_data else "0%"
        }
        
    except Exception as e:
        return {
            'type': 'filter',
            'error': f'Filter error: {str(e)}',
            'original_data': input_data,
            'filtered_data': input_data
        }

async def execute_timer_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Timer node - add delays and timing"""
    node_data = node.get('data', {})
    delay_seconds = float(node_data.get('delay', 1.0))
    
    start_time = time.time()
    await asyncio.sleep(delay_seconds)
    end_time = time.time()
    
    return {
        'type': 'timer',
        'delay_requested': delay_seconds,
        'actual_delay': round(end_time - start_time, 3),
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time)),
        'input_data': input_data,
        'message': f'Delayed execution by {delay_seconds} seconds'
    }

async def execute_calculator_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Calculator node - perform real mathematical operations"""
    await asyncio.sleep(0.1)
    
    # Get calculation settings from node configuration
    node_data = node.get('data', {})
    operation = node_data.get('operation', 'sum')  # sum, average, multiply, etc.
    
    numbers = []
    
    # Extract numbers from various input formats
    if isinstance(input_data, dict):
        # Look for numeric values in dictionary
        for value in input_data.values():
            if isinstance(value, (int, float)):
                numbers.append(value)
            elif isinstance(value, str):
                try:
                    # Try to parse string as number
                    num = float(value)
                    numbers.append(num)
                except ValueError:
                    # Extract numbers from text using regex
                    found_numbers = re.findall(r'-?\d+\.?\d*', value)
                    numbers.extend([float(n) for n in found_numbers if n])
    elif isinstance(input_data, (int, float)):
        numbers.append(input_data)
    elif isinstance(input_data, str):
        # Extract all numbers from text
        found_numbers = re.findall(r'-?\d+\.?\d*', input_data)
        numbers = [float(n) for n in found_numbers if n]
    elif isinstance(input_data, list):
        # Handle list of numbers
        for item in input_data:
            if isinstance(item, (int, float)):
                numbers.append(item)
    
    if not numbers:
        return {
            'error': 'No numeric values found in input',
            'input_received': input_data,
            'operation': operation
        }
    
    # Perform the requested operation
    try:
        if operation == 'sum':
            result_value = sum(numbers)
        elif operation == 'add':  # Support both 'add' and 'sum'
            result_value = sum(numbers)
        elif operation == 'average' or operation == 'mean':
            result_value = sum(numbers) / len(numbers)
        elif operation == 'multiply' or operation == 'product':
            result_value = 1
            for num in numbers:
                result_value *= num
        elif operation == 'subtract':
            # For subtract, take first number and subtract all others
            result_value = numbers[0]
            for num in numbers[1:]:
                result_value -= num
        elif operation == 'divide':
            # For divide, take first number and divide by all others
            result_value = numbers[0]
            for num in numbers[1:]:
                if num == 0:
                    return {
                        'error': 'Division by zero',
                        'operation': operation,
                        'input_numbers': numbers
                    }
                result_value /= num
        elif operation == 'max':
            result_value = max(numbers)
        elif operation == 'min':
            result_value = min(numbers)
        elif operation == 'count':
            result_value = len(numbers)
        elif operation == 'median':
            sorted_numbers = sorted(numbers)
            n = len(sorted_numbers)
            if n % 2 == 0:
                result_value = (sorted_numbers[n//2 - 1] + sorted_numbers[n//2]) / 2
            else:
                result_value = sorted_numbers[n//2]
        elif operation == 'range':
            result_value = max(numbers) - min(numbers)
        else:
            # Default to sum if operation not recognized
            result_value = sum(numbers)
            operation = 'sum (default)'
        
        return {
            'operation': operation,
            'result': result_value,
            'input_numbers': numbers,
            'count': len(numbers),
            'statistics': {
                'sum': sum(numbers),
                'average': sum(numbers) / len(numbers),
                'max': max(numbers),
                'min': min(numbers),
                'count': len(numbers)
            }
        }
        
    except Exception as e:
        return {
            'error': f'Calculation error: {str(e)}',
            'operation': operation,
            'input_numbers': numbers
        }

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class NodeResult(BaseModel):
    node_id: str
    node_type: str
    status: str
    output: Any
    error: Optional[str] = None
    execution_time: float

class PipelineResult(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    execution_results: List[NodeResult]
    total_execution_time: float
    status: str

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.get('/setup')
def get_setup_info():
    """Get setup information for real AI functionality"""
    import os
    
    openai_configured = bool(os.getenv('OPENAI_API_KEY'))
    ollama_available = False
    
    try:
        import requests
        response = requests.get('http://localhost:11434/api/tags', timeout=2)
        ollama_available = response.status_code == 200
    except:
        pass
    
    return {
        'status': 'ready',
        'ai_providers': {
            'openai': {
                'configured': openai_configured,
                'setup_instructions': 'Set OPENAI_API_KEY environment variable with your OpenAI API key'
            },
            'ollama': {
                'available': ollama_available,
                'setup_instructions': 'Install Ollama and run: ollama pull llama2'
            }
        },
        'features': {
            'real_llm_processing': openai_configured or ollama_available,
            'advanced_text_analysis': True,
            'mathematical_calculations': True,
            'data_processing': True
        }
    }

@app.post('/configure')
def configure_api_key(request: dict):
    """Configure API keys (temporary - for development only)"""
    import os
    
    if 'openai_key' in request:
        os.environ['OPENAI_API_KEY'] = request['openai_key']
        return {'message': 'OpenAI API key configured successfully', 'status': 'success'}
    
    return {'message': 'No valid configuration provided', 'status': 'error'}

def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)
    using Kahn's algorithm (topological sorting)
    """
    if not nodes:
        return True

    # Create adjacency list and in-degree count
    graph = defaultdict(list)
    in_degree = defaultdict(int)

    # Initialize all nodes with in-degree 0
    for node in nodes:
        in_degree[node['id']] = 0

    # Build graph and calculate in-degrees
    for edge in edges:
        source = edge['source']
        target = edge['target']
        graph[source].append(target)
        in_degree[target] += 1

    # Find all nodes with no incoming edges
    queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
    processed_count = 0

    # Process nodes with no incoming edges
    while queue:
        current = queue.popleft()
        processed_count += 1

        # Remove edges from current node and update in-degrees
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we processed all nodes, it's a DAG
    return processed_count == len(nodes)

def get_topological_order(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[str]:
    """
    Get the topological order of nodes for execution
    """
    if not nodes:
        return []

    graph = defaultdict(list)
    in_degree = defaultdict(int)

    # Initialize all nodes
    for node in nodes:
        in_degree[node['id']] = 0

    # Build graph
    for edge in edges:
        source = edge['source']
        target = edge['target']
        graph[source].append(target)
        in_degree[target] += 1

    # Topological sort
    queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
    result = []

    while queue:
        current = queue.popleft()
        result.append(current)

        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result

async def execute_input_node(node: Dict[str, Any]) -> Any:
    """Execute an Input node - use actual user-provided data"""
    node_data = node.get('data', {})
    input_type = node_data.get('inputType', 'Text')
    input_name = node_data.get('inputName', 'input')
    
    # Get the actual user input value if provided
    user_input = node_data.get('inputValue', '')
    
    await asyncio.sleep(0.1)  # Minimal processing time for real input
    
    if input_type.lower() == 'file':
        # For file type, treat the input as file content
        return {
            'type': 'file',
            'name': f'{input_name}.txt',
            'content': user_input if user_input else 'No file content provided',
            'size': len(user_input) if user_input else 0
        }
    elif input_type.lower() == 'text':
        return {
            'type': 'text',
            'value': user_input if user_input else f'No input provided for {input_name}',
            'length': len(user_input) if user_input else 0
        }
    elif input_type.lower() == 'number':
        try:
            numeric_value = float(user_input) if user_input else 0
            return {
                'type': 'number',
                'value': numeric_value,
                'original_input': user_input
            }
        except ValueError:
            return {
                'type': 'number',
                'value': 0,
                'error': f'Invalid number format: {user_input}',
                'original_input': user_input
            }
    else:
        return {
            'type': input_type.lower(),
            'value': user_input if user_input else f'No {input_type} data provided',
            'original_input': user_input
        }

async def execute_text_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Text node - perform real advanced text processing"""
    import re
    
    node_data = node.get('data', {})
    text_content = node_data.get('text', 'Processing: {{input}}')

    await asyncio.sleep(0.1)

    # Real variable substitution with multiple patterns
    processed_text = text_content
    
    if input_data:
        # Handle different input data formats
        if isinstance(input_data, dict):
            input_value = input_data.get('value', input_data.get('content', str(input_data)))
        else:
            input_value = str(input_data)
        
        # Replace common variable patterns
        processed_text = processed_text.replace('{{input}}', str(input_value))
        processed_text = processed_text.replace('{input}', str(input_value))
        processed_text = processed_text.replace('$input', str(input_value))
        
        # Extract and replace custom variables like {{variable_name}}
        variables = re.findall(r'\{\{(\w+)\}\}', processed_text)
        for var in variables:
            if var != 'input' and isinstance(input_data, dict) and var in input_data:
                processed_text = processed_text.replace(f'{{{{{var}}}}}', str(input_data[var]))
    
    # Advanced text analysis and operations
    words = processed_text.split()
    sentences = re.split(r'[.!?]+', processed_text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Sentiment analysis (basic)
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best', 'happy', 'joy', 'success', 'beautiful', 'perfect']
    negative_words = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'sad', 'angry', 'fail', 'error', 'problem', 'issue', 'wrong']
    
    positive_count = sum(1 for word in words if word.lower() in positive_words)
    negative_count = sum(1 for word in words if word.lower() in negative_words)
    
    if positive_count > negative_count:
        sentiment = 'positive'
        sentiment_score = (positive_count - negative_count) / len(words) if words else 0
    elif negative_count > positive_count:
        sentiment = 'negative'
        sentiment_score = (negative_count - positive_count) / len(words) if words else 0
    else:
        sentiment = 'neutral'
        sentiment_score = 0.0
    
    # Extract entities (basic)
    entities = {
        'emails': re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', processed_text),
        'urls': re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', processed_text),
        'phone_numbers': re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', processed_text),
        'dates': re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', processed_text),
        'numbers': re.findall(r'\b\d+\.?\d*\b', processed_text)
    }
    
    # Text statistics
    char_count = len(processed_text)
    word_count = len(words)
    sentence_count = len(sentences)
    paragraph_count = len([p for p in processed_text.split('\n\n') if p.strip()])
    
    avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
    avg_sentence_length = word_count / sentence_count if sentence_count else 0
    
    # Reading level (basic Flesch reading ease approximation)
    if sentence_count > 0 and word_count > 0:
        reading_score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * (avg_word_length / 4.7))
        if reading_score >= 90:
            reading_level = "Very Easy"
        elif reading_score >= 80:
            reading_level = "Easy"
        elif reading_score >= 70:
            reading_level = "Fairly Easy"
        elif reading_score >= 60:
            reading_level = "Standard"
        elif reading_score >= 50:
            reading_level = "Fairly Difficult"
        elif reading_score >= 30:
            reading_level = "Difficult"
        else:
            reading_level = "Very Difficult"
    else:
        reading_score = 0
        reading_level = "Unknown"

    return {
        'type': 'text',
        'original': text_content,
        'processed': processed_text,
        'statistics': {
            'char_count': char_count,
            'word_count': word_count,
            'sentence_count': sentence_count,
            'paragraph_count': paragraph_count,
            'avg_word_length': round(avg_word_length, 2),
            'avg_sentence_length': round(avg_sentence_length, 2)
        },
        'sentiment': {
            'sentiment': sentiment,
            'score': round(sentiment_score, 3),
            'positive_words': positive_count,
            'negative_words': negative_count
        },
        'entities': entities,
        'readability': {
            'flesch_score': round(reading_score, 1),
            'reading_level': reading_level
        },
        'operations': {
            'uppercase': processed_text.upper(),
            'lowercase': processed_text.lower(),
            'title_case': processed_text.title(),
            'word_count': word_count,
            'char_count': char_count,
            'line_count': len(processed_text.split('\n'))
        },
        'variables_found': re.findall(r'\{\{(\w+)\}\}', text_content)
    }

async def execute_llm_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute an LLM node - real AI processing using OpenAI or Ollama"""
    import os
    
    node_data = node.get('data', {})
    model = node_data.get('model', 'gpt-3.5-turbo')
    
    # Get content from input data
    if input_data:
        if isinstance(input_data, dict):
            content = input_data.get('processed', input_data.get('value', str(input_data)))
        else:
            content = str(input_data)
    else:
        content = "No input provided"
    
    try:
        # Try OpenAI first
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            try:
                import openai
                client = openai.OpenAI(api_key=openai_key)
                
                response = client.chat.completions.create(
                    model=model if model in ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] else 'gpt-3.5-turbo',
                    messages=[
                        {"role": "system", "content": "You are a helpful AI assistant. Provide comprehensive, accurate, and useful responses."},
                        {"role": "user", "content": content}
                    ],
                    max_tokens=1000,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content
                return {
                    'type': 'llm_response',
                    'model': model,
                    'response': ai_response,
                    'input_tokens': response.usage.prompt_tokens,
                    'output_tokens': response.usage.completion_tokens,
                    'total_tokens': response.usage.total_tokens,
                    'provider': 'openai'
                }
            except Exception as e:
                print(f"OpenAI API error: {e}")
        
        # Fallback to Ollama (local)
        try:
            import requests
            ollama_response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'llama2',  # or another model you have installed
                    'prompt': content,
                    'stream': False
                },
                timeout=30
            )
            
            if ollama_response.status_code == 200:
                result = ollama_response.json()
                return {
                    'type': 'llm_response',
                    'model': 'llama2',
                    'response': result.get('response', 'No response generated'),
                    'input_tokens': len(content.split()),
                    'output_tokens': len(result.get('response', '').split()),
                    'provider': 'ollama'
                }
        except Exception as e:
            print(f"Ollama error: {e}")
        
        # If all else fails, use a more intelligent fallback
        await asyncio.sleep(0.5)
        
        # Create a more intelligent response based on the input
        if 'medical' in content.lower() or 'health' in content.lower():
            response = f"Based on your query about '{content}', here are key insights about AI in healthcare: AI is revolutionizing medical diagnostics through image analysis, drug discovery through molecular modeling, personalized treatment plans using patient data analysis, and predictive analytics for early disease detection. Key applications include radiology AI for faster scan interpretation, AI-powered surgical robots for precision procedures, and machine learning algorithms for genomic analysis."
        elif 'technology' in content.lower() or 'ai' in content.lower():
            response = f"Regarding '{content}': Artificial Intelligence encompasses machine learning, natural language processing, computer vision, and robotics. Current applications span from autonomous vehicles and smart assistants to predictive analytics and automated decision-making systems. The technology continues to evolve with advances in neural networks, deep learning, and large language models."
        elif 'business' in content.lower() or 'market' in content.lower():
            response = f"In response to '{content}': AI is transforming business operations through automation, data analytics, customer service chatbots, and predictive modeling. Companies are leveraging AI for supply chain optimization, fraud detection, personalized marketing, and operational efficiency improvements."
        else:
            response = f"Thank you for your query: '{content}'. This appears to be a request for information analysis. Based on the content, I can provide relevant insights, explanations, or analysis. Please note that for more advanced AI processing, consider setting up OpenAI API keys or running a local Ollama instance."
        
        return {
            'type': 'llm_response',
            'model': 'intelligent-fallback',
            'response': response,
            'input_tokens': len(content.split()),
            'output_tokens': len(response.split()),
            'provider': 'fallback',
            'note': 'Using intelligent fallback. For real AI, configure OpenAI API key or Ollama.'
        }
        
    except Exception as e:
        return {
            'type': 'llm_response',
            'model': model,
            'response': f"Error processing request: {str(e)}",
            'error': str(e),
            'provider': 'error'
        }

async def execute_output_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute an Output node - format and prepare final output"""
    node_data = node.get('data', {})
    output_name = node_data.get('outputName', 'output')
    output_format = node_data.get('outputFormat', 'json')

    await asyncio.sleep(0.2)

    if not input_data:
        return {'error': 'No input data to output'}

    # Format output based on selected format
    if output_format == 'json':
        formatted_output = json.dumps(input_data, indent=2)
    elif output_format == 'csv':
        if isinstance(input_data, dict):
            headers = list(input_data.keys())
            values = list(input_data.values())
            formatted_output = ','.join(headers) + '\n' + ','.join(str(v) for v in values)
        else:
            formatted_output = f'value\n{input_data}'
    elif output_format == 'xml':
        if isinstance(input_data, dict):
            xml_parts = ['<output>']
            for k, v in input_data.items():
                xml_parts.append(f'  <{k}>{v}</{k}>')
            xml_parts.append('</output>')
            formatted_output = '\n'.join(xml_parts)
        else:
            formatted_output = f'<output><value>{input_data}</value></output>'
    else:
        formatted_output = str(input_data)

    return {
        'type': 'output',
        'name': output_name,
        'format': output_format,
        'data': formatted_output,
        'size': len(formatted_output)
    }

async def execute_calculator_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Calculator node - perform real mathematical operations"""
    await asyncio.sleep(0.1)
    
    # Get calculation settings from node configuration
    node_data = node.get('data', {})
    operation = node_data.get('operation', 'sum')  # sum, average, multiply, etc.
    
    numbers = []
    
    # Extract numbers from various input formats
    if isinstance(input_data, dict):
        # Look for numeric values in dictionary
        for value in input_data.values():
            if isinstance(value, (int, float)):
                numbers.append(value)
            elif isinstance(value, str):
                try:
                    # Try to parse string as number
                    num = float(value)
                    numbers.append(num)
                except ValueError:
                    # Extract numbers from text using regex
                    found_numbers = re.findall(r'-?\d+\.?\d*', value)
                    numbers.extend([float(n) for n in found_numbers if n])
    elif isinstance(input_data, (int, float)):
        numbers.append(input_data)
    elif isinstance(input_data, str):
        # Extract all numbers from text
        found_numbers = re.findall(r'-?\d+\.?\d*', input_data)
        numbers = [float(n) for n in found_numbers if n]
    elif isinstance(input_data, list):
        # Handle list of numbers
        for item in input_data:
            if isinstance(item, (int, float)):
                numbers.append(item)
    
    if not numbers:
        return {
            'error': 'No numeric values found in input',
            'input_received': input_data,
            'operation': operation
        }
    
    # Perform the requested operation
    try:
        if operation == 'sum':
            result_value = sum(numbers)
        elif operation == 'add':  # Support both 'add' and 'sum'
            result_value = sum(numbers)
        elif operation == 'average' or operation == 'mean':
            result_value = sum(numbers) / len(numbers)
        elif operation == 'multiply' or operation == 'product':
            result_value = 1
            for num in numbers:
                result_value *= num
        elif operation == 'subtract':
            # For subtract, take first number and subtract all others
            result_value = numbers[0]
            for num in numbers[1:]:
                result_value -= num
        elif operation == 'divide':
            # For divide, take first number and divide by all others
            result_value = numbers[0]
            for num in numbers[1:]:
                if num == 0:
                    return {
                        'error': 'Division by zero',
                        'operation': operation,
                        'input_numbers': numbers
                    }
                result_value /= num
        elif operation == 'max':
            result_value = max(numbers)
        elif operation == 'min':
            result_value = min(numbers)
        elif operation == 'count':
            result_value = len(numbers)
        elif operation == 'median':
            sorted_numbers = sorted(numbers)
            n = len(sorted_numbers)
            if n % 2 == 0:
                result_value = (sorted_numbers[n//2 - 1] + sorted_numbers[n//2]) / 2
            else:
                result_value = sorted_numbers[n//2]
        elif operation == 'range':
            result_value = max(numbers) - min(numbers)
        else:
            # Default to sum if operation not recognized
            result_value = sum(numbers)
            operation = 'sum (default)'
        
        return {
            'operation': operation,
            'result': result_value,
            'input_numbers': numbers,
            'count': len(numbers),
            'statistics': {
                'sum': sum(numbers),
                'average': sum(numbers) / len(numbers),
                'max': max(numbers),
                'min': min(numbers),
                'count': len(numbers)
            }
        }
        
    except Exception as e:
        return {
            'error': f'Calculation error: {str(e)}',
            'operation': operation,
            'input_numbers': numbers
        }

async def execute_filter_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Filter node - real data filtering"""
    import pandas as pd
    
    node_data = node.get('data', {})
    filter_type = node_data.get('filterType', 'contains')
    filter_value = node_data.get('filterValue', '')
    filter_field = node_data.get('filterField', 'text')
    
    await asyncio.sleep(0.1)
    
    try:
        if isinstance(input_data, dict):
            # Filter dictionary data
            if filter_type == 'contains':
                filtered_data = {k: v for k, v in input_data.items() 
                               if filter_value.lower() in str(v).lower()}
            elif filter_type == 'equals':
                filtered_data = {k: v for k, v in input_data.items() 
                               if str(v).lower() == filter_value.lower()}
            elif filter_type == 'greater_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = {k: v for k, v in input_data.items() 
                                   if isinstance(v, (int, float)) and v > filter_num}
                except ValueError:
                    filtered_data = input_data
            elif filter_type == 'less_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = {k: v for k, v in input_data.items() 
                                   if isinstance(v, (int, float)) and v < filter_num}
                except ValueError:
                    filtered_data = input_data
            else:
                filtered_data = input_data
                
        elif isinstance(input_data, list):
            # Filter list data
            if filter_type == 'contains':
                filtered_data = [item for item in input_data 
                               if filter_value.lower() in str(item).lower()]
            elif filter_type == 'equals':
                filtered_data = [item for item in input_data 
                               if str(item).lower() == filter_value.lower()]
            elif filter_type == 'greater_than':
                try:
                    filter_num = float(filter_value)
                    filtered_data = [item for item in input_data 
                                   if isinstance(item, (int, float)) and item > filter_num]
                except ValueError:
                    filtered_data = input_data
            else:
                filtered_data = input_data
                
        elif isinstance(input_data, str):
            # Filter text data
            if filter_type == 'contains':
                filtered_data = input_data if filter_value.lower() in input_data.lower() else ""
            elif filter_type == 'equals':
                filtered_data = input_data if input_data.lower() == filter_value.lower() else ""
            elif filter_type == 'remove_words':
                words_to_remove = filter_value.split(',')
                filtered_text = input_data
                for word in words_to_remove:
                    filtered_text = filtered_text.replace(word.strip(), '')
                filtered_data = filtered_text.strip()
            elif filter_type == 'extract_numbers':
                import re
                numbers = re.findall(r'-?\d+\.?\d*', input_data)
                filtered_data = [float(n) for n in numbers if n]
            else:
                filtered_data = input_data
        else:
            filtered_data = input_data
            
        return {
            'type': 'filter',
            'filter_type': filter_type,
            'filter_value': filter_value,
            'original_data': input_data,
            'filtered_data': filtered_data,
            'items_before': len(input_data) if isinstance(input_data, (list, dict)) else 1,
            'items_after': len(filtered_data) if isinstance(filtered_data, (list, dict)) else 1 if filtered_data else 0,
            'filter_efficiency': f"{((len(filtered_data) if isinstance(filtered_data, (list, dict)) else 1 if filtered_data else 0) / (len(input_data) if isinstance(input_data, (list, dict)) else 1)) * 100:.1f}%" if input_data else "0%"
        }
        
    except Exception as e:
        return {
            'type': 'filter',
            'error': f'Filter error: {str(e)}',
            'original_data': input_data,
            'filtered_data': input_data
        }

async def execute_timer_node(node: Dict[str, Any], input_data: Any) -> Any:
    """Execute a Timer node - add delays and timing"""
    node_data = node.get('data', {})
    delay_seconds = float(node_data.get('delay', 1.0))
    
    start_time = time.time()
    await asyncio.sleep(delay_seconds)
    end_time = time.time()
    
    return {
        'type': 'timer',
        'delay_requested': delay_seconds,
        'actual_delay': round(end_time - start_time, 3),
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time)),
        'input_data': input_data,
        'message': f'Delayed execution by {delay_seconds} seconds'
    }

async def execute_node(node: Dict[str, Any], input_data: Any = None) -> NodeResult:
    """Execute a single node based on its type"""
    start_time = time.time()
    node_id = node['id']
    node_type = node['type']

    try:
        if 'input' in node_type.lower() or 'custominput' in node_id.lower():
            result = await execute_input_node(node)
        elif 'text' in node_type.lower() or 'text' in node_id.lower():
            result = await execute_text_node(node, input_data)
        elif 'llm' in node_type.lower() or 'llm' in node_id.lower():
            result = await execute_llm_node(node, input_data)
        elif 'output' in node_type.lower() or 'output' in node_id.lower():
            result = await execute_output_node(node, input_data)
        elif 'calculator' in node_type.lower() or 'calculator' in node_id.lower():
            result = await execute_calculator_node(node, input_data)
        elif 'filter' in node_type.lower() or 'filter' in node_id.lower():
            result = await execute_filter_node(node, input_data)
        elif 'timer' in node_type.lower() or 'timer' in node_id.lower():
            result = await execute_timer_node(node, input_data)
        else:
            # Generic node processing
            await asyncio.sleep(0.2)
            result = {
                'type': 'generic',
                'processed_input': input_data,
                'node_type': node_type
            }

        execution_time = time.time() - start_time

        return NodeResult(
            node_id=node_id,
            node_type=node_type,
            status='success',
            output=result,
            execution_time=execution_time
        )

    except Exception as e:
        execution_time = time.time() - start_time
        return NodeResult(
            node_id=node_id,
            node_type=node_type,
            status='error',
            output=None,
            error=str(e),
            execution_time=execution_time
        )

async def execute_pipeline(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[NodeResult]:
    """Execute the entire pipeline in topological order"""
    execution_order = get_topological_order(nodes, edges)
    node_outputs = {}
    results = []

    # Create node lookup
    node_lookup = {node['id']: node for node in nodes}

    # Create edge lookup for getting inputs
    input_edges = defaultdict(list)
    for edge in edges:
        input_edges[edge['target']].append(edge['source'])

    # Execute nodes in topological order
    for node_id in execution_order:
        if node_id not in node_lookup:
            continue

        node = node_lookup[node_id]

        # Get input data from predecessor nodes
        input_data = None
        input_sources = input_edges[node_id]

        if input_sources:
            if len(input_sources) == 1:
                # Single input
                source_id = input_sources[0]
                input_data = node_outputs.get(source_id)
            else:
                # Multiple inputs - combine them
                input_data = {}
                for source_id in input_sources:
                    source_output = node_outputs.get(source_id)
                    if source_output:
                        input_data[source_id] = source_output

        # Execute the node
        result = await execute_node(node, input_data)
        results.append(result)

        # Store output for downstream nodes
        if result.status == 'success':
            node_outputs[node_id] = result.output

    return results

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline_data: PipelineData):
    """
    Parse and execute the pipeline, returning statistics and execution results
    """
    start_time = time.time()

    try:
        nodes = pipeline_data.nodes
        edges = pipeline_data.edges

        num_nodes = len(nodes)
        num_edges = len(edges)
        dag_check = is_dag(nodes, edges)

        if not dag_check:
            return PipelineResult(
                num_nodes=num_nodes,
                num_edges=num_edges,
                is_dag=False,
                execution_results=[],
                total_execution_time=0,
                status="error: Pipeline contains cycles"
            )

        # Execute the pipeline
        execution_results = await execute_pipeline(nodes, edges)
        total_time = time.time() - start_time

        # Determine overall status
        failed_nodes = [r for r in execution_results if r.status == 'error']
        overall_status = 'success' if not failed_nodes else f'partial_success ({len(failed_nodes)} nodes failed)'

        return PipelineResult(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=dag_check,
            execution_results=execution_results,
            total_execution_time=total_time,
            status=overall_status
        )

    except Exception as e:
        total_time = time.time() - start_time
        raise HTTPException(status_code=400, detail=f"Error processing pipeline: {str(e)}") from e