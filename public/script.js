document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('.blurry-load');
    img.src = img.getAttribute('data-src');
    img.onload = () => img.classList.remove('blurry-load');
});

document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;

        button.getAttribute('aria-expanded') === 'true' ? button.setAttribute('aria-expanded', 'false') : button.setAttribute('aria-expanded', 'true');

        if (button.getAttribute('aria-expanded') === 'true') {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        } else {
            accordionContent.style.maxHeight = 0;
        }
    });
});

document.querySelectorAll('.form-control input, .form-control textarea').forEach(inputField => {
    inputField.addEventListener('focus', () => {
        inputField.parentNode.classList.add('focus');
    });

    inputField.addEventListener('blur', () => {
        if(inputField.value != "") return;
        inputField.parentNode.classList.remove('focus');
    });
});
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('expanded'));
        card.classList.add('expanded');
    });
});
// Toggle search widget
const searchToggle = document.querySelector('.search-toggle');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');

searchToggle.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        searchInput.focus();
    }
});

