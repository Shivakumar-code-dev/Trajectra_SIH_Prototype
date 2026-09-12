/**
 * QuantumCalc - JavaScript Logic & Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let currentInput = '0';
    let expression = '';
    let memoryValue = 0;
    let isDegree = true; // DEG mode default
    let soundEnabled = true;
    let currentMode = 'standard'; // standard | scientific | converter
    let historyList = JSON.parse(localStorage.getItem('quantumcalc_history') || '[]');

    // Web Audio API Context for sound synthesis
    let audioCtx = null;

    // --- DOM Elements ---
    const expressionDisplay = document.getElementById('expressionDisplay');
    const resultDisplay = document.getElementById('resultDisplay');
    const angleUnitBadge = document.getElementById('angleUnitBadge');
    const standardGrid = document.getElementById('standardGrid');
    const scientificGrid = document.getElementById('scientificGrid');
    const converterView = document.getElementById('converterView');
    const degRadToggle = document.getElementById('degRadToggle');
    
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const currentModeTitle = document.getElementById('currentModeTitle');

    const historyDrawer = document.getElementById('historyDrawer');
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const historyListContainer = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const copyResultBtn = document.getElementById('copyResultBtn');
    const soundToggle = document.getElementById('soundToggle');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const toast = document.getElementById('toast');

    // Unit Converter Elements
    const converterCategory = document.getElementById('converterCategory');
    const convValue1 = document.getElementById('convValue1');
    const convValue2 = document.getElementById('convValue2');
    const convUnit1 = document.getElementById('convUnit1');
    const convUnit2 = document.getElementById('convUnit2');
    const swapUnitsBtn = document.getElementById('swapUnitsBtn');

    // --- Initialization ---
    initTheme();
    renderHistory();
    initConverter();

    // --- Sound Synthesizer (Web Audio API) ---
    function playKeySound(type = 'click') {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === 'equals') {
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'clear') {
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
                osc.start(now);
                osc.stop(now + 0.06);
            } else {
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            }
        } catch (e) {
            // Audio context not allowed without explicit user gesture
        }
    }

    // --- UI Update Helper ---
    function updateDisplay() {
        resultDisplay.textContent = formatDisplayNumber(currentInput);
        expressionDisplay.textContent = expression;
    }

    function formatDisplayNumber(str) {
        if (str === 'Error' || str === 'Infinity' || str === 'NaN') return str;
        // Don't format incomplete decimals like "12."
        if (str.endsWith('.') || str.includes('e')) return str;

        const parts = str.split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

        // Add commas to large integers
        const formattedInt = Number(integerPart).toLocaleString('en-US', { maximumFractionDigits: 0 });
        return isNaN(Number(integerPart)) ? str : formattedInt + decimalPart;
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // --- Core Calculator Actions ---
    function handleInput(val) {
        playKeySound('click');
        if (currentInput === '0' || currentInput === 'Error') {
            currentInput = val;
        } else {
            currentInput += val;
        }
        updateDisplay();
    }

    function handleOperator(op) {
        playKeySound('click');
        if (currentInput === 'Error') currentInput = '0';

        expression += currentInput + ' ' + op + ' ';
        currentInput = '0';
        updateDisplay();
    }

    function handleClear() {
        playKeySound('clear');
        currentInput = '0';
        expression = '';
        updateDisplay();
    }

    function handleDelete() {
        playKeySound('click');
        if (currentInput === 'Error') {
            currentInput = '0';
        } else if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    function handleNegate() {
        playKeySound('click');
        if (currentInput === '0' || currentInput === 'Error') return;
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }

    // --- Scientific & Function Handlers ---
    function handleFunction(func) {
        playKeySound('click');
        let num = parseFloat(currentInput);
        if (isNaN(num)) return;

        let res = 0;
        let funcSymbol = func + '(' + currentInput + ')';

        try {
            switch (func) {
                case 'sin':
                    res = isDegree ? Math.sin(num * Math.PI / 180) : Math.sin(num);
                    break;
                case 'cos':
                    res = isDegree ? Math.cos(num * Math.PI / 180) : Math.cos(num);
                    break;
                case 'tan':
                    res = isDegree ? Math.tan(num * Math.PI / 180) : Math.tan(num);
                    break;
                case 'asin':
                    res = isDegree ? Math.asin(num) * 180 / Math.PI : Math.asin(num);
                    break;
                case 'acos':
                    res = isDegree ? Math.acos(num) * 180 / Math.PI : Math.acos(num);
                    break;
                case 'atan':
                    res = isDegree ? Math.atan(num) * 180 / Math.PI : Math.atan(num);
                    break;
                case 'log':
                    res = Math.log10(num);
                    break;
                case 'ln':
                    res = Math.log(num);
                    break;
                case 'sqrt':
                    res = Math.sqrt(num);
                    break;
                case 'cbrt':
                    res = Math.cbrt(num);
                    break;
                case 'sqr':
                    res = Math.pow(num, 2);
                    funcSymbol = currentInput + '²';
                    break;
                case 'cube':
                    res = Math.pow(num, 3);
                    funcSymbol = currentInput + '³';
                    break;
                case 'recip':
                    res = 1 / num;
                    funcSymbol = '1/(' + currentInput + ')';
                    break;
                case 'fact':
                    res = factorial(num);
                    funcSymbol = currentInput + '!';
                    break;
            }

            if (isNaN(res) || !isFinite(res)) {
                currentInput = 'Error';
            } else {
                // Round off floating point inaccuracies
                res = parseFloat(res.toFixed(10));
                currentInput = res.toString();
                addHistory(funcSymbol, res.toString());
            }
        } catch (err) {
            currentInput = 'Error';
        }
        updateDisplay();
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity; // Prevent overflow
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    // --- Expression Calculation Engine ---
    function calculateResult() {
        playKeySound('equals');
        let fullExpr = expression + currentInput;
        if (!fullExpr.trim()) return;

        try {
            // Sanitize and replace math symbols for JavaScript eval
            let sanitized = fullExpr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/π/g, Math.PI.toString())
                .replace(/e/g, Math.E.toString())
                .replace(/\^/g, '**');

            // Evaluate safely using Function constructor
            let result = new Function('return ' + sanitized)();

            if (isNaN(result) || !isFinite(result)) {
                currentInput = 'Error';
            } else {
                result = parseFloat(result.toFixed(10));
                let resultStr = result.toString();
                addHistory(fullExpr, resultStr);
                expression = '';
                currentInput = resultStr;
            }
        } catch (e) {
            currentInput = 'Error';
        }
        updateDisplay();
    }

    // --- Memory Operations ---
    function handleMemory(action) {
        playKeySound('click');
        let num = parseFloat(currentInput) || 0;
        switch (action) {
            case 'mc':
                memoryValue = 0;
                showToast('Memory Cleared');
                break;
            case 'mr':
                currentInput = memoryValue.toString();
                updateDisplay();
                break;
            case 'm-plus':
                memoryValue += num;
                showToast(`Memory: ${memoryValue}`);
                break;
            case 'm-minus':
                memoryValue -= num;
                showToast(`Memory: ${memoryValue}`);
                break;
            case 'ms':
                memoryValue = num;
                showToast(`Memory Stored: ${memoryValue}`);
                break;
        }
    }

    // --- Event Listeners for Buttons ---
    document.querySelectorAll('.keypad-grid').forEach(grid => {
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.key-btn');
            if (!btn) return;

            const val = btn.dataset.value;
            const action = btn.dataset.action;
            const func = btn.dataset.func;

            if (val) {
                if (['+', '-', '*', '/', '%', '^'].includes(val)) {
                    handleOperator(val);
                } else if (val === 'π') {
                    currentInput = Math.PI.toFixed(8);
                    updateDisplay();
                } else if (val === 'e') {
                    currentInput = Math.E.toFixed(8);
                    updateDisplay();
                } else {
                    handleInput(val);
                }
            } else if (action) {
                switch (action) {
                    case 'clear': handleClear(); break;
                    case 'delete': handleDelete(); break;
                    case 'negate': handleNegate(); break;
                    case 'calculate': calculateResult(); break;
                    case 'func': handleFunction(func); break;
                }
            }
        });
    });

    // Memory bar click listener
    document.getElementById('memoryBar').addEventListener('click', (e) => {
        const btn = e.target.closest('.mem-btn');
        if (btn && btn.dataset.action) {
            handleMemory(btn.dataset.action);
        }
    });

    // DEG / RAD Toggle Button
    degRadToggle.addEventListener('click', () => {
        isDegree = !isDegree;
        degRadToggle.textContent = isDegree ? 'DEG' : 'RAD';
        angleUnitBadge.textContent = isDegree ? 'DEG' : 'RAD';
        angleUnitBadge.classList.toggle('active', currentMode === 'scientific');
        playKeySound('click');
    });

    // --- Keyboard Input Support ---
    document.addEventListener('keydown', (e) => {
        // Prevent action if focused inside converter input fields
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            handleInput(e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            handleOperator(e.key);
        } else if (e.key === '%') {
            handleOperator('%');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculateResult();
        } else if (e.key === 'Backspace') {
            handleDelete();
        } else if (e.key === 'Escape') {
            handleClear();
        } else if (e.key === '(' || e.key === ')') {
            handleInput(e.key);
        }
    });

    // --- Sidebar & Mode Switching ---
    function setMode(mode) {
        currentMode = mode;
        navItems.forEach(item => item.classList.toggle('active', item.dataset.mode === mode));

        if (mode === 'standard') {
            currentModeTitle.textContent = 'Standard Calculator';
            scientificGrid.classList.add('hidden');
            standardGrid.classList.remove('hidden');
            converterView.classList.add('hidden');
            angleUnitBadge.classList.remove('active');
        } else if (mode === 'scientific') {
            currentModeTitle.textContent = 'Scientific Calculator';
            scientificGrid.classList.remove('hidden');
            standardGrid.classList.remove('hidden');
            converterView.classList.add('hidden');
            angleUnitBadge.classList.add('active');
        } else if (mode === 'converter') {
            currentModeTitle.textContent = 'Unit Converter';
            scientificGrid.classList.add('hidden');
            standardGrid.classList.add('hidden');
            converterView.classList.remove('hidden');
            angleUnitBadge.classList.remove('active');
        }
        
        // Auto close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => setMode(item.dataset.mode));
    });

    openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    // --- History Drawer Management ---
    function addHistory(expr, result) {
        historyList.unshift({ expr, result, timestamp: new Date().toLocaleTimeString() });
        if (historyList.length > 50) historyList.pop();
        localStorage.setItem('quantumcalc_history', JSON.stringify(historyList));
        renderHistory();
    }

    function renderHistory() {
        if (historyList.length === 0) {
            historyListContainer.innerHTML = `
                <div class="empty-history">
                    <i class="fa-regular fa-folder-open"></i>
                    <p>No history yet</p>
                </div>`;
            return;
        }

        historyListContainer.innerHTML = historyList.map(item => `
            <div class="history-item" data-val="${item.result}">
                <div class="history-expr">${item.expr} =</div>
                <div class="history-val">${item.result}</div>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                currentInput = el.dataset.val;
                updateDisplay();
                historyDrawer.classList.remove('open');
                playKeySound('click');
            });
        });
    }

    historyToggleBtn.addEventListener('click', () => historyDrawer.classList.toggle('open'));
    closeHistoryBtn.addEventListener('click', () => historyDrawer.classList.remove('open'));
    clearHistoryBtn.addEventListener('click', () => {
        historyList = [];
        localStorage.removeItem('quantumcalc_history');
        renderHistory();
        playKeySound('clear');
    });

    // --- Copy & Sound Controls ---
    copyResultBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentInput).then(() => {
            showToast('Result copied to clipboard!');
        });
    });

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('active', soundEnabled);
    });

    // --- Theme Switcher ---
    function initTheme() {
        const savedTheme = localStorage.getItem('quantumcalc_theme') || 'theme-dark';
        document.body.className = savedTheme;
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === savedTheme);
        });
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.className = theme;
            localStorage.setItem('quantumcalc_theme', theme);
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playKeySound('click');
        });
    });

    // --- Unit Converter Logic ---
    const unitData = {
        length: {
            Meter: 1,
            Kilometer: 0.001,
            Centimeter: 100,
            Millimeter: 1000,
            Mile: 0.000621371,
            Foot: 3.28084,
            Inch: 39.3701
        },
        weight: {
            Kilogram: 1,
            Gram: 1000,
            Milligram: 1000000,
            Pound: 2.20462,
            Ounce: 35.274
        },
        temperature: {
            Celsius: 'C',
            Fahrenheit: 'F',
            Kelvin: 'K'
        },
        digital: {
            Byte: 1,
            Kilobyte: 0.001,
            Megabyte: 0.000001,
            Gigabyte: 0.000000001,
            Terabyte: 0.000000000001
        }
    };

    function initConverter() {
        populateConverterUnits();

        converterCategory.addEventListener('change', () => {
            populateConverterUnits();
            convertUnits();
        });

        convValue1.addEventListener('input', convertUnits);
        convUnit1.addEventListener('change', convertUnits);
        convUnit2.addEventListener('change', convertUnits);

        swapUnitsBtn.addEventListener('click', () => {
            const tempUnit = convUnit1.value;
            convUnit1.value = convUnit2.value;
            convUnit2.value = tempUnit;
            convertUnits();
            playKeySound('click');
        });
    }

    function populateConverterUnits() {
        const cat = converterCategory.value;
        const units = Object.keys(unitData[cat]);

        convUnit1.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
        convUnit2.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');

        if (units.length > 1) {
            convUnit2.selectedIndex = 1;
        }
        convertUnits();
    }

    function convertUnits() {
        const cat = converterCategory.value;
        const val1 = parseFloat(convValue1.value) || 0;
        const u1 = convUnit1.value;
        const u2 = convUnit2.value;

        if (cat === 'temperature') {
            convValue2.value = convertTemp(val1, u1, u2).toFixed(2);
            return;
        }

        const rates = unitData[cat];
        if (!rates || !rates[u1] || !rates[u2]) return;

        // Convert value to base unit first, then to target unit
        const baseVal = val1 / rates[u1];
        const targetVal = baseVal * rates[u2];
        convValue2.value = parseFloat(targetVal.toFixed(6)).toString();
    }

    function convertTemp(val, from, to) {
        if (from === to) return val;
        let c = val;
        if (from === 'Fahrenheit') c = (val - 32) * (5 / 9);
        else if (from === 'Kelvin') c = val - 273.15;

        if (to === 'Celsius') return c;
        if (to === 'Fahrenheit') return (c * 9 / 5) + 32;
        if (to === 'Kelvin') return c + 273.15;
        return val;
    }
});
