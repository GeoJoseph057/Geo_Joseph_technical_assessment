// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='calculator' label='Calculator' />
                <DraggableNode type='timer' label='Timer' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='dataFormat' label='Data Format' />
                <DraggableNode type='notification' label='Notification' />
            </div>
        </div>
    );
};
