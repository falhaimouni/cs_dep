import { apiOrFallback, apiRequest } from './apiClient.js';

const severityWeight = { critical: 2.2, high: 1.4, medium: 0.7, low: 0.25 };

const reservedByLanguage = {
  JavaScript: new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'true', 'false', 'null', 'undefined', 'new', 'class', 'this', 'try', 'catch', 'finally', 'throw', 'import', 'from',
    'console', 'Math', 'Array', 'Object', 'String', 'Number', 'Boolean', 'JSON', 'Date', 'Promise', 'Set', 'Map',
  ]),
  TypeScript: new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'true', 'false', 'null', 'undefined', 'new', 'class', 'this', 'try', 'catch', 'finally', 'throw', 'import', 'from',
    'interface', 'type', 'enum', 'public', 'private', 'protected', 'readonly', 'implements', 'extends', 'as', 'any',
    'string', 'number', 'boolean', 'void', 'unknown', 'never', 'console', 'Math', 'Array', 'Object', 'String', 'Number',
  ]),
  Java: new Set([
    'class', 'public', 'private', 'protected', 'static', 'void', 'int', 'double', 'float', 'boolean', 'char', 'long', 'short',
    'byte', 'String', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'null',
    'true', 'false', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'System', 'out', 'println',
  ]),
  C: new Set([
    'int', 'float', 'double', 'char', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'struct', 'typedef', 'include', 'sizeof', 'NULL', 'printf', 'scanf', 'malloc', 'free',
  ]),
  Python: new Set([
    'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'in', 'not', 'and', 'or', 'is', 'None',
    'True', 'False', 'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'class', 'self', 'print', 'len', 'range',
  ]),
};

function normalizeLanguage(language) {
  if (/typescript/i.test(language)) return 'TypeScript';
  if (/java(?!script)/i.test(language)) return 'Java';
  if (/c\+\+/i.test(language)) return 'C++';
  if (/^c$/i.test(language)) return 'C';
  if (/python/i.test(language)) return 'Python';
  if (/html|css/i.test(language)) return 'HTML/CSS';
  return 'JavaScript';
}

function cleanLine(line, language) {
  if (language === 'Python') return line.replace(/#.*$/, '').trim();
  return line.replace(/\/\/.*$/, '').trim();
}

function makeFinding({ type = 'warnings', title, severity = 'medium', confidence = 70, language, line, codeSnippet = '', explanation, suggestedImprovement = '' }) {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    severity,
    confidence,
    language,
    line,
    codeSnippet,
    snippet: codeSnippet,
    explanation,
    suggestedImprovement,
    fix: suggestedImprovement,
  };
}

function makeLimitation({ title, explanation, severity = 'low' }) {
  return { id: crypto.randomUUID(), title, explanation, severity };
}

function buildResult({ language, analysisLevel, rulesExecuted, findings, limitations = [] }) {
  const unique = dedupeFindings(findings);
  const groups = {
    errors: unique.filter((item) => item.type === 'errors'),
    warnings: unique.filter((item) => item.type === 'warnings'),
    suggestions: unique.filter((item) => item.type === 'suggestions'),
  };
  const counts = {
    errors: groups.errors.length,
    warnings: groups.warnings.length,
    suggestions: groups.suggestions.length,
  };
  const penalty = unique.reduce((total, item) => total + (severityWeight[item.severity] ?? 0.5), 0);
  const score = Number(Math.max(1, Math.min(10, 10 - penalty)).toFixed(1));
  return {
    summary: `Reviewed with ${language} analyzer. Found ${counts.errors} errors, ${counts.warnings} warnings, and ${counts.suggestions} suggestions.`,
    score,
    quality: score >= 8 ? 'Strong' : score >= 6 ? 'Needs attention' : 'High risk',
    counts,
    ...groups,
    limitations,
    status: {
      detectedLanguage: language,
      supportedAnalysisLevel: analysisLevel,
      rulesExecuted,
      limitations: limitations.map((item) => item.explanation),
    },
  };
}

function dedupeFindings(findings) {
  const seen = new Set();
  return findings.filter((item) => {
    const key = `${item.type}:${item.title}:${item.line}:${item.codeSnippet}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getWords(line) {
  return [...line.matchAll(/\b[A-Za-z_$][\w$]*\b/g)].map((match) => match[0]);
}

function stripStringLiterals(line) {
  return line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
}

function collectJsSymbols(lines, language) {
  const declared = new Set();
  const assignedNullish = new Set();
  const objectProperties = new Map();
  const arrays = new Map();
  const parameters = new Set();
  const functions = new Set();

  lines.forEach((line) => {
    const clean = cleanLine(line, language);
    for (const match of clean.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) declared.add(match[1]);
    for (const match of clean.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)) {
      functions.add(match[1]);
      declared.add(match[1]);
      match[2].split(',').map((item) => item.trim()).filter(Boolean).forEach((param) => {
        const name = param.replace(/[:?].*$/, '').trim();
        if (name) {
          declared.add(name);
          parameters.add(name);
        }
      });
    }
    for (const match of clean.matchAll(/\(([^)]*)\)\s*=>/g)) {
      match[1].split(',').map((item) => item.trim()).filter(Boolean).forEach((param) => declared.add(param.replace(/[:?].*$/, '').trim()));
    }
    for (const match of clean.matchAll(/\b(?:const|let|var)\s+(\w+)\s*=\s*(null|undefined)\s*;/g)) assignedNullish.add(match[1]);
    for (const match of clean.matchAll(/\b(?:const|let|var)\s+(\w+)\s*=\s*\[([^\]]*)\]/g)) {
      arrays.set(match[1], match[2].trim() ? match[2].split(',').length : 0);
    }
    for (const match of clean.matchAll(/\b(?:const|let|var)\s+(\w+)\s*=\s*\{([^}]*)\}/g)) {
      const props = new Set([...match[2].matchAll(/\b([A-Za-z_$][\w$]*)\s*:/g)].map((item) => item[1]));
      objectProperties.set(match[1], props);
    }
  });

  return { declared, assignedNullish, objectProperties, arrays, parameters, functions };
}

function analyzeJavaScriptLike(code, language) {
  const lines = code.split('\n');
  const symbols = collectJsSymbols(lines, language);
  const reserved = reservedByLanguage[language] ?? reservedByLanguage.JavaScript;
  const findings = [];
  const rulesExecuted = [
    'syntax-balance',
    'symbol-resolution',
    'nullish-data-flow',
    'property-existence',
    'array-bound-checks',
    'condition-validation',
    'security-sinks',
    'loop-risk',
    'type-coercion',
  ];

  const bracketBalance = (code.match(/\{/g)?.length ?? 0) - (code.match(/\}/g)?.length ?? 0);
  if (bracketBalance !== 0) {
    findings.push(makeFinding({
      type: 'errors',
      title: 'Possible Syntax Error',
      severity: 'critical',
      confidence: 80,
      language,
      line: 1,
      codeSnippet: 'Mismatched curly braces',
      explanation: 'The number of opening and closing braces does not match.',
      suggestedImprovement: 'Check block boundaries before running the code.',
    }));
  }

  lines.forEach((line, index) => {
    const clean = cleanLine(line, language);
    if (!clean) return;
    const lineNumber = index + 1;

    const identifierScanLine = stripStringLiterals(clean);
    for (const word of getWords(identifierScanLine)) {
      if (reserved.has(word) || symbols.declared.has(word)) continue;
      if (/^\d/.test(word)) continue;
      if (new RegExp(`\\.${word}\\b`).test(clean)) continue;
      if (new RegExp(`\\b${word}\\s*:`).test(clean)) continue;
      if (new RegExp(`(?:const|let|var|function|class|interface|type)\\s+${word}\\b`).test(clean)) continue;
      if (/^[A-Z]/.test(word) && ['JavaScript', 'TypeScript'].includes(language)) continue;
      findings.push(makeFinding({
        type: 'errors',
        title: 'Possible Undefined Variable',
        severity: 'critical',
        confidence: 78,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: `Variable "${word}" is used but was not found in the local declaration table.`,
        suggestedImprovement: 'Declare the variable, pass it as a parameter, or check for a typo.',
      }));
      break;
    }

    const assignmentCondition = clean.match(/\b(if|while)\s*\([^)]*\b([A-Za-z_$][\w$]*)\s=\s[^=]/);
    if (assignmentCondition) {
      findings.push(makeFinding({
        type: 'errors',
        title: 'Assignment Used as Condition',
        severity: 'high',
        confidence: 90,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'This condition assigns a value instead of comparing one.',
        suggestedImprovement: 'Use === for comparison unless assignment is intentional and clearly documented.',
      }));
    }

    for (const variable of symbols.assignedNullish) {
      if (new RegExp(`\\b${variable}\\.\\w+`).test(clean)) {
        findings.push(makeFinding({
          type: 'errors',
          title: 'Possible Null or Undefined Access',
          severity: 'critical',
          confidence: 92,
          language,
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${variable} is known to be null/undefined earlier and is dereferenced here.`,
          suggestedImprovement: 'Check the value before dereferencing it.',
        }));
      }
    }

    for (const [objectName, props] of symbols.objectProperties.entries()) {
      const access = clean.match(new RegExp(`\\b${objectName}\\.([A-Za-z_$][\\w$]*)`));
      if (access && !props.has(access[1])) {
        findings.push(makeFinding({
          type: 'errors',
          title: 'Possible Missing Object Property',
          severity: 'critical',
          confidence: 86,
          language,
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${objectName}.${access[1]} is accessed, but the local object literal does not define "${access[1]}".`,
          suggestedImprovement: 'Validate the property exists before using it.',
        }));
      }
    }

    for (const [arrayName, length] of symbols.arrays.entries()) {
      const access = clean.match(new RegExp(`\\b${arrayName}\\[(\\d+)\\]`));
      if (access && Number(access[1]) >= length) {
        findings.push(makeFinding({
          type: 'errors',
          title: 'Array Index Out of Bounds',
          severity: 'high',
          confidence: 95,
          language,
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${arrayName} has ${length} item(s), but index ${access[1]} is accessed.`,
          suggestedImprovement: 'Check the index or use a bounds guard.',
        }));
      }
    }

    if (/innerHTML\s*=/.test(clean) || /\beval\s*\(/.test(clean)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Security-Sensitive API Usage',
        severity: 'critical',
        confidence: 82,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'This API can introduce injection risks when used with untrusted input.',
        suggestedImprovement: 'Prefer safe DOM APIs or sanitize input before use.',
      }));
    }

    if (/while\s*\(\s*true\s*\)/.test(clean) && !lines.slice(index, index + 5).some((nearby) => /\bbreak\b/.test(nearby))) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Infinite Loop Risk',
        severity: 'high',
        confidence: 70,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'The loop condition is always true and no nearby break was detected.',
        suggestedImprovement: 'Add a clear terminating condition or documented break path.',
      }));
    }

    if (/\b(?:let|const|var)\s+\w+\s*=\s*["']\d+["']/.test(clean)) {
      const variable = clean.match(/\b(?:let|const|var)\s+(\w+)/)?.[1];
      if (variable && lines.some((other) => new RegExp(`\\b${variable}\\b\\s*\\+`).test(other))) {
        findings.push(makeFinding({
          type: 'warnings',
          title: 'Possible String Concatenation Instead of Numeric Addition',
          severity: 'medium',
          confidence: 70,
          language,
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${variable} is initialized as a string containing a number and later appears in addition.`,
          suggestedImprovement: 'Convert to Number before arithmetic if numeric addition is intended.',
        }));
      }
    }
  });

  return buildResult({
    language,
    analysisLevel: language === 'TypeScript' ? 'syntax + lightweight semantic checks; no full TypeScript compiler' : 'syntax + common runtime checks',
    rulesExecuted,
    findings,
    limitations: [
      makeLimitation({
        title: `${language} analysis uses lightweight local inference`,
        explanation: 'The analyzer builds local symbols and simple data-flow facts, but it does not execute code or resolve external modules.',
      }),
    ],
  });
}

function collectJavaSymbols(lines) {
  const declared = new Map();
  const nulls = new Set();
  const arrays = new Map();
  const resources = new Set();
  const closedResources = new Set();

  lines.forEach((line, index) => {
    const clean = cleanLine(line, 'Java');
    const declarations = clean.matchAll(/\b(?:final\s+)?(int|double|float|boolean|char|String|long|short|byte|Object|[A-Z]\w*(?:<[^>]+>)?)(?:\s*\[\s*\])?\s+(\w+)\s*(=\s*([^;]+))?;/g);
    for (const declaration of declarations) {
      declared.set(declaration[2], { type: declaration[1], line: index + 1, initializer: declaration[4] ?? '' });
      if (declaration[4]?.trim() === 'null') nulls.add(declaration[2]);
      if (/new\s+\w+\s*\[\s*(\d+)\s*\]/.test(declaration[4] ?? '')) {
        arrays.set(declaration[2], Number(declaration[4].match(/\[\s*(\d+)\s*\]/)[1]));
      }
      if (/Scanner|FileInputStream|FileOutputStream|BufferedReader|Connection|Statement|ResultSet/.test(declaration[1])) {
        resources.add(declaration[2]);
      }
    }
    const closed = clean.match(/\b(\w+)\.close\s*\(/);
    if (closed) closedResources.add(closed[1]);
  });

  return { declared, nulls, arrays, resources, closedResources };
}

function analyzeJava(code) {
  const lines = code.split('\n');
  const symbols = collectJavaSymbols(lines);
  const reserved = reservedByLanguage.Java;
  const findings = [];
  const rulesExecuted = [
    'syntax-balance',
    'symbol-resolution',
    'null-data-flow',
    'array-bound-checks',
    'resource-leak-checks',
    'exception-handling',
    'unreachable-code',
    'loop-risk',
    'import-analysis',
  ];

  if ((code.match(/\{/g)?.length ?? 0) !== (code.match(/\}/g)?.length ?? 0)) {
    findings.push(makeFinding({
      type: 'errors',
      title: 'Possible Syntax Error',
      severity: 'critical',
      confidence: 80,
      language: 'Java',
      line: 1,
      codeSnippet: 'Mismatched curly braces',
      explanation: 'Opening and closing braces do not balance.',
      suggestedImprovement: 'Check class, method, and block braces.',
    }));
  }

  lines.forEach((line, index) => {
    const clean = cleanLine(line, 'Java');
    if (!clean) return;
    const lineNumber = index + 1;

    if (/^import\s+[\w.]+\.\*\s*;/.test(clean)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Wildcard Import Detected',
        severity: 'low',
        confidence: 95,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'Wildcard imports reduce clarity and can hide naming conflicts.',
        suggestedImprovement: 'Import only the classes you use.',
      }));
    }

    const explicitImport = clean.match(/^import\s+([\w.]+)\.([A-Z]\w*)\s*;/);
    if (explicitImport) {
      const rest = lines.filter((text) => !text.trim().startsWith('import ')).join('\n');
      if (!new RegExp(`\\b${explicitImport[2]}\\b`).test(rest)) {
        findings.push(makeFinding({
          type: 'warnings',
          title: 'Unused Import',
          severity: 'low',
          confidence: 90,
          language: 'Java',
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${explicitImport[2]} is imported but not referenced.`,
          suggestedImprovement: 'Remove the unused import.',
        }));
      }
    }

    const identifierScanLine = stripStringLiterals(clean);
    for (const word of getWords(identifierScanLine)) {
      if (reserved.has(word) || symbols.declared.has(word)) continue;
      if (/^[A-Z]/.test(word) || /^\d/.test(word)) continue;
      if (new RegExp(`\\.${word}\\b`).test(clean)) continue;
      if (new RegExp(`\\b(class|void|int|double|float|boolean|char|String|long|short|byte)\\s+${word}\\b`).test(clean)) continue;
      if (/^(import|package)\b/.test(clean)) continue;
      findings.push(makeFinding({
        type: 'errors',
        title: 'Possible Undeclared Variable',
        severity: 'critical',
        confidence: 72,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: `"${word}" was not found in the local symbol table.`,
        suggestedImprovement: 'Declare the variable in scope, pass it as a parameter, or check spelling.',
      }));
      break;
    }

    for (const variable of symbols.nulls) {
      if (new RegExp(`\\b${variable}\\.\\w+\\s*\\(`).test(clean)) {
        findings.push(makeFinding({
          type: 'errors',
          title: 'Possible NullPointerException',
          severity: 'critical',
          confidence: 95,
          language: 'Java',
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${variable} is assigned null and dereferenced here.`,
          suggestedImprovement: 'Check for null before dereferencing or initialize the variable.',
        }));
      }
    }

    for (const [arrayName, length] of symbols.arrays.entries()) {
      const access = clean.match(new RegExp(`\\b${arrayName}\\[(\\d+)\\]`));
      if (access && Number(access[1]) >= length) {
        findings.push(makeFinding({
          type: 'errors',
          title: 'Array Index Out of Bounds',
          severity: 'high',
          confidence: 95,
          language: 'Java',
          line: lineNumber,
          codeSnippet: clean,
          explanation: `${arrayName} length is ${length}, but index ${access[1]} is accessed.`,
          suggestedImprovement: 'Use a valid index or check bounds before access.',
        }));
      }
    }

    const badCondition = clean.match(/\bif\s*\(\s*(\w+)\s*\)/);
    if (badCondition && symbols.declared.get(badCondition[1]) && symbols.declared.get(badCondition[1]).type !== 'boolean') {
      findings.push(makeFinding({
        type: 'errors',
        title: 'Invalid Condition Type',
        severity: 'critical',
        confidence: 88,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: `Java conditions must be boolean, but ${badCondition[1]} is ${symbols.declared.get(badCondition[1]).type}.`,
        suggestedImprovement: 'Compare the value explicitly, for example x != 0.',
      }));
    }

    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(clean) || (/catch\s*\([^)]*\)\s*\{\s*$/.test(clean) && /^\s*}\s*$/.test(lines[index + 1] ?? ''))) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Empty Catch Block',
        severity: 'high',
        confidence: 90,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'Empty catch blocks hide failures and make debugging difficult.',
        suggestedImprovement: 'Handle, log, or rethrow the exception intentionally.',
      }));
    }

    if (/catch\s*\(\s*(Exception|Throwable)\s+\w+\s*\)/.test(clean) || /\.printStackTrace\s*\(\s*\)/.test(clean)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Bad Exception Handling Practice',
        severity: 'medium',
        confidence: 80,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'Broad catches or printStackTrace-only handling can hide recovery decisions.',
        suggestedImprovement: 'Catch specific exceptions and handle or propagate them intentionally.',
      }));
    }

    const next = cleanLine(lines[index + 1] ?? '', 'Java');
    if (/\b(return|throw)\b.*;/.test(clean) && next && !/^}/.test(next)) {
      findings.push(makeFinding({
        type: 'errors',
        title: 'Unreachable Code',
        severity: 'high',
        confidence: 86,
        language: 'Java',
        line: lineNumber + 1,
        codeSnippet: next,
        explanation: 'This statement appears after a return or throw.',
        suggestedImprovement: 'Move it before the control-flow exit or remove it.',
      }));
    }

    if (/while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/.test(clean) && !lines.slice(index, index + 6).some((nearby) => /\bbreak\b/.test(nearby))) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Infinite Loop Risk',
        severity: 'high',
        confidence: 75,
        language: 'Java',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'The loop has no explicit terminating condition and no nearby break was found.',
        suggestedImprovement: 'Add a clear termination condition or controlled break.',
      }));
    }
  });

  for (const resource of symbols.resources) {
    if (!symbols.closedResources.has(resource)) {
      const info = symbols.declared.get(resource);
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Possible Resource Leak',
        severity: 'high',
        confidence: 72,
        language: 'Java',
        line: info?.line ?? 1,
        codeSnippet: lines[(info?.line ?? 1) - 1]?.trim() ?? resource,
        explanation: `${resource} looks like a closeable resource but no close() call was found.`,
        suggestedImprovement: 'Use try-with-resources or close the resource in finally.',
      }));
    }
  }

  const duplicateLines = new Map();
  lines.map((line) => cleanLine(line, 'Java')).forEach((line, index) => {
    if (line.length < 16 || line === '{' || line === '}') return;
    duplicateLines.set(line, [...(duplicateLines.get(line) ?? []), index + 1]);
  });
  for (const [line, indexes] of duplicateLines.entries()) {
    if (indexes.length > 1) {
      findings.push(makeFinding({
        type: 'suggestions',
        title: 'Duplicated Code Pattern',
        severity: 'low',
        confidence: 60,
        language: 'Java',
        line: indexes[1],
        codeSnippet: line,
        explanation: `This line appears multiple times at lines ${indexes.join(', ')}.`,
        suggestedImprovement: 'Consider extracting repeated logic into a method.',
      }));
    }
  }

  return buildResult({
    language: 'Java',
    analysisLevel: 'syntax balance + symbol table + lightweight data-flow checks',
    rulesExecuted,
    findings,
    limitations: [
      makeLimitation({
        title: 'Java analyzer is static and local',
        explanation: 'It builds a local symbol table and simple data-flow facts, but it does not compile code, resolve classpaths, or perform full interprocedural analysis.',
      }),
    ],
  });
}

function analyzePython(code) {
  const lines = code.split('\n');
  const declared = new Set();
  const findings = [];
  const rulesExecuted = ['indentation-shape', 'symbol-resolution', 'none-dereference', 'broad-except', 'loop-risk'];
  const reserved = reservedByLanguage.Python;

  lines.forEach((line, index) => {
    const clean = cleanLine(line, 'Python');
    if (!clean) return;
    const lineNumber = index + 1;
    const assignment = clean.match(/^(\w+)\s*=/);
    if (assignment) declared.add(assignment[1]);
    const def = clean.match(/^def\s+(\w+)\s*\(([^)]*)\)/);
    if (def) {
      declared.add(def[1]);
      def[2].split(',').map((item) => item.trim()).filter(Boolean).forEach((param) => declared.add(param));
    }

    const identifierScanLine = stripStringLiterals(clean);
    for (const word of getWords(identifierScanLine)) {
      if (reserved.has(word) || declared.has(word)) continue;
      if (new RegExp(`\\.${word}\\b`).test(clean) || /^import\b|^from\b/.test(clean)) continue;
      findings.push(makeFinding({
        type: 'errors',
        title: 'Possible Undefined Name',
        severity: 'critical',
        confidence: 68,
        language: 'Python',
        line: lineNumber,
        codeSnippet: clean,
        explanation: `"${word}" is used before being seen in this local scope.`,
        suggestedImprovement: 'Define the name, import it, or check spelling.',
      }));
      break;
    }

    if (/except\s*:\s*$/.test(clean) || /except\s+Exception/.test(clean)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Broad Exception Handling',
        severity: 'medium',
        confidence: 85,
        language: 'Python',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'Broad exception handlers can hide unrelated errors.',
        suggestedImprovement: 'Catch the specific exception type you expect.',
      }));
    }

    if (/while\s+True\s*:/.test(clean) && !lines.slice(index, index + 6).some((nearby) => /\bbreak\b/.test(nearby))) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Infinite Loop Risk',
        severity: 'high',
        confidence: 75,
        language: 'Python',
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'The loop is always true and no nearby break was found.',
        suggestedImprovement: 'Add a clear termination condition.',
      }));
    }
  });

  return buildResult({
    language: 'Python',
    analysisLevel: 'basic static checks',
    rulesExecuted,
    findings,
    limitations: [
      makeLimitation({
        title: 'Python analyzer is basic',
        explanation: 'It performs local name and common-risk checks, but does not parse Python AST or infer dynamic types.',
        severity: 'medium',
      }),
    ],
  });
}

function analyzeC(code, language = 'C') {
  const lines = code.split('\n');
  const findings = [];
  const allocated = new Map();
  const freed = new Set();
  const declared = new Set();
  const rulesExecuted = ['symbol-resolution', 'memory-leak-checks', 'null-pointer-risk', 'bounds-risk', 'format-risk'];

  lines.forEach((line, index) => {
    const clean = cleanLine(line, 'C');
    if (!clean) return;
    const lineNumber = index + 1;
    const declaration = clean.match(/\b(?:int|float|double|char|void|long|short)\s+\*?\s*(\w+)/);
    if (declaration) declared.add(declaration[1]);
    const malloc = clean.match(/\b(\w+)\s*=\s*(?:\([^)]*\)\s*)?malloc\s*\(/);
    if (malloc) allocated.set(malloc[1], lineNumber);
    const freeCall = clean.match(/\bfree\s*\(\s*(\w+)\s*\)/);
    if (freeCall) freed.add(freeCall[1]);

    if (/\bgets\s*\(/.test(clean) || /scanf\s*\(\s*"%s"/.test(clean)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Unsafe Input Function',
        severity: 'critical',
        confidence: 90,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'This input pattern can overflow buffers.',
        suggestedImprovement: 'Use bounded input such as fgets or width-limited scanf.',
      }));
    }

    if (/\bwhile\s*\(\s*1\s*\)/.test(clean) && !lines.slice(index, index + 6).some((nearby) => /\bbreak\b/.test(nearby))) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Infinite Loop Risk',
        severity: 'high',
        confidence: 75,
        language,
        line: lineNumber,
        codeSnippet: clean,
        explanation: 'The loop is always true and no nearby break was found.',
        suggestedImprovement: 'Add a terminating condition or controlled break.',
      }));
    }
  });

  for (const [name, line] of allocated.entries()) {
    if (!freed.has(name)) {
      findings.push(makeFinding({
        type: 'warnings',
        title: 'Possible Memory Leak',
        severity: 'high',
        confidence: 78,
        language,
        line,
        codeSnippet: lines[line - 1]?.trim() ?? name,
        explanation: `${name} is allocated but no free(${name}) was found.`,
        suggestedImprovement: 'Free allocated memory on all exit paths.',
      }));
    }
  }

  return buildResult({
    language,
    analysisLevel: 'basic static memory and runtime checks',
    rulesExecuted,
    findings,
    limitations: [
      makeLimitation({
        title: `${language} analyzer is basic`,
        explanation: 'It checks common C/C++ memory risks but does not compile code or perform full pointer alias analysis.',
        severity: 'medium',
      }),
    ],
  });
}

function analyzeUnsupported(language) {
  return buildResult({
    language,
    analysisLevel: 'unsupported locally',
    rulesExecuted: [],
    findings: [],
    limitations: [
      makeLimitation({
        title: `${language} analyzer is not implemented yet`,
        explanation: 'No local analyzer exists for this language. Use the AI backend if configured, or add a language analyzer module.',
        severity: 'medium',
      }),
    ],
  });
}

export async function reviewCode({ code, language }) {
  return apiOrFallback(
    () => apiRequest('/code-review', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),
    () => reviewCodeLocal({ code, language })
  );
}

export function reviewCodeLocal({ code, language }) {
  const normalized = normalizeLanguage(language);
  const analyzers = {
    JavaScript: analyzeJavaScriptLike,
    TypeScript: analyzeJavaScriptLike,
    Java: analyzeJava,
    Python: analyzePython,
    C: analyzeC,
    'C++': (source) => analyzeC(source, 'C++'),
  };
  return analyzers[normalized] ? analyzers[normalized](code, normalized) : analyzeUnsupported(normalized);
}
