import { NextRequest, NextResponse } from 'next/server';
import { ATLAS_SYSTEM_PROMPT, buildContextMessage } from '@/lib/atlas/prompt';
import { TOOL_SCHEMAS } from '@/lib/atlas/tool-schemas';
import { toolExecutors } from '@/lib/atlas/tools';
import type { AtlasBlock } from '@/lib/atlas/types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOOL_ROUNDS = 15;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<{
  content: string | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  finish_reason: string;
}> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

  const model = process.env.ATLAS_MODEL || 'anthropic/claude-sonnet-4';

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://cabinet.digitaljamaica.com',
      'X-Title': 'GoJ Cabinet Dashboard - Atlas',
    },
    body: JSON.stringify({
      model,
      messages,
      tools: TOOL_SCHEMAS.map(t => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.input_schema,
        },
      })),
      tool_choice: 'auto',
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  if (!choice) throw new Error('No response from model');

  return {
    content: choice.message.content,
    tool_calls: choice.message.tool_calls,
    finish_reason: choice.finish_reason,
  };
}

function parseBlocks(content: string): AtlasBlock[] {
  try {
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.filter((b: Record<string, unknown>) => b && typeof b.type === 'string');
    }
    return [{ type: 'text', content: cleaned }];
  } catch {
    return [{ type: 'text', content }];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages: userMessages, currentRoute, currentDate } = body;

    if (!userMessages || !Array.isArray(userMessages) || userMessages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const contextNote = buildContextMessage(currentRoute || '/dashboard', currentDate || new Date().toISOString().slice(0, 10));

    const llmMessages: OpenRouterMessage[] = [
      { role: 'system', content: ATLAS_SYSTEM_PROMPT },
      { role: 'system', content: `[Context]\n${contextNote}` },
    ];

    for (const m of userMessages) {
      llmMessages.push({ role: m.role, content: m.content });
    }

    const toolsUsed: string[] = [];
    let rounds = 0;

    while (rounds < MAX_TOOL_ROUNDS) {
      rounds++;
      const response = await callOpenRouter(llmMessages);

      if (!response.tool_calls || response.tool_calls.length === 0) {
        const content = response.content || '';
        const blocks = parseBlocks(content);
        return NextResponse.json({ content, blocks, toolsUsed });
      }

      llmMessages.push({
        role: 'assistant',
        content: response.content,
        tool_calls: response.tool_calls,
      });

      for (const tc of response.tool_calls) {
        const toolName = tc.function.name;
        toolsUsed.push(toolName);

        let result: unknown;
        try {
          const executor = toolExecutors[toolName];
          if (!executor) {
            result = { error: `Unknown tool: ${toolName}` };
          } else {
            const params = JSON.parse(tc.function.arguments || '{}');
            result = executor(params);
          }
        } catch (e) {
          result = { error: `Tool execution error: ${e instanceof Error ? e.message : 'unknown'}` };
        }

        llmMessages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }
    }

    return NextResponse.json({
      content: 'I\'ve been analyzing quite a lot of data. Here\'s what I\'ve found so far — would you like me to continue?',
      blocks: [{ type: 'callout', tone: 'info', content: 'Atlas reached its analysis limit for this question. Try asking a more specific question, or ask me to continue.' }],
      toolsUsed,
    });
  } catch (error) {
    console.error('[Atlas] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      content: 'Something went wrong.',
      blocks: [{ type: 'callout', tone: 'danger', content: process.env.NODE_ENV === 'development' ? `Atlas error: ${message}` : 'Atlas is temporarily unavailable. Try again in a moment.' }],
      toolsUsed: [],
    }, { status: 500 });
  }
}
