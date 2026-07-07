function makeFinding({ type, title, line, snippet, explanation, fix }) {
  return { id: crypto.randomUUID(), type, title, line, snippet, explanation, fix };
}

function lineOf(lines, predicate) {
  const index = lines.findIndex(predicate);
  return index === -1 ? null : index + 1;
}

function findAssignmentInCondition(lines) {
  const line = lineOf(lines, (text) => /if\s*\([^)]*\b[a-zA-Z_$][\w$]*\s=\s[^=]/.test(text));
  if (!line) return null;
  const snippet = lines[line - 1].trim();
  const fixed = snippet.replace(/\s=\s/, ' === ');
  return makeFinding({
    type: 'errors',
    title: 'Assignment Instead of Comparison',
    line,
    snippet,
    explanation: 'This assigns a value inside the condition instead of comparing values, so the condition can behave incorrectly.',
    fix: fixed,
  });
}

function findOffByOneLoop(lines) {
  const line = lineOf(lines, (text) => /for\s*\([^;]+;\s*[^;]+<=\s*[\w.]+\.length/.test(text));
  if (!line) return null;
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'errors',
    title: 'Possible Off-by-One Error',
    line,
    snippet,
    explanation: 'Using <= with .length causes one extra iteration. At the last iteration, array[index] becomes undefined.',
    fix: snippet.replace('<=', '<'),
  });
}

function findUndefinedSingularCall(lines, code) {
  const hasScores = /\bscores\b/.test(code);
  const line = lineOf(lines, (text) => /\bscore\b/.test(text) && !/\bscores\b/.test(text));
  if (!hasScores || !line) return null;
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'errors',
    title: 'Undefined Variable',
    line,
    snippet,
    explanation: '`score` is used, but the code appears to define/use `scores`. This will throw a ReferenceError if `score` is not declared.',
    fix: snippet.replace(/\bscore\b/g, 'scores'),
  });
}

function findMissingEmailAccess(lines, code) {
  if (!/const\s+user\s*=\s*{[^}]*name\s*:/.test(code) && !/let\s+user\s*=\s*{[^}]*name\s*:/.test(code)) return null;
  const line = lineOf(lines, (text) => /user\.email\.toLowerCase\(\)/.test(text));
  if (!line) return null;
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'errors',
    title: 'Possible Runtime Error',
    line,
    snippet,
    explanation: '`email` may not exist on the user object, so calling toLowerCase() can throw a TypeError.',
    fix: snippet.replace('user.email.toLowerCase()', 'user.email?.toLowerCase() ?? "No email"'),
  });
}

function findStringNumberAddition(lines) {
  const stringNumberNames = lines
    .map((text) => text.match(/\b(?:let|const|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*["']\d+["']/)?.[1])
    .filter(Boolean);
  if (!stringNumberNames.length) return null;
  const line = lineOf(lines, (text) => stringNumberNames.some((name) => new RegExp(`\\b${name}\\b\\s*\\+\\s*[a-zA-Z_$\\d]`).test(text)));
  if (!line) return null;
  const variable = stringNumberNames.find((name) => new RegExp(`\\b${name}\\b\\s*\\+`).test(lines[line - 1])) ?? stringNumberNames[0];
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'warnings',
    title: 'String Concatenation Instead of Addition',
    line,
    snippet,
    explanation: 'A numeric string plus a number produces string concatenation, such as "10" + 5 becoming "105".',
    fix: snippet.replace(variable, `Number(${variable})`),
  });
}

function findDivisionByZero(lines) {
  const line = lineOf(lines, (text) => /\/\s*0\b|divide\s*\([^,]+,\s*0\s*\)/.test(text));
  if (!line) return null;
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'warnings',
    title: 'Division by Zero',
    line,
    snippet,
    explanation: 'JavaScript returns Infinity for division by zero. Validate the divisor before dividing.',
    fix: 'if (divisor === 0) throw new Error("Cannot divide by zero");',
  });
}

function findIgnoredMap(lines) {
  const line = lineOf(lines, (text) => /^\s*[\w.]+\.map\s*\(/.test(text));
  if (!line) return null;
  const snippet = lines[line - 1].trim();
  return makeFinding({
    type: 'warnings',
    title: 'Using .map() Without Using Its Return Value',
    line,
    snippet,
    explanation: '.map() creates a new array. If you only want side effects, use .forEach().',
    fix: snippet.replace('.map(', '.forEach('),
  });
}

function findAverageValidation(lines, code) {
  if (!/average|calculateAverage/i.test(code)) return null;
  const hasValidation = /Array\.isArray\([^)]*\)/.test(code) || /\.length\s*===\s*0/.test(code);
  if (hasValidation) return null;
  const line = lineOf(lines, (text) => /function\s+\w*average|const\s+\w*average|calculateAverage/i.test(text)) ?? 1;
  return makeFinding({
    type: 'suggestions',
    title: 'Validate Input Before Calculating an Average',
    line,
    snippet: lines[line - 1]?.trim() ?? '',
    explanation: 'An empty or invalid array can produce NaN or runtime errors.',
    fix: 'if (!Array.isArray(numbers) || numbers.length === 0) {\n  return 0;\n}',
  });
}

function findManualSum(lines, code) {
  if (!/let\s+sum\s*=\s*0/.test(code)) return null;
  const line = lineOf(lines, (text) => /let\s+sum\s*=\s*0/.test(text));
  return makeFinding({
    type: 'suggestions',
    title: 'Simplify Manual Summation',
    line,
    snippet: lines[line - 1].trim(),
    explanation: 'For simple array totals, reduce can be shorter and easier to test.',
    fix: 'const sum = numbers.reduce((a, b) => a + b, 0);',
  });
}

function findMissingJsdoc(lines, code) {
  const line = lineOf(lines, (text) => /function\s+[a-zA-Z_$][\w$]*\s*\(/.test(text));
  if (!line || code.slice(0, Math.max(0, code.indexOf(lines[line - 1]))).includes('/**')) return null;
  return makeFinding({
    type: 'suggestions',
    title: 'Add JSDoc for Student Readability',
    line,
    snippet: lines[line - 1].trim(),
    explanation: 'A short JSDoc block helps explain parameters and return values for academic code.',
    fix: '/**\n * Explains what this function returns.\n * @param {number[]} numbers\n * @returns {number}\n */',
  });
}

function reviewJavaScript(code) {
  const lines = code.split('\n');
  const detectors = [
    () => findUndefinedSingularCall(lines, code),
    () => findOffByOneLoop(lines),
    () => findAssignmentInCondition(lines),
    () => findMissingEmailAccess(lines, code),
    () => findStringNumberAddition(lines),
    () => findDivisionByZero(lines),
    () => findIgnoredMap(lines),
    () => findAverageValidation(lines, code),
    () => findManualSum(lines, code),
    () => findMissingJsdoc(lines, code),
  ];
  const findings = detectors.map((detect) => detect()).filter(Boolean);
  return {
    errors: findings.filter((item) => item.type === 'errors'),
    warnings: findings.filter((item) => item.type === 'warnings'),
    suggestions: findings.filter((item) => item.type === 'suggestions'),
  };
}

function fallbackReview(code, language) {
  const lines = code.split('\n');
  return {
    errors: [],
    warnings: [
      makeFinding({
        type: 'warnings',
        title: `${language} static rules are limited in this mock reviewer`,
        line: 1,
        snippet: lines[0]?.trim() ?? '',
        explanation: 'This frontend mock currently has its most detailed rules for JavaScript.',
        fix: 'Switch to JavaScript for line-level demo findings, or connect a real analyzer later.',
      }),
    ],
    suggestions: [],
  };
}

export async function reviewCode({ code, language }) {
  const groups = language === 'JavaScript' ? reviewJavaScript(code) : fallbackReview(code, language);
  const counts = {
    errors: groups.errors.length,
    warnings: groups.warnings.length,
    suggestions: groups.suggestions.length,
  };
  const score = Math.max(1, Math.min(10, 10 - counts.errors * 1.25 - counts.warnings * 0.5 - counts.suggestions * 0.2));
  return {
    summary: `Reviewed ${code.split('\n').length} line${code.split('\n').length === 1 ? '' : 's'} of ${language}. Found ${counts.errors} error${counts.errors === 1 ? '' : 's'}, ${counts.warnings} warning${counts.warnings === 1 ? '' : 's'}, and ${counts.suggestions} suggestion${counts.suggestions === 1 ? '' : 's'}.`,
    score: Number(score.toFixed(1)),
    quality: score >= 8 ? 'Strong' : score >= 6 ? 'Needs attention' : 'High risk',
    counts,
    ...groups,
  };
}
