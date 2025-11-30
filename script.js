let expression = '';
let isResultShown = false;

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expression');

function appendToExpression(val) {
  if (isResultShown) {
    expression = '';
    isResultShown = false;
  }

  if (val === '×') val = '*';
  if (val === '−') val = '-';
  if (val === '÷') val = '/';

  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = '';
  isResultShown = false;

  updateDisplay();
}

function deleteLast() {
  if (isResultShown) {
    expression = resultEl.textContent;
    isResultShown = false;
  }
  expression = expression.slice(0, -1);  // Removes last character
  updateDisplay();
}

function getLivePreview() {
  const clean = expression.replace(/[^0-9+\-*/().]/g, '');
  if (!clean || clean === '') return '0';

  try {
    // If expression ends with operator or is incomplete → don't eval full thing
    if (/[+\-*/.]$/.test(clean)) {
      // Extract last number before operator
      const match = clean[0];
      return match ? match : '0';
    }

    const result = Function('"use strict"; return (' + clean + ')')();
    return (typeof result === 'number' && isFinite(result)) ? result : '0';
  } catch (e) {
    // If partial eval fails, show last entered number
    const match = clean.match(/-?([0-9]*\.?[0-9]+)$/);
    return match ? match[1] || '0' : '0';
  }
}

function updateDisplay() {
  // Show current expression at the top
  exprEl.textContent = expression || ' ';

  if (expression === '' && !isResultShown) {
    resultEl.textContent = '0';
  } else {
    // Live preview: NEVER show "Error" while typing
    const preview = getLivePreview();
    resultEl.textContent = formatNumber(preview);
  }

}

function formatNumber(num) {
  if (num === Infinity || isNaN(num)) return 'Error';
  return Number(num).toFixed(10).toString().replace(/\.0+$/, '');
}


function calculateFinal() {
  const expressionResult = expression.replace(/[^0-9+\-*/().]/g, '');
  if (!expressionResult) return 0;


  try {
    const finalResult = Function('"use strict"; return (' + expressionResult + ')')();
    return (typeof finalResult === 'number' && isFinite(finalResult)) ? finalResult : 'Error';
  } catch (e) {
    return 'Error';
  }
}


function calculate() {
  if (!expression) {
    resultEl.textContent = 0;
    return;
  }

  const clean = expression.replace(/[^0-9+\-*/().]/g, '');
  if (!clean) {
    resultEl.textContent = '0';
    return;
  }

  try {
    const result = Function('"use strict"; return (' + clean + ')')();

    if (typeof result === 'number' && isFinite(result)) {
      const formatted = formatNumber(result);
      resultEl.textContent = formatted;
      expression = result.toString(); // Store exact result
      exprEl.textContent = '';
      isResultShown = true; // Mark that we just showed a result
    } else {
      resultEl.textContent = 'Error';
      isResultShown = false;
    }
  } catch (e) {
    resultEl.textContent = 'Error';
    isResultShown = false;
  }

}

// Auto dark mode
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
}

// Double-tap result to toggle theme
resultEl.addEventListener('dblclick', () => {
  document.body.classList.toggle('dark');
});

updateDisplay();