import sys
sys.path.append('c:/Users/91892/Downloads/Geo_Joseph_technical_assessment-1/backend')

from main import execute_calculator_node, execute_input_node, execute_output_node
import asyncio
import json

async def test_pipeline():
    try:
        # Test input nodes
        input1_node = {"id": "input_1", "type": "inputNode", "data": {"inputType": "Text", "inputName": "input_1", "inputValue": "20"}}
        input2_node = {"id": "input_2", "type": "inputNode", "data": {"inputType": "Text", "inputName": "input_2", "inputValue": "20"}}
        
        print("Testing input nodes...")
        input1_result = await execute_input_node(input1_node)
        input2_result = await execute_input_node(input2_node)
        print(f"Input 1 result: {input1_result}")
        print(f"Input 2 result: {input2_result}")
        
        # Test calculator node
        calc_node = {"id": "calculator", "type": "calculatorNode", "data": {"operation": "add"}}
        calc_input = {"input_1": input1_result, "input_2": input2_result}
        
        print("Testing calculator node...")
        calc_result = await execute_calculator_node(calc_node, calc_input)
        print(f"Calculator result: {calc_result}")
        
        # Test output node with text format
        output_node = {"id": "output_1", "type": "outputNode", "data": {"outputName": "output_1", "outputFormat": "text"}}
        
        print("Testing output node...")
        output_result = await execute_output_node(output_node, calc_result)
        print(f"Output result: {output_result}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_pipeline())
