import { reviewCodeLocal } from '../../src/services/codeReview.js';
import { generateAIJson, isOpenAIConfigured } from '../ai/openaiClient.js';

const findingSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    line: { type: 'number' },
    codeSnippet: { type: 'string' },
    explanation: { type: 'string' },
    suggestedImprovement: { type: 'string' },
    severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
    confidence: { type: 'number' },
    language: { type: 'string' },
  },
  required: ['title', 'line', 'codeSnippet', 'explanation', 'suggestedImprovement', 'severity', 'confidence', 'language'],
};

const limitationSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    explanation: { type: 'string' },
    severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
  },
  required: ['title', 'explanation', 'severity'],
};

const statusSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    detectedLanguage: { type: 'string' },
    supportedAnalysisLevel: { type: 'string' },
    rulesExecuted: { type: 'array', items: { type: 'string' } },
    limitations: { type: 'array', items: { type: 'string' } },
  },
  required: ['detectedLanguage', 'supportedAnalysisLevel', 'rulesExecuted', 'limitations'],
};

const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    score: { type: 'number' },
    quality: { type: 'string' },
    errors: { type: 'array', items: findingSchema },
    warnings: { type: 'array', items: findingSchema },
    suggestions: { type: 'array', items: findingSchema },
    limitations: { type: 'array', items: limitationSchema },
    status: statusSchema,
  },
  required: ['summary', 'score', 'quality', 'errors', 'warnings', 'suggestions', 'limitations', 'status'],
};

function normalizeFinding(finding, type, index) {
  return {
    id: finding.id || crypto.randomUUID(),
    type,
    title: String(finding.title || `${type} ${index + 1}`),
    line: Number(finding.line || 1),
    codeSnippet: String(finding.codeSnippet || finding.snippet || ''),
    snippet: String(finding.codeSnippet || finding.snippet || ''),
    explanation: String(finding.explanation || ''),
    suggestedImprovement: String(finding.suggestedImprovement || finding.fix || ''),
    fix: String(finding.suggestedImprovement || finding.fix || ''),
    severity: ['critical', 'high', 'medium', 'low'].includes(finding.severity) ? finding.severity : 'medium',
    confidence: Number(finding.confidence ?? 70),
    language: String(finding.language || ''),
  };
}

function normalizeLimitation(limitation, index) {
  return {
    id: limitation.id || crypto.randomUUID(),
    title: String(limitation.title || `Reviewer limitation ${index + 1}`),
    explanation: String(limitation.explanation || ''),
    severity: ['critical', 'high', 'medium', 'low'].includes(limitation.severity) ? limitation.severity : 'low',
  };
}

function normalizeReview(result, fallback) {
  const errors = Array.isArray(result?.errors) ? result.errors.map((item, index) => normalizeFinding(item, 'errors', index)) : fallback.errors;
  const warnings = Array.isArray(result?.warnings) ? result.warnings.map((item, index) => normalizeFinding(item, 'warnings', index)) : fallback.warnings;
  const suggestions = Array.isArray(result?.suggestions) ? result.suggestions.map((item, index) => normalizeFinding(item, 'suggestions', index)) : fallback.suggestions;
  const limitations = Array.isArray(result?.limitations) ? result.limitations.map(normalizeLimitation) : fallback.limitations;
  const status = result?.status ?? fallback.status ?? {
    detectedLanguage: '',
    supportedAnalysisLevel: 'unknown',
    rulesExecuted: [],
    limitations: limitations.map((item) => item.explanation),
  };
  const counts = {
    errors: errors.length,
    warnings: warnings.length,
    suggestions: suggestions.length,
  };
  const score = Number(result?.score ?? Math.max(1, Math.min(10, 10 - counts.errors * 1.25 - counts.warnings * 0.5 - counts.suggestions * 0.2)).toFixed(1));

  return {
    summary: String(result?.summary || `AI review completed. Found ${counts.errors} errors, ${counts.warnings} warnings, and ${counts.suggestions} suggestions.`),
    score,
    quality: String(result?.quality || (score >= 8 ? 'Strong' : score >= 6 ? 'Needs attention' : 'High risk')),
    counts,
    errors,
    warnings,
    suggestions,
    limitations,
    status,
    provider: 'openai',
  };
}

export async function reviewCode({ code, language }) {
  const fallback = reviewCodeLocal({ code, language });

  if (!isOpenAIConfigured()) return fallback;

  try {
    const result = await generateAIJson({
      instructions: [
        'You are an expert programming instructor and code reviewer for university CS students.',
        'Review the submitted code and return JSON that matches the provided schema.',
        'Point to actual issues in the code. Do not give generic advice unless it is tied to a line or concrete snippet.',
        'Separate findings into errors, warnings, and suggestions.',
        'Reviewer limitations must go in limitations, never in warnings, and must not include a line number.',
        'Each finding must include: title, severity, confidence, language, line, codeSnippet, explanation, suggestedImprovement.',
        'Each finding must include severity: critical, high, medium, or low.',
        'Confidence must be a percentage number from 0 to 100.',
        'Use exact line numbers based on the submitted code.',
        'Do not rewrite the full code. Keep fixes as explanations or concise suggestions unless the user explicitly asks for corrected code.',
        'Return reviewer capability reporting in status.',
        'If code is correct, return empty arrays and explain that no concrete issue was found.',
      ].join('\n'),
      input: JSON.stringify({ language, code }),
      fallback,
      name: 'code_review_result',
      schema: reviewSchema,
      maxOutputTokens: 1800,
    });

    return normalizeReview(result, fallback);
  } catch (error) {
    console.warn(error instanceof Error ? error.message : error);
    return fallback;
  }
}
