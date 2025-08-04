window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('year-input-container');
    const nowyear = new Date().getFullYear();
    if (!container) return;

    const label = document.createElement('label');

    const input = document.createElement('input');
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

    input.addEventListener('input', () => {
        const val = input.value;
        if (/^\d{4}$/.test(val) && Number(val) >= 2020 && Number(val) <= nowyear) {
            input.setCustomValidity('');
        } else {
            input.setCustomValidity('2020以上' + nowyear + '以下の西暦4桁で入力してください');
        }
    });
});