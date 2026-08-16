import React from 'react';
import Markdown from 'react-markdown';
import { ChartVisualizer, WeatherVisualizer, ProductsVisualizer, FollowupVisualizer, MapVisualizer, OrderTrackerVisualizer, FormVisualizer, NavigateVisualizer } from './Visualizers';

export function MessageRenderer({ content, onSelectFollowup }: { content: string, onSelectFollowup?: (q: string) => void }) {
  // We need to parse custom JSON blocks from the markdown.
  // We can use a regex to find blocks like ```json:chart ... ```
  
  const blockRegex = /```json:(chart|weather|products|followup|map|order_tracking|form|navigate)\n([\s\S]*?)\n```/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
    }

    const type = match[1];
    const jsonStr = match[2];
    try {
      const data = JSON.parse(jsonStr);
      parts.push({ type, data });
    } catch (e) {
      // If JSON parsing fails, just render it as normal code block text
      parts.push({ type: 'text', content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.substring(lastIndex) });
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          const text = part.content.trim();
          if (!text) return null;
          return (
            <div key={index} className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-slate-900 prose-p:font-medium prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-950 prose-strong:font-bold prose-code:text-emerald-900 prose-code:bg-emerald-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-li:text-slate-900 prose-li:font-medium prose-pre:bg-slate-900 prose-pre:text-slate-100 text-slate-900">
              <Markdown>{text}</Markdown>
            </div>
          );
        } else if (part.type === 'chart') {
          return <ChartVisualizer key={index} data={part.data} />;
        } else if (part.type === 'weather') {
          return <WeatherVisualizer key={index} data={part.data} />;
        } else if (part.type === 'products') {
          return <ProductsVisualizer key={index} data={part.data} />;
        } else if (part.type === 'order_tracking') {
          return <OrderTrackerVisualizer key={index} data={part.data} />;
        } else if (part.type === 'map') {
          return <MapVisualizer key={index} data={part.data} />;
        } else if (part.type === 'form') {
          return <FormVisualizer key={index} data={part.data} />;
        } else if (part.type === 'navigate') {
          return <NavigateVisualizer key={index} data={part.data} />;
        } else if (part.type === 'followup') {
          return <FollowupVisualizer key={index} data={part.data} onSelect={onSelectFollowup} />;
        }
        return null;
      })}
    </div>
  );
}
