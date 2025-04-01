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
            message: "GSM! I'm your Samsung Finance+ virtual assistant. Please select an option from the main menu. ",
            options: ["Merchant App Concern", "Customer App Concern"]
        },
        "Merchant App Concern": {
            message: "Please select the specific issue you're experiencing with the Merchant App:",
            options: [
                "Not Receiving OTP Code",
                "Something Went Wrong Prompt",
                "Duplicate Entry Prompt",
                "Selected product did not display in the offers screen",
                "Application Timed-Out Prompt in Offers Screen",
                "Blank details in Loan Agreement",
                "Application Timed-Out Prompt in Loan Agreement",
                "Invalid Input Prompt",
                "KYC Failure",
                "KYC [UB Response Failure]",
                "Application Timed-Out Prompt in Pre-DO",
                "Blank details in Pre-DO",
                "Application Timed-Out Prompt in Final-DO",
                "Blank details in Final-Do",
                "Samsung Care+",
                "Did not input SEC code",
                "Egift / Evoucher",
                "Disbursment report",
                "Back",
                "Talk to Agent"
            ]
        },
        "Customer App Concern": {
            message: "Please select the specific issue you're experiencing with the Customer App:",
            options: [
                "Processed with Esim",
                "Unable to Proceed with Payment",
                "Customer App: Not Receiving OTP (Verification) Code",
                "Payment Details Not Showing",
                "Payment Not reflecting",
                "Device got Locked",
                "Stuck in setting up the device",
                "Uninstall Customer app in the device",
                "Defective Unit",
                "Lost/Stolen Unit",
                "Back",
                "Talk to Agent"
            ]
        },
        "Processed with Esim": {
            message: "eSIM is not allowed. You will need to cancel the transaction and reprocess it using a registered physical SIM.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Unable to Proceed with Payment": {
            message: "Please try other mode of payments via SF+ Customer App",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Customer App: Not Receiving OTP (Verification) Code": {
            message: "1. Customer's sim card used in SF+ merchant app must be inserted in slot 1 before setting up the device.\n\n2. The customer's sim card inserted in slot 1 in the new device must have a regular load of at least ₱1\n\n3. New Device must be connected to the stable internet via WIFI or Mobile data\n\n4. If customer app is not being installed automatically, make sure the software version is up-to-date then restart.\n\n5. If Samsung Finance+ isn't downloaded within 3 minutes, try connecting to <a href='https://guard.samsungknox.com' target='_blank' rel='noopener noreferrer'>https://guard.samsungknox.com</a> on the purchased phone\n\n<b style='text-transform: uppercase;'>If none works from above reminders, DO A FACTORY RESET.</b>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Payment Details Not Showing": {
            message: "If your Equated Monthly Installment (EMI) details are not appearing, please try clicking the refresh button. If the details still do not appear, kindly wait for a few days, as they should update automatically.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Payment Not reflecting": {
            message: "Hi. Customer may contact UnionBank through <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a> for any payment related issue.\n\nPlease fill out the form for us to help follow up UnionBank.\n\n<a href='https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform' target='_blank' rel='noopener noreferrer'>https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform</a>\n\nNOTE: If the device is also locked as of the moment, please try the following temporary solution;\n\n1. Insert a different SIM card with data\n2. Restart the device\n3. Open the customer app\n4. Make a payment",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Device got Locked": {
            message: "Please make sure the customer has made a payment, if yes. Please try the following:\n\n1. Insert a different SIM card with data\n2. Restart the device\n3. Click support\n4. Click refresh account",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Stuck in setting up the device": {
            message: "Please Factory reset the device.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Uninstall Customer app in the device": {
            message: "Customers can only uninstall the SF+ Customer App after fully paying off all outstanding Equated Monthly Installments (EMI).",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Defective Unit": {
            message: "To replace the defective device, kindly follow the step by step Guide: <a href='https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing</a>\n\nReminder! Once swap is successful, perform a Factory Reset on the defective device to uninstall the SF+ App.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Lost/Stolen Unit": {
            message: "Please report the loan details in this form so we can Mark as Lost and locked the device: <a href='https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform?usp=preview' target='_blank' rel='noopener noreferrer'>https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform?usp=preview</a>\n\nAfter reporting in the link, please advise the customer to:\nYou may report this to UnionBank via <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n\nYou will still need to pay the monthly loan amounts to pay off your loan, or else will be considered delinquent.\nFor faster assitance, please provide the following information via email:\na. Full name,\nb. Loan Account ID, and\nc. Concern (subject of email) and background.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Not Receiving OTP Code": {
            message: "For OTP code issues, please check the following:\n\n1. Ensure You Have Signal – Weak signal or 'No Service' can block OTPs.\n\n2. Turn Airplane Mode ON/OFF – This resets your mobile network.\n\n3. Clear SMS Inbox – If your inbox is full, new messages might not come through.\n\n4. Restart Your Phone – A quick reboot can refresh your network connection.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Something Went Wrong Prompt": {
            message: "For 'Something Went Wrong' errors, please follow these steps:\n\n- Ensure that there's no special characters in Name, Employer's Name and Address Field.\n\n- Check the Spaces and First Letter of the word must be Uppercase (e.g. Pasay City)\n\n- Cancel and reprocess a new application\n\n<b style='text-transform: uppercase;'>If the error persists after performing the steps the customer/s are either:</b>\n1. have existing applications with UB/SF+\n2. have rejected UB/SF+ transactions and can retry 3 months later",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Duplicate Entry Prompt": {
            message: "Please cancel and reprocess with a different phone number.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Selected product did not display in the offers screen": {
            message: "The offer is dependent on his/her credit score and the annual income provided. Please explain to the customer that the devices shown in the offers are based UB's decisions. Ask if he/she would consider any of the other models that are available in the offers.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Offers Screen": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Loan Agreement": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Loan Agreement": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Invalid Input Prompt": {
            message: "Please cancel and reprocess with a different IMEI",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "KYC Failure": {
            message: "Please check these reminders:\n\n1. Please make sure your ID is valid for at least 30 calendar days from date of application\n2. Must be valid photo ID card / passport\n3. Must match with the name you provided\n4. Make sure the ID is right side up\n5. Make sure the ID is clear and readable\n6. Avoid flash or glare\n7. An ID with an address is preferable\n8. Laminated ID with manually affixed photo is not acceptable\n\n<b style='text-transform: uppercase;'>Make sure ALL DETAILS are matched in SF+ Merchant App vs ID. Make sure as well that photos are clear and readable.</b>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "KYC [UB Response Failure]": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Pre-DO": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Pre-DO": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Final-DO": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Final-Do": {
            message: "Please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Samsung Care+": {
            message: "This claim should be linked to the SC+ Philippines claim page provided below. Please note that the page may be updated soon. Customers can submit their claims through this page if their phone requires inspection or repair.\n\n<a href='https://careplus.co/' target='_blank' rel='noopener noreferrer'>https://careplus.co/</a>\n\nAdditionally, there is no need to take any action to enroll in SC+ for SF+, as it is automatically registered in the SC+ portal.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Did not input SEC code": {
            message: "Please refresh the page using the loader button located at the upper right corner of the screen or try switching your internet connection. If the issue persists, kindly coordinate with your respective TS or OIC to manually record your sale.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Egift / Evoucher": {
            message: "Please submit your concern through the following form:\nhttps://forms.gle/1fqKRcxqxGnTMnFe8\n\nAfter submission, kindly tag Haej (0945-601-3342) or Paula (0912-710-8924) in your designated Viber group for a faster response.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Disbursment report": {
            message: "All concerns related on disbursement report, please contact to Haej (09456013342) or Pau (09127108924) to help you check with Unionbank. You may contact them via viber for faster assistance.\n\nKindly fill up below google link for us to check if registered email address is correct for disbursement report.\n<a href='https://forms.gle/1LQHQeCkfb7m2DDc6' target='_blank' rel='noopener noreferrer'>https://forms.gle/1LQHQeCkfb7m2DDc6</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Talk to agent": {
            message: "I'm connecting you to a customer service agent. Please wait a moment...",
            options: ["Main Menu"]
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
    
    // Function to find the best matching menu item based on keywords
    function findBestMatch(userMessage) {
        let bestMatch = null;
        let highestMatchCount = 0;
        const userWords = userMessage.toLowerCase().split(/\s+/);

        // Search through all menu items
        for (const [key, value] of Object.entries(menuStructure)) {
            if (key === "Back" || key === "Talk to Agent" || key === "Main Menu") continue;

            const menuWords = key.toLowerCase().split(/\s+/);
            let matchCount = 0;

            // Count matching words
            for (const userWord of userWords) {
                for (const menuWord of menuWords) {
                    if (menuWord.includes(userWord) || userWord.includes(menuWord)) {
                        matchCount++;
                        break;
                    }
                }
            }

            // Update best match if this has more matches
            if (matchCount > highestMatchCount) {
                highestMatchCount = matchCount;
                bestMatch = key;
            }
        }

        // Return the best match if it has at least 2 matching words
        return highestMatchCount >= 2 ? bestMatch : null;
    }

    // Function to process the user's message
    function processMessage(message) {
        // Check if message is a menu selection
        if (Object.keys(menuStructure).includes(message)) {
            handleMenuSelection(message);
        } else {
            // For free text input, try to find the best matching menu item
            const bestMatch = findBestMatch(message);
            
            if (bestMatch) {
                // If we found a good match, handle it as a menu selection
                setTimeout(() => {
                    handleMenuSelection(bestMatch);
                }, 1000);
            } else {
                // If no good match found, provide a generic response
                addMessage("I'm not sure about that specific concern. Let me help you find the right option.", 'bot');
                setTimeout(() => {
                    addMessage("Please select from the main menu options below:", 'bot');
                    displayQuickReplies(["Merchant App Concern", "Customer App Concern"]);
                }, 1000);
            }
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
    
    // Function to scroll to bottom
    function scrollToBottom() {
        const chatContent = document.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
        // Add a small delay to ensure content is rendered
            setTimeout(() => {
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 100);
    }
    
    // Function to add a message to the chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerHTML = message.replace(/\n/g, '<br>');
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        scrollToBottom();
        
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
        scrollToBottom();
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
                    scrollToBottom();
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
                    scrollToBottom();
                });
                
                quickReplySection.appendChild(backButton);
            }
            
            // Scroll to bottom after adding buttons
            scrollToBottom();
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

    // Add chatbot overlay functionality
    const startChatBtn = document.getElementById('start-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');

    startChatBtn.addEventListener('click', function() {
        chatbotOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    closeChatBtn.addEventListener('click', function() {
        chatbotOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });

    // Close overlay when clicking outside the chat container
    chatbotOverlay.addEventListener('click', function(e) {
        if (e.target === chatbotOverlay) {
            chatbotOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
