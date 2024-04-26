import React, { useState } from 'react';

interface HighlightedPart {
    text: string;
    startOffset: number;
    endOffset: number;
}

const MyComponent = () => {
    const [highlightedParts, setHighlightedParts] = useState<HighlightedPart[]>([]);

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            const selectedText = range.toString();

            const isHighlighted = highlightedParts.some(part => part.text === selectedText);

            if (!isHighlighted) {
                const newHighlightedParts = [...highlightedParts, { text: selectedText, startOffset, endOffset }];
                setHighlightedParts(newHighlightedParts);
            }
        }
    };

    const renderHighlightedText = () => {
        const text = 'This is a sample text. Select parts of it to highlight.';
        let output = [];
        let lastIndex = 0;

        highlightedParts.forEach((part, index) => {
            const nonHighlightedText = text.slice(lastIndex, part.startOffset);
            output.push(<span key={index * 2}>{nonHighlightedText}</span>);

            const highlightedText = text.slice(part.startOffset, part.endOffset);
            output.push(<span key={index * 2 + 1} style={{ backgroundColor: 'yellow' }}>{highlightedText}</span>);

            lastIndex = part.endOffset;
        });

        const remainingText = text.slice(lastIndex);
        output.push(<span key={highlightedParts.length * 2}>{remainingText}</span>);

        return output;
    };

    return (
        <div>
            <p onMouseUp={handleSelection}>
                {renderHighlightedText()}
            </p>
        </div>
    );
};

export default MyComponent;
