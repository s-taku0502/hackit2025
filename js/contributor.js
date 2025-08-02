window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('year-input-container');
    if (!container) return;
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.setAttribute('for', 'year');
    label.textContent = '年度(西暦(半角)):';
    
    if (2000 < input, input < 2100) {
        input.type = 'text';
        input.id = 'year';
        input.name = 'year';
        input.required = true;
        input.pattern = '\\d{4}';
        input.maxLength = 4;
        input.setAttribute('inputmode', 'numeric');
        input.title = '西暦4桁の半角数字で入力してください';

        container.appendChild(label);
        container.appendChild(input);
    }
}
)