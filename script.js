document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickReplySection = document.getElementById('quick-reply-section');
    
    // Conversation history and navigation stack
    const conversationHistory = [];
    const navigationStack = [];
    
    // Initial bot message
    addMessage("GSM! I'm your Samsung Finance+ virtual assistant. How can I help you today?", 'bot');
    displayQuickReplies(["Main Menu"]);
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Menu structure based on the flowchart
    const menuStructure = {
        "Main Menu": {
            message: "Please select an option from the main menu:",
            options: ["FAQs", "Concerns"]
        },
        "FAQs": {
            message: "What would you like to know about?",
            options: ["AI will answer the question"]
        },
        "AI will answer the question": {
            message: "I'll do my best to answer your question. If you'd prefer to speak with a human representative, you can select 'Talk to agent'",
            options: ["Talk to agent", "Main Menu"]
        },
        "Talk to agent": {
            message: "I'm connecting you to a customer service agent. Please wait a moment...",
            options: ["Main Menu"]
        },
        "Concerns": {
            message: "What kind of concern do you have?",
            options: ["System Concern", "Payment Concern"]
        },
        "System Concern": {
            message: "What system issue are you experiencing?",
            options: ["Something Went Wrong", "Application Time Out", "KYC Failure", "KYC Validation in progress", "Connection Error", "Application Rejected", "Blank Pre/Final Order"]
        },
        "Something Went Wrong": {
            message: "For 'Something went wrong' errors:\n- Ensure there are no special characters in Name, Employer's Name, and Address fields.\n- Check spaces and first letter of each word must be uppercase (e.g., Pasay City).\n- Try canceling and reprocessing a new application.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Time Out": {
            message: "For timeout issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "KYC Failure": {
            message: "If your KYC failed, please check these reminders:\n1. ID must be valid for at least 30 calendar days from application date\n2. Must be valid photo ID/passport\n3. Must match with the name you provided\n4. ID must be right side up\n5. ID must be clear and readable\n6. Avoid flash or glare\n7. ID with address is preferable\n8. Laminated ID with manually affixed photo is not acceptable",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "KYC Validation in progress": {
            message: "Please wait for the KYC result to come out as it needs more time to decide. If the same issue persists, please change to a more stable internet connection or cancel and reprocess the application.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Connection Error": {
            message: "For connection error issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Rejected": {
            message: "For rejected applications, this is a bank decision and the bank does not disclose the reason. You may opt to restart a new application or retry after 90 days/3 months.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Blank Pre/Final Order": {
            message: "For blank pre/final order issues, please try refreshing the page or switching to a more stable internet connection. If the problem persists, try cancelling and reprocessing the application.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Payment Concern": {
            message: "What payment issue are you experiencing?",
            options: ["Payment not reflecting", "Equated Monthly Installment not showing", "How to pay"]
        },
        "Payment not reflecting": {
            message: "For payment not reflected issues, you may contact UnionBank through samsungfinanceloans@unionbankph.com. Please fill out the payment concern form for us to help follow up with UnionBank.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Equated Monthly Installment not showing": {
            message: "If your Equated Monthly Installment (EMI) is not showing, please check if your application has been fully approved and processed. You may need to wait 24-48 hours after approval for the EMI details to appear in your account.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How to pay": {
            message: "Please make your payments via the SF+ Customer App. Payments made outside of the SF+ Customer App will not be reflected in our system and may result in your device being locked.\n\nOnline payment channels:\n- Gcash\n- GrabPay\n\nOver-the-counter payment channels:\n- Cebuana Lhuillier\n- Palawan Pawnshop\n- M.Lhuillier\n- Bayad Center\n- ECPay\n- SM Store\n- Robinsons Department Store",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Back": {
            message: "Let me take you back to the previous menu.",
            action: "goBack"
        }
    };
    
    // Function to go back to the previous menu
    function goBack() {
        if (navigationStack.length > 1) {
            navigationStack.pop(); // Remove current menu
            const previousMenu = navigationStack[navigationStack.length - 1];
            handleMenuSelection(previousMenu, false); // Don't push to stack again
        } else {
            // If there's no previous menu, go to main menu
            navigationStack.length = 0;
            handleMenuSelection("Main Menu", true);
        }
    }
    
    // Function to handle menu selection
    function handleMenuSelection(selection, pushToStack = true) {
        if (pushToStack) {
            navigationStack.push(selection);
        }
        
        if (selection === "Back") {
            goBack();
            return;
        }
        
        if (menuStructure[selection]) {
            const menuItem = menuStructure[selection];
            
            // Display the message for this menu item
            addMessage(menuItem.message, 'bot');
            
            // If there's a special action, handle it
            if (menuItem.action === "goBack") {
                goBack();
                return;
            }
            
            // Display the quick reply options
            displayQuickReplies(menuItem.options);
        } else {
            // Handle unknown selection
            addMessage("I'm not sure how to help with that specific option. Let me take you back to the main menu.", 'bot');
            navigationStack.length = 0;
            handleMenuSelection("Main Menu", true);
        }
    }
    
    // Function to send a message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Clear quick replies when user sends a message
        quickReplySection.innerHTML = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message with delay to simulate typing
        setTimeout(() => {
            hideTypingIndicator();
            processMessage(message);
        }, 1000);
    }
    
    // Function to process the user's message
    function processMessage(message) {
        // Check if message is a menu selection
        if (Object.keys(menuStructure).includes(message)) {
            handleMenuSelection(message);
        } else {
            // For free text input, simulate AI processing
            addMessage("I'll try to answer your question based on my knowledge.", 'bot');
            
            // Simulate AI processing delay
            setTimeout(() => {
                addMessage("Based on the information I have, I would suggest checking our FAQs or contacting customer support for more detailed assistance.", 'bot');
                displayQuickReplies(["Talk to agent", "Main Menu"]);
            }, 1500);
        }
    }
    
    // Function to add a message to the chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to conversation history
        conversationHistory.push({
            role: sender === 'user' ? 'user' : 'assistant',
            content: message
        });
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to display quick replies
    function displayQuickReplies(replies) {
        // Clear existing quick replies
        quickReplySection.innerHTML = '';
        
        // Track which buttons are currently visible
        let currentIndex = 0;
        const buttonsPerPage = 3;
        
        // Function to show buttons for current page
        function showButtons(startIndex) {
            // Clear the container first
            quickReplySection.innerHTML = '';
            
            // Calculate end index (either 3 more or end of array)
            const endIndex = Math.min(startIndex + buttonsPerPage, replies.length);
            
            // Create buttons for current page
            for (let i = startIndex; i < endIndex; i++) {
                const reply = replies[i];
                const button = createQuickReplyButton(reply);
                quickReplySection.appendChild(button);
            }
            
            // Add "More" button if there are more options
            if (endIndex < replies.length) {
                const moreButton = document.createElement('button');
                moreButton.classList.add('quick-reply-btn', 'more-options-btn');
                moreButton.textContent = 'More Options';
                
                moreButton.addEventListener('click', function() {
                    // Show next set of buttons
                    showButtons(endIndex);
                });
                
                quickReplySection.appendChild(moreButton);
            } 
            // Add a "Back to first options" button if we're not on the first page
            else if (startIndex > 0 && endIndex === replies.length) {
                const backButton = document.createElement('button');
                backButton.classList.add('quick-reply-btn', 'more-options-btn');
                backButton.textContent = 'Show First Options';
                
                backButton.addEventListener('click', function() {
                    // Go back to first page of options
                    showButtons(0);
                });
                
                quickReplySection.appendChild(backButton);
            }
        }
        
        // Function to create a quick reply button
        function createQuickReplyButton(reply) {
            const button = document.createElement('button');
            button.classList.add('quick-reply-btn');
            
            const span = document.createElement('span');
            span.textContent = reply;
            button.appendChild(span);
            
            button.addEventListener('click', function() {
                // Add the selected reply as a user message
                addMessage(reply, 'user');
                
                // Clear quick replies when a button is clicked
                quickReplySection.innerHTML = '';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Process selection with a delay
                setTimeout(() => {
                    hideTypingIndicator();
                    
                    // Handle the menu selection
                    if (reply === "Back") {
                        goBack();
                    } else {
                        handleMenuSelection(reply);
                    }
                }, 800);
            });
            
            return button;
        }
        
        // Show first page of buttons
        showButtons(0);
    }
    
    // Start with the main menu
    handleMenuSelection("Main Menu", true);
});
