document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const clearDatabaseButton = document.getElementById('clearDatabaseButton');
    const viewMessagesButton = document.getElementById('viewMessagesButton');
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const closeBtn = document.getElementsByClassName('close')[0];
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Function to check login status
    function checkLoginStatus() {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            clearDatabaseButton.style.display = 'inline-block';
            viewMessagesButton.style.display = 'inline-block';
            loginButton.style.display = 'none';
        } else {
            clearDatabaseButton.style.display = 'none';
            viewMessagesButton.style.display = 'none';
            loginButton.style.display = 'inline-block';
        }
    }

    // Function to show login modal
    function showLoginModal(callback) {
        loginModal.style.display = 'block';

        loginForm.onsubmit = function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === 'password') {
                // Store login status in session storage
                sessionStorage.setItem('isLoggedIn', 'true');

                loginModal.style.display = 'none';

                // Call the callback function after login
                if (callback) callback();

                // Update UI based on login status
                checkLoginStatus();
            } else {
                showToast('Invalid credentials. Please try again.', 'error');
            }
        };
    }

    // Attach click event to login button to show the modal
    loginButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        showLoginModal();
    });

    // Close the modal
    closeBtn.onclick = function () {
        loginModal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    }

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showToast('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            showToast('An error occurred. Please try again.', 'error');
        }
    });

    clearDatabaseButton.addEventListener('click', async function () {
        if (confirm('Are you sure you want to clear the database?')) {
            try {
                const response = await fetch('/clear-database', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:password')
                    }
                });

                if (response.ok) {
                    showToast('Database cleared successfully!', 'success');
                } else {
                    showToast('Failed to clear database.', 'error');
                }
            } catch (error) {
                showToast('An error occurred while clearing the database.', 'error');
            }
        }
    });

    viewMessagesButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/view-messages', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa('admin:password')
                }
            });

            if (response.ok) {
                const data = await response.text();
                const newWindow = window.open();
                newWindow.document.write(data);
            } else {
                showToast('Failed to view messages.', 'error');
            }
        } catch (error) {
            showToast('An error occurred while viewing messages.', 'error');
        }
    });

    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        if (type === 'success') {
            toast.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            toast.style.backgroundColor = '#dc3545';
        }
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Chatbot logic
    const botResponses = {
        "hello": "Hi there! How can I help you today?",
        "help": "Sure, I'm here to help! What do you need assistance with?",
        "contact": "You can contact us via messaging on our contact page or call us at (123) 456-7890.",
        "services": "We offer a variety of gardening services including lawn care, landscaping, and garden maintenance. Call us now for a free consultation!",
        "default": "I'm sorry, I didn't understand that. Can you please rephrase?"
    };

    function getBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes("hello")) {
            return botResponses["hello"];
        } else if (lowerCaseMessage.includes("help")) {
            return botResponses["help"];
        } else if (lowerCaseMessage.includes("contact")) {
            return botResponses["contact"];
        } else if (lowerCaseMessage.includes("services")) {
            return botResponses["services"];
        } else {
            return botResponses["default"];
        }
    }

    function addMessageToChat(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message');
        if (isUser) {
            messageElement.classList.add('user');
        }
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    chatbotSend.addEventListener('click', function () {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addMessageToChat(userMessage, true);
            chatbotInput.value = '';

            const botResponse = getBotResponse(userMessage);
            setTimeout(() => {
                addMessageToChat(botResponse, false);
            }, 500);
        }
    });

    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            chatbotSend.click();
        }
    });

    chatbotToggle.addEventListener('click', function () {
        const isHidden = chatbotBody.style.display === 'none';
        chatbotBody.style.display = isHidden ? 'flex' : 'none';
        chatbotToggle.textContent = isHidden ? '-' : '+';
    });

    // Check login status on page load
    checkLoginStatus();
});

