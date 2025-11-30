export default async function main() {
  const searchInput = document.querySelector('.search-input');

  const newsMenuButtons = document.querySelectorAll('.news-menu-btn');
  const newsListGeneral = document.querySelector('.news-list-general');
  const newsListSports = document.querySelector('.news-list-sports');
  const newsListEntertainment = document.querySelector('.news-list-entertainment');

  function showNewsList(type) {
    newsMenuButtons.forEach(button => button.classList.remove('active'));
    const activeButton = document.querySelector(`.news-menu-btn[data-news-type="${type}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    newsListGeneral.style.display = 'none';
    newsListSports.style.display = 'none';
    newsListEntertainment.style.display = 'none';

    if (type === 'general') {
      newsListGeneral.style.display = 'grid';
    } else if (type === 'sports') {
      newsListSports.style.display = 'grid';
    } else if (type === 'entertainment') {
      newsListEntertainment.style.display = 'grid';
    }
  }

  newsMenuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const newsType = e.target.dataset.newsType;
      showNewsList(newsType);
    });
  });

  showNewsList('general');

  const themeToggleButton = document.querySelector('.theme-toggle-btn');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark-mode');
    } else if (prefersDarkMode.matches) {
      document.documentElement.classList.add('dark-mode');
    }
    updateToggleButtonIcon(); 
  }

  function updateToggleButtonIcon() {
    if (document.documentElement.classList.contains('dark-mode')) {
      themeToggleButton.textContent = '☀️'; 
    } else {
      themeToggleButton.textContent = '🌙'; 
    }
  }

  function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    updateToggleButtonIcon();
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleDarkMode);
  }

  prefersDarkMode.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      if (e.matches) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      updateToggleButtonIcon();
    }
  });

  setInitialTheme();

  const calcDisplay = document.getElementById('calc-display');
  const numberButtons = document.querySelectorAll('.calc-btn.btn-number');
  const operatorButtons = document.querySelectorAll('.calc-btn.btn-operator');
  const equalsButton = document.querySelector('.calc-btn.btn-equal');
  const clearButton = document.querySelector('.calc-btn.btn-clear');
  const decimalButton = document.querySelector('.calc-btn.btn-decimal');

  let currentInput = '0'; 
  let firstOperand = null; 
  let operator = null; 
  let waitingForSecondOperand = false; 
  let shouldResetAfterEquals = false; 

  let displayExpression = '0';

  function updateDisplay() {
    calcDisplay.textContent = displayExpression;
  }

  function inputNumber(number) {
    if (shouldResetAfterEquals) {
      if (number === '.') {
        currentInput = `${firstOperand}.`;
        operator = null;
        shouldResetAfterEquals = false;
        waitingForSecondOperand = false;
        displayExpression = currentInput;
      } else {
        currentInput = number;
        firstOperand = null;
        operator = null;
        shouldResetAfterEquals = false;
        waitingForSecondOperand = false;
        displayExpression = number;
      }
    } else if (waitingForSecondOperand === true) {
      currentInput = number;
      waitingForSecondOperand = false;
      displayExpression = `${firstOperand} ${operator} ${currentInput}`;
    } else {
      if (number === '.' && currentInput.includes('.')) {
        return;
      }
      currentInput = currentInput === '0' && number !== '.' ? number : currentInput + number;

      if (operator !== null && firstOperand !== null) {
        displayExpression = `${firstOperand} ${operator} ${currentInput}`;
      } else {
        displayExpression = currentInput;
      }
    }
    updateDisplay();
  }

  function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator === null && firstOperand !== null && !waitingForSecondOperand) {
      firstOperand = inputValue;
      currentInput = `${inputValue}`;
    }

    if (shouldResetAfterEquals) {
      operator = nextOperator;
      shouldResetAfterEquals = false;
      waitingForSecondOperand = true;
      displayExpression = `${firstOperand} ${operator}`;
      updateDisplay();
      return;
    }

    if (operator && waitingForSecondOperand) {
      operator = nextOperator;
      displayExpression = `${firstOperand} ${operator}`;
      updateDisplay();
      return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      firstOperand = parseFloat(result.toFixed(7));
      currentInput = `${firstOperand}`;
      displayExpression = currentInput;
      updateDisplay();
    }

    waitingForSecondOperand = true;
    operator = nextOperator;

    if (firstOperand !== null) {
      displayExpression = `${firstOperand} ${operator}`;
      updateDisplay();
    }
  }

  function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') {
      if (second === 0) {
        alert("0으로 나눌 수 없습니다.");
        resetCalculator();
        return 0;
      }
      return first / second;
    }
    return second;
  }

  function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    shouldResetAfterEquals = false;
    displayExpression = '0';
    updateDisplay();
  }

  numberButtons.forEach(button => {
    button.addEventListener('click', (e) => inputNumber(e.target.dataset.number));
  });

  operatorButtons.forEach(button => {
    button.addEventListener('click', (e) => handleOperator(e.target.dataset.operator));
  });

  equalsButton.addEventListener('click', () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const secondOperand = waitingForSecondOperand ? firstOperand : parseFloat(currentInput);

    const result = calculate(firstOperand, secondOperand, operator);
    firstOperand = parseFloat(result.toFixed(7));
    currentInput = `${firstOperand}`;

    operator = null;
    waitingForSecondOperand = true;
    shouldResetAfterEquals = true;

    displayExpression = currentInput;
    updateDisplay();
  });

  clearButton.addEventListener('click', resetCalculator);

  if (decimalButton) {
    decimalButton.addEventListener('click', (e) => inputNumber(e.target.dataset.number));
  }

  updateDisplay();

  const yearSelect = document.getElementById('year-select');
  const monthSelect = document.getElementById('month-select');

  const calendarDays = document.querySelector('.calendar-days');
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');

  let currentDate = new Date();
  let selectedDate = null;

  function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}년`;
      yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
  }

  function populateMonthSelect() {
    for (let i = 0; i < 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i + 1}월`;
      monthSelect.appendChild(option);
    }
    monthSelect.value = currentDate.getMonth();
  }

  function renderCalendar() {
    calendarDays.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    yearSelect.value = year;
    monthSelect.value = month;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = firstDayOfMonth.getDay();

    const today = new Date();
    const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day', 'inactive');
      dayElement.textContent = prevMonthLastDay - (firstDayOfWeek - 1) + i;
      calendarDays.appendChild(dayElement);
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day');
      dayElement.textContent = i;
      dayElement.dataset.date = `${year}-${month + 1}-${i}`;

      if (isCurrentMonthView && i === today.getDate()) {
        dayElement.classList.add('today');
      }

      if (selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === i) {
        dayElement.classList.add('selected');
      }

      calendarDays.appendChild(dayElement);
    }

    const totalVisibleCells = calendarDays.children.length;
    const nextMonthStartDay = 1;

    for (let i = 0; totalVisibleCells + i < 42; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day', 'inactive');
      dayElement.textContent = nextMonthStartDay + i;
      calendarDays.appendChild(dayElement);
    }

    document.querySelectorAll('.calendar-day').forEach(dayCell => {
      dayCell.addEventListener('click', () => {
        if (dayCell.classList.contains('inactive')) {
          const targetYear = parseInt(dayCell.dataset.year);
          const targetMonth = parseInt(dayCell.dataset.month);
          const targetDay = parseInt(dayCell.dataset.date);

          currentDate = new Date(targetYear, targetMonth, 1);
          selectedDate = new Date(targetYear, targetMonth, targetDay);
          renderCalendar();

          return;
        }

        if (dayCell.classList.contains('selected')) {
          dayCell.classList.remove('selected');
          selectedDate = null;
          console.log(`선택된 날짜: 선택 해제`);
        }
        else {

          const prevSelected = document.querySelector('.calendar-day.selected');
          if (prevSelected) {
            prevSelected.classList.remove('selected');
          }

          dayCell.classList.add('selected');

          const [y, m, d] = [currentDate.getFullYear(), currentDate.getMonth(), parseInt(dayCell.dataset.date)];
          selectedDate = new Date(y, m, d);
          console.log(`선택된 날짜: ${selectedDate.toLocaleDateString()}`);
        }
      });
    });
  }


  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  yearSelect.addEventListener('change', () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
  });

  monthSelect.addEventListener('change', () => {
    currentDate.setMonth(parseInt(monthSelect.value));
    renderCalendar();
  });


  populateYearSelect();
  populateMonthSelect();
  renderCalendar();
}