document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Conversation history and context
    const conversationHistory = [];
    let currentContext = null;
    
    // Add quick reply container to the DOM
    const quickReplyContainer = document.createElement('div');
    quickReplyContainer.className = 'quick-reply-container';
    document.querySelector('.chat-input').before(quickReplyContainer);
    
    // Initial bot message
    addMessage("Hello! I'm your Samsung Finance+ virtual assistant. How can I help you today?", 'bot');
    displayQuickReplies([
        "KYC Issues", 
        "Payment & Loan Issues", 
        "Application & System Errors", 
        "Product & Order Issues", 
        "Device Security & Lock Issues", 
        "Device Replacement Inquiries"
    ]);
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // ======================================
    // KNOWLEDGE BASE - SEPARATE MODULES
    // ======================================
    
    // Debugging log helper
    function logKnowledgeBase(name, array) {
        console.log(`${name} loaded with ${array.length} entries`);
        if (array.length > 0) {
            console.log(`First entry keywords: ${array[0].keywords.join(', ')}`);
        }
    }
    
    // General queries
    const generalKnowledge = [
        {
            keywords: ['hello', 'hi', 'hey'],
            response: {
                message: "Hello! How can I assist you with Samsung Finance+ today?",
                quickReplies: [
                    "KYC Issues", 
                    "Payment & Loan Issues", 
                    "Application & System Errors", 
                    "Product & Order Issues", 
                    "Device Security & Lock Issues", 
                    "Device Replacement Inquiries"
                ]
            }
        },
        {
            keywords: ['help', 'support', 'assist'],
            response: {
                message: "I'm here to help with Samsung Finance+! Please select one of the common topics below or type your question.",
                quickReplies: [
                    "KYC Issues", 
                    "Payment & Loan Issues", 
                    "Application & System Errors", 
                    "Product & Order Issues", 
                    "Device Security & Lock Issues", 
                    "Device Replacement Inquiries"
                ]
            }
        },
        {
            keywords: ['thank', 'thanks'],
            response: {
                message: "You're welcome! Is there anything else I can help you with regarding Samsung Finance+?",
                quickReplies: ["Yes", "No, that's all"]
            }
        },
        {
            keywords: ['bye', 'goodbye'],
            response: {
                message: "Thank you for chatting with me today about Samsung Finance+. If you need further assistance, don't hesitate to reach out. Have a great day!",
                quickReplies: ["Start a new chat", "Rate this conversation"]
            }
        },
        {
            keywords: ['agent', 'human', 'person', 'representative', 'talk to someone'],
            response: {
                message: "I'll connect you with a Samsung Finance+ customer service representative. Please note that wait times may vary. Would you like to proceed?",
                context: 'human_support',
                quickReplies: ["Yes, connect me", "No, continue with bot"]
            }
        }
    ];
    
    // Samsung Finance+ KYC Issues
    const kycIssuesKnowledge = [
        {
            keywords: ['kyc', 'know your customer', 'verification', 'identity verification'],
            response: {
                message: "I can help with Samsung Finance+ KYC issues. What specific assistance do you need?",
                context: 'kyc_issues',
                quickReplies: ["KYC Failed", "KYC validation in progress", "Valid ID requirements", "Other KYC issue"]
            }
        },
        {
            keywords: ['kyc failed', 'verification failed', 'identity failed'],
            response: {
                message: "If your KYC failed, please check these reminders:\n1. ID must be valid for at least 30 calendar days from application date\n2. Must be valid photo ID/passport\n3. Must match with the name you provided\n4. ID must be right side up\n5. ID must be clear and readable\n6. Avoid flash or glare\n7. ID with address is preferable\n8. Laminated ID with manually affixed photo is not acceptable\n\nMake sure ALL DETAILS match in SF+ Merchant App vs ID, and photos are clear and readable.",
                context: 'kyc_failed',
                quickReplies: ["Try again with different ID", "KYC validation in progress", "Valid ID list", "Other issue"]
            }
        },
        {
            keywords: ['kyc validation', 'validation in progress', 'kyc processing'],
            response: {
                message: "Please wait for the KYC result to come out as it needs more time to decide. If the same issue persists, please change to a more stable internet connection or cancel and reprocess the application.",
                context: 'kyc_validation',
                quickReplies: ["How long will it take?", "Cancel application", "Try different internet", "Other KYC issue"]
            }
        },
        {
            keywords: ['valid id', 'acceptable id', 'id requirements'],
            response: {
                message: "For Samsung Finance+ KYC, please ensure your ID:\n1. Is valid for at least 30 calendar days from application date\n2. Is a valid photo ID/passport\n3. Matches the name you provided\n4. Is right side up\n5. Is clear and readable\n6. Has no flash or glare\n7. Includes your address (preferable)\n8. Is not a laminated ID with manually affixed photo",
                context: 'valid_id',
                quickReplies: ["Try again with proper ID", "KYC failed", "Other issue"]
            }
        }
    ];

    // Samsung Finance+ Payment & Loan Issues
    const paymentLoanIssuesKnowledge = [
        {
            keywords: ['loan payment', 'pay loan', 'sf+ loan', 'samsung finance+ payment'],
            response: {
                message: "I can help with Samsung Finance+ loan payment issues. What specific assistance do you need?",
                context: 'loan_payment_issues',
                quickReplies: ["How to pay loan", "Locked due to late payment", "Payment not reflected", "Offline payment method", "Loan cancellation", "Reloan inquiries", "Disbursement inquiries"]
            }
        },
        {
            keywords: ['how to pay', 'payment method', 'pay sf+'],
            response: {
                message: "Please make your payments via the SF+ Customer App. Payments made outside of the SF+ Customer App will not be reflected in our system and may result in your device being locked.\n\nOnline payment channels:\n- Gcash\n- GrabPay\n\nOver-the-counter payment channels:\n- Cebuana Lhuillier\n- Palawan Pawnshop\n- M.Lhuillier\n- Bayad Center\n- ECPay\n- SM Store\n- Robinsons Department Store\n\nTo further understand, please refer to the video tutorial on SF+ payment: https://youtu.be/bwFJBtTxQck?si=biicPHdL8CltExXX",
                context: 'how_to_pay',
                quickReplies: ["Online payment", "Over-the-counter", "Watch video tutorial", "Other payment issue"]
            }
        },
        {
            keywords: ['locked', 'device locked', 'late payment'],
            response: {
                message: "Please try opening the app first. Even if the device is locked, you can still make a payment through the app as long as it is connected to the internet and the app's location permission is turned on.\n\nIf the SF+ app does not open on your device, please submit the detailed concern here so we can check it in the system: https://docs.google.com/forms/d/e/1FAIpQLSf52QAaFEgC0kbSy6CiLOvMOJ3cmmat8G1AjWeb-udCDQmIqQ/viewform",
                context: 'device_locked',
                quickReplies: ["App won't open", "Make payment", "Other issue"]
            }
        },
        {
            keywords: ['payment not reflected', 'missing payment', 'payment issue'],
            response: {
                message: "For payment not reflected issues, you may contact UnionBank through samsungfinanceloans@unionbankph.com. Please fill out this form for us to help follow up with UnionBank: https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform",
                context: 'payment_not_reflected',
                quickReplies: ["Contact UnionBank", "Fill out form", "Other payment issue"]
            }
        },
        {
            keywords: ['offline payment', 'pay offline'],
            response: {
                message: "There are instructions in your SF+ app for offline payments. Make sure you have selected your chosen mode of payment first, then scroll through the app. From there, you will see the correct biller's name to input on the form and the reference number.\n\nFor more payment inquiries, please refer here: https://youtu.be/bwFJBtTxQck?si=biicPHdL8CltExXX",
                context: 'offline_payment',
                quickReplies: ["Watch video tutorial", "Other payment issue"]
            }
        },
        {
            keywords: ['cancel loan', 'loan cancellation', 'cancel purchase'],
            response: {
                message: "For loan cancellation of a completed purchase, kindly align the concern to your Store TS or OIC. You may also raise this concern to sfhelpdesk@unionbankph.com to further assist you with the requirements to complete the loan cancellation.",
                context: 'loan_cancellation',
                quickReplies: ["Contact Store TS", "Email UnionBank", "Other loan issue"]
            }
        },
        {
            keywords: ['reloan', 're-loan', 'another loan'],
            response: {
                message: "As of now, reloan is not yet allowed. Reloan is not implemented on the UB side yet, even if your previous loan was fully paid through SF+. Once it is implemented, we will provide an update to ensure everyone is informed.",
                context: 'reloan',
                quickReplies: ["When will it be available?", "Other loan option", "Other inquiry"]
            }
        },
        {
            keywords: ['disbursement', 'loan disbursement'],
            response: {
                message: "For disbursement inquiries, please contact Haej (09456013342) or Pau (09127108924) to help you check with Unionbank. You may contact them via Viber for faster assistance.\n\nPlease fill up this form for us to check if your registered email address is correct for the disbursement report: https://forms.gle/1LQHQeCkfb7m2DDc6",
                context: 'disbursement',
                quickReplies: ["Fill out form", "Contact via Viber", "Other disbursement issue"]
            }
        }
    ];

    // Samsung Finance+ Application & System Errors
    const appSystemErrorsKnowledge = [
        {
            keywords: ['system error', 'application error', 'sf+ error'],
            response: {
                message: "I can help with Samsung Finance+ application and system errors. What specific issue are you experiencing?",
                context: 'system_errors',
                quickReplies: ["Something went wrong", "Application timed out", "Connection error", "Application rejected", "Failed to setup app", "Tablet purchase issues", "New SIM detected"]
            }
        },
        {
            keywords: ['something went wrong', 'pending', 'try again'],
            response: {
                message: "For 'Something went wrong' or 'Pending and try again after 5 minutes' errors:\n- Ensure there are no special characters in Name, Employer's Name, and Address fields.\n- Check spaces and first letter of each word must be uppercase (e.g., Pasay City).\n- Try canceling and reprocessing a new application.\n\nIf the error persists, the customer either has:\n1. Existing applications with UB/SF+\n2. Rejected UB/SF+ transactions and can retry 3 months later",
                context: 'something_went_wrong',
                quickReplies: ["Check application details", "Cancel and reprocess", "Other system error"]
            }
        },
        {
            keywords: ['timeout', 'timed out'],
            response: {
                message: "For timeout issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
                context: 'timeout',
                quickReplies: ["Refresh page", "Switch connection", "Cancel and reprocess", "Other error"]
            }
        },
        {
            keywords: ['connection error', 'connection issue'],
            response: {
                message: "For connection error issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
                context: 'connection_error',
                quickReplies: ["Refresh page", "Switch connection", "Cancel and reprocess", "Other error"]
            }
        },
        {
            keywords: ['application rejected', 'rejected', 'declined'],
            response: {
                message: "For rejected applications, this is a bank decision and the bank does not disclose the reason. You may opt to restart a new application or retry after 90 days/3 months.\n\nNOTE: If you still want to know the reason, you can send an email to samsungfinanceloans@unionbankph.com",
                context: 'application_rejected',
                quickReplies: ["Restart application", "Email bank", "Other issue"]
            }
        },
        {
            keywords: ['failed to setup', 'setup failed', 'customer app setup'],
            response: {
                message: "For failed SF+ Customer App setup, please check:\n1. Customer's SIM card used in SF+ merchant app must be inserted in slot 1 before setting up.\n2. SIM card in slot 1 must have regular load of at least ₱1.\n3. Device must be connected to stable internet via WiFi or mobile data.\n4. If app isn't installed automatically, ensure software is up-to-date, then restart.\n5. If app isn't downloaded within 3 minutes, try connecting to https://guard.samsungknox.com\n\nIf nothing works, DO A FACTORY RESET.",
                context: 'setup_failed',
                quickReplies: ["Check SIM card", "Check internet", "Factory reset", "Other setup issue"]
            }
        },
        {
            keywords: ['tablet purchase', 'android phone', 'install on android'],
            response: {
                message: "For installing customer app on Android device, follow these steps:\n\n1. Check Android Version: Ensure Android 8.1 or higher (Settings > About Phone > Software Information).\n\n2. Disable Google Play Protect:\n- Open Google Play Store\n- Tap profile icon (top-right)\n- Select Play Protect > Settings (gear icon)\n- Turn off 'Scan apps with Play Protect'\n\n3. Turn Off Auto Blocker:\n- Go to Settings > Security/Privacy\n- Disable any app-blocking settings temporarily\n\n4. Install SF+ Customer App via QR code",
                context: 'tablet_purchase',
                quickReplies: ["Check Android version", "Disable Play Protect", "Other installation issue"]
            }
        },
        {
            keywords: ['new sim', 'sim detected', 'different sim'],
            response: {
                message: "The 'New SIM card detected' prompt appears if the SIM card used during the transaction is no longer inserted in slot 1. You need to update the primary registered number.\n\nPlease follow this guide: https://docs.google.com/presentation/d/1HLjyNro7-RIdv1UPNKzU1H3Cghw8f1IIcVz4Q8lF3Hc/edit?usp=sharing",
                context: 'new_sim',
                quickReplies: ["Update SIM details", "Follow guide", "Other SIM issue"]
            }
        }
    ];

    // Product & Order Issues
    const productOrderIssuesKnowledge = [
        {
            keywords: ['product issue', 'order issue', 'product not displayed', 'blank order'],
            response: {
                message: "I can help with Samsung Finance+ product and order issues. What specific problem are you experiencing?",
                context: 'product_order_issues',
                quickReplies: ["Product not displayed", "Blank pre-delivery order", "Blank final delivery order", "Missing EMI schedule"]
            }
        },
        {
            keywords: ['product not display', 'offers screen', 'no product', 'missing product'],
            response: {
                message: "If your selected product didn't display in the 'Offers' screen, this is dependent on your credit score and annual income provided. The devices shown in the offers are based on UB's decisions. Would you consider any of the other models available in the offers?",
                context: 'product_not_displayed',
                quickReplies: ["View other models", "Credit score issue", "Other product issue"]
            }
        },
        {
            keywords: ['blank pre-delivery', 'pre-delivery blank'],
            response: {
                message: "For blank pre-delivery order issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection. If the issue still persists, please cancel and reprocess.",
                context: 'blank_pre_delivery',
                quickReplies: ["Refresh page", "Switch connection", "Cancel and reprocess", "Other order issue"]
            }
        },
        {
            keywords: ['blank final delivery', 'final delivery blank'],
            response: {
                message: "For blank final delivery order issues, please keep refreshing the page using the loader button at the upper right of the screen or try switching your connection.",
                context: 'blank_final_delivery',
                quickReplies: ["Refresh page", "Switch connection", "Other order issue"]
            }
        },
        {
            keywords: ['missing emi', 'emi schedule', 'no emi'],
            response: {
                message: "UB is currently working on resolving the missing EMI schedule issue. Please wait for the EMI to appear in the app and check periodically.",
                context: 'missing_emi',
                quickReplies: ["How often to check?", "Contact UB", "Other EMI issue"]
            }
        }
    ];

    // Device Security & Lock Issues
    const deviceSecurityIssuesKnowledge = [
        {
            keywords: ['device security', 'lock issue', 'security issue'],
            response: {
                message: "I can help with Samsung Finance+ device security and lock issues. What specific problem are you experiencing?",
                context: 'device_security',
                quickReplies: ["Lost or stolen device", "Locked due to offline usage", "Other security issue"]
            }
        },
        {
            keywords: ['lost device', 'stolen device', 'lost phone', 'stolen phone'],
            response: {
                message: "For lost or stolen Samsung Finance+ devices, please report the loan details in this form so we can mark it as lost and lock the device: https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform\n\nAfter reporting through the link, please also report this to UnionBank via samsungfinanceloans@unionbankph.com\n\nNote that you will still need to pay your monthly loan amounts, or your account will be considered delinquent.\n\nPlease include:\na. Full name\nb. Loan Account ID\nc. Concern (subject of email) and background",
                context: 'lost_stolen',
                quickReplies: ["Fill out form", "Contact UnionBank", "Payment obligations", "Other issue"]
            }
        },
        {
            keywords: ['offline usage', 'locked offline', 'offline lock'],
            response: {
                message: "Due to security policy, devices get locked if they are offline and not connected to the internet for too long. To prevent this, make sure your device is online and in use. If it locks, connect to the internet, go to Support on the home screen, and click Update Policy.",
                context: 'offline_lock',
                quickReplies: ["Update policy", "Connect to internet", "Other lock issue"]
            }
        }
    ];

    // Product & Warranty Inquiries
    const productWarrantyInquiriesKnowledge = [
        {
            keywords: ['warranty', 'product warranty', 'device warranty'],
            response: {
                message: "I can help with Samsung Finance+ product and warranty inquiries. What specific information do you need?",
                context: 'warranty_inquiries',
                quickReplies: ["DOA Replace", "Tablet purchase journey", "Other warranty issue"]
            }
        },
        {
            keywords: ['doa', 'defective', 'replace device', 'replacement'],
            response: {
                message: "To replace a defective device (DOA), kindly follow this step-by-step guide: https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing\n\nReminder! Once the swap is successful, perform a Factory Reset on the defective device to uninstall the SF+ App.",
                context: 'doa_replace',
                quickReplies: ["Follow guide", "Factory reset help", "Other replacement issue"]
            }
        },
        {
            keywords: ['tablet purchase', 'tablet journey', 'buy tablet'],
            response: {
                message: "For Tablet Purchase journey information, please refer to slides 16-22 for SF+ Customer App setup guide and reminders: https://docs.google.com/presentation/d/1QMljVSUBFwtJBv7-A_G7nK_7ksO6cijoDh7K1NjoLEs/edit?usp=sharing",
                context: 'tablet_purchase_journey',
                quickReplies: ["Setup guide", "App reminders", "Other tablet issue"]
            }
        }
    ];

    // Combine all knowledge modules into a single knowledgeBase array
    const knowledgeBase = [
        ...generalKnowledge,
        ...kycIssuesKnowledge,
        ...paymentLoanIssuesKnowledge,
        ...appSystemErrorsKnowledge,
        ...productOrderIssuesKnowledge,
        ...deviceSecurityIssuesKnowledge,
        ...productWarrantyInquiriesKnowledge
    ];

    // Add a console log to confirm all entries are loaded
    console.log("===== SAMSUNG FINANCE+ KNOWLEDGE BASE DEBUGGING =====");
    console.log(`Total knowledge base entries: ${knowledgeBase.length}`);
    console.log(`General knowledge entries: ${generalKnowledge.length}`);
    console.log(`KYC issues entries: ${kycIssuesKnowledge.length}`);
    console.log(`Payment/loan issues entries: ${paymentLoanIssuesKnowledge.length}`);
    console.log(`App/system errors entries: ${appSystemErrorsKnowledge.length}`);
    console.log(`Product/order issues entries: ${productOrderIssuesKnowledge.length}`);
    console.log(`Device security issues entries: ${deviceSecurityIssuesKnowledge.length}`);
    console.log(`Product warranty entries: ${productWarrantyInquiriesKnowledge.length}`);
    console.log("=====================================")
    
    // ======================================
    // CONTEXTUAL RESPONSES - BY TOPIC
    // ======================================
    
    // Master function for getting contextual responses
    function getContextualResponse(message, context) {
        // Samsung Finance+ specific context handlers
        if (context.startsWith('kyc') || context.includes('kyc')) {
            return getKycContextResponse(message, context);
        } else if (context.includes('loan') || context.includes('payment') || context.includes('disbursement')) {
            return getLoanPaymentContextResponse(message, context);
        } else if (context.includes('error') || context.includes('system') || context.includes('app') || 
                  context.includes('setup') || context.includes('sim')) {
            return getSystemErrorContextResponse(message, context);
        } else if (context.includes('product') || context.includes('order') || context.includes('emi')) {
            return getProductOrderContextResponse(message, context);
        } else if (context.includes('security') || context.includes('lock') || context.includes('stolen')) {
            return getSecurityContextResponse(message, context);
        } else if (context.includes('warranty') || context.includes('replace') || context.includes('doa')) {
            return getWarrantyContextResponse(message, context);
        }
        
        // If no specific handler found, return null
        return null;
    }
    
    // ======================================
    // SAMSUNG FINANCE+ CONTEXTUAL RESPONSES
    // ======================================
    
    // KYC contextual responses
    function getKycContextResponse(message, subContext) {
        if (subContext === 'kyc_failed') {
            if (message.includes('try again') || message.includes('different id')) {
                return {
                    message: "You can try again with a different ID. Make sure it meets all the requirements: valid for 30+ days, clear photo, no glare, right side up, and matches the name provided. Would you like to try submitting a new application?",
                    context: 'kyc_retry',
                    quickReplies: ["Submit new application", "ID requirements", "Other issue"]
                };
            } else if (message.includes('id list') || message.includes('accepted id') || message.includes('valid id')) {
                return {
                    message: "Samsung Finance+ accepts government-issued photo IDs such as Driver's License, Passport, SSS ID, PhilHealth ID, Postal ID, Voter's ID, PRC ID, UMID, etc. The ID should be valid for at least 30 calendar days from the date of application.",
                    context: 'valid_id',
                    quickReplies: ["Try again with proper ID", "Other issue"]
                };
            }
        } else if (subContext === 'kyc_validation') {
            if (message.includes('how long') || message.includes('waiting time')) {
                return {
                    message: "KYC validation typically takes a few minutes, but in some cases, it may take longer due to verification requirements. If it's taking more than 15-20 minutes, we recommend checking your internet connection or canceling and reprocessing the application.",
                    context: 'kyc_validation',
                    quickReplies: ["Cancel application", "Reprocess", "Other KYC issue"]
                };
            } else if (message.includes('cancel') || message.includes('reprocess')) {
                return {
                    message: "You can cancel the current application and start a new one. This often resolves KYC validation issues, especially if they're related to connectivity problems.",
                    context: 'kyc_reprocess',
                    quickReplies: ["How to cancel", "Start new application", "Other issue"]
                };
            }
        } else if (subContext === 'valid_id') {
            if (message.includes('try again') || message.includes('proper id')) {
                return {
                    message: "Great! When trying again, please ensure you're using proper lighting when taking photos of your ID - avoid shadows, glare, and make sure all text is clearly readable. Position the ID properly in the frame and ensure all edges are visible.",
                    context: 'kyc_retry',
                    quickReplies: ["ID photo tips", "Start new application", "Other issue"]
                };
            }
        }
        return null;
    }
    
    // Loan and payment contextual responses
    function getLoanPaymentContextResponse(message, subContext) {
        if (subContext === 'loan_payment_issues' || subContext === 'how_to_pay') {
            if (message.includes('online') || message.includes('gcash') || message.includes('grabpay')) {
                return {
                    message: "For online payments through GCash or GrabPay:\n1. Open your SF+ Customer App\n2. Go to the Payment section\n3. Select GCash or GrabPay as your payment method\n4. Follow the instructions to complete the payment\n5. Keep the reference number for your records",
                    context: 'online_payment',
                    quickReplies: ["Payment not reflected", "Other payment options", "Other issue"]
                };
            } else if (message.includes('counter') || message.includes('cebuana') || message.includes('bayad') || message.includes('palawan')) {
                return {
                    message: "For over-the-counter payments:\n1. Open your SF+ Customer App\n2. Go to the Payment section\n3. Select your preferred payment center (Cebuana, Palawan, etc.)\n4. Take note of the reference number shown in the app\n5. Visit the payment center and provide this reference number\n6. Keep your receipt as proof of payment",
                    context: 'otc_payment',
                    quickReplies: ["Payment centers near me", "Payment not reflected", "Other issue"]
                };
            } else if (message.includes('video') || message.includes('tutorial')) {
                return {
                    message: "You can watch a detailed video tutorial on how to make payments for your Samsung Finance+ loan here: https://youtu.be/bwFJBtTxQck?si=biicPHdL8CltExXX",
                    context: 'payment_tutorial',
                    quickReplies: ["Other payment methods", "Payment issues", "Other question"]
                };
            }
        } else if (subContext === 'device_locked') {
            if (message.includes('won\'t open') || message.includes('cannot open')) {
                return {
                    message: "If the SF+ app doesn't open on your locked device, please submit your concern through this form so we can check it in our system: https://docs.google.com/forms/d/e/1FAIpQLSf52QAaFEgC0kbSy6CiLOvMOJ3cmmat8G1AjWeb-udCDQmIqQ/viewform",
                    context: 'locked_device_help',
                    quickReplies: ["Fill out form", "Other options", "Other issue"]
                };
            } else if (message.includes('make payment') || message.includes('pay now')) {
                return {
                    message: "To make a payment on a locked device:\n1. Ensure the device is connected to the internet\n2. Make sure location permissions are enabled for the SF+ app\n3. Open the SF+ app (it should open even if the device is locked)\n4. Navigate to the Payment section\n5. Choose your payment method and complete the transaction",
                    context: 'payment_on_locked',
                    quickReplies: ["App won't open", "Payment methods", "Other issue"]
                };
            }
        } else if (subContext === 'payment_not_reflected') {
            if (message.includes('contact') || message.includes('unionbank') || message.includes('bank')) {
                return {
                    message: "You can contact UnionBank regarding payment issues by sending an email to samsungfinanceloans@unionbankph.com. Please include your full name, loan account ID, and details about your payment (date, amount, reference number, payment method, etc.).",
                    context: 'contact_bank',
                    quickReplies: ["Fill out form", "Payment proof required?", "Other issue"]
                };
            } else if (message.includes('form') || message.includes('fill out')) {
                return {
                    message: "Please fill out this form to help us follow up with UnionBank about your payment issue: https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform",
                    context: 'payment_follow_up',
                    quickReplies: ["What details to include", "Contact UnionBank directly", "Other issue"]
                };
            }
        }
        return null;
    }
    
    // System errors contextual responses
    function getSystemErrorContextResponse(message, subContext) {
        if (subContext === 'something_went_wrong') {
            if (message.includes('application details') || message.includes('check details')) {
                return {
                    message: "Please check these details in your application:\n- Ensure there are no special characters in Name, Employer's Name, and Address fields\n- First letter of each word should be uppercase (e.g., Pasay City)\n- Review all fields for accuracy\n\nThese issues often cause the 'Something went wrong' error.",
                    context: 'check_application',
                    quickReplies: ["Cancel and reprocess", "Other system error", "Contact support"]
                };
            } else if (message.includes('cancel') || message.includes('reprocess')) {
                return {
                    message: "Canceling and reprocessing often resolves this issue. To do this:\n1. Cancel the current application\n2. Start a fresh application\n3. Carefully enter all details following the proper format\n4. Ensure you're using a stable internet connection",
                    context: 'reprocess_application',
                    quickReplies: ["How to cancel", "Other issue"]
                };
            }
        } else if (subContext.includes('timeout') || subContext.includes('connection_error')) {
            if (message.includes('refresh') || message.includes('page')) {
                return {
                    message: "To refresh the page, locate and click the loader button at the upper right of the screen. Try doing this several times if the issue persists.",
                    context: 'refresh_page',
                    quickReplies: ["Switch connection", "Cancel and reprocess", "Other error"]
                };
            } else if (message.includes('switch') || message.includes('connection')) {
                return {
                    message: "Switching to a more stable connection often helps. Try:\n- Switching from mobile data to WiFi or vice versa\n- Moving to an area with better signal\n- Restarting your router if you're on WiFi\n- Turning airplane mode on and off to reset your connection",
                    context: 'switch_connection',
                    quickReplies: ["Refresh page", "Cancel and reprocess", "Other error"]
                };
            }
        } else if (subContext === 'setup_failed') {
            if (message.includes('sim') || message.includes('slot')) {
                return {
                    message: "For SIM card issues:\n1. Ensure the same SIM card used during the SF+ merchant app transaction is inserted in slot 1\n2. Make sure the SIM has at least ₱1 regular load\n3. The SIM should be properly activated and working\n4. Try removing and reinserting the SIM card",
                    context: 'sim_issues',
                    quickReplies: ["Check internet", "Factory reset", "Other setup issue"]
                };
            } else if (message.includes('internet') || message.includes('connection')) {
                return {
                    message: "For internet connection issues:\n1. Ensure the device is connected to a stable WiFi or mobile data\n2. Try switching between WiFi and mobile data\n3. Move to an area with better signal\n4. Restart your router if you're on WiFi",
                    context: 'internet_issues',
                    quickReplies: ["Factory reset", "Check SIM card", "Other setup issue"]
                };
            } else if (message.includes('factory') || message.includes('reset')) {
                return {
                    message: "If all else fails, perform a factory reset:\n1. Back up any important data on the device\n2. Go to Settings > General Management > Reset > Factory data reset\n3. Follow the prompts to complete the reset\n4. After reset, try setting up the SF+ Customer App again",
                    context: 'factory_reset',
                    quickReplies: ["Setup after reset", "Other issue"]
                };
            }
        }
        return null;
    }
    
    // Product order contextual responses
    function getProductOrderContextResponse(message, subContext) {
        if (subContext === 'product_not_displayed') {
            if (message.includes('other models') || message.includes('view models')) {
                return {
                    message: "We recommend reviewing the available models shown in your offers. These are based on your credit assessment by UnionBank. Even if your preferred model isn't available, you might find a suitable alternative among the offered devices.",
                    context: 'alternative_models',
                    quickReplies: ["Credit score issue", "Apply again later", "Other product issue"]
                };
            } else if (message.includes('credit score') || message.includes('score issue')) {
                return {
                    message: "The devices shown in your offers are based on your credit assessment. If you don't see higher-end models, it may be due to credit scoring factors. You could potentially improve this by:\n- Increasing your declared income (if accurate)\n- Applying again after a few months\n- Building your credit history with other financial institutions",
                    context: 'credit_score',
                    quickReplies: ["View available models", "Apply later", "Other issue"]
                };
            }
        } else if (subContext.includes('blank') || subContext.includes('delivery')) {
            if (message.includes('refresh') || message.includes('page')) {
                return {
                    message: "To refresh the page, locate and click the loader button at the upper right of the screen. Try doing this several times if the issue persists.",
                    context: 'refresh_page',
                    quickReplies: ["Switch connection", "Cancel and reprocess", "Other error"]
                };
            } else if (message.includes('switch') || message.includes('connection')) {
                return {
                    message: "Switching to a more stable connection often helps with blank order screens. Try:\n- Switching from mobile data to WiFi or vice versa\n- Moving to an area with better signal\n- Restarting your router if you're on WiFi",
                    context: 'switch_connection',
                    quickReplies: ["Refresh page", "Cancel and reprocess", "Other order issue"]
                };
            }
        } else if (subContext === 'missing_emi') {
            if (message.includes('check') || message.includes('often')) {
                return {
                    message: "We recommend checking your SF+ app every 24-48 hours to see if the EMI schedule has appeared. UnionBank is working on resolving this issue, and it may take some time for the schedule to be generated and displayed in your app.",
                    context: 'check_emi',
                    quickReplies: ["Contact UB", "Other EMI issue"]
                };
            } else if (message.includes('contact') || message.includes('ub')) {
                return {
                    message: "For EMI schedule concerns, you can contact UnionBank via email at samsungfinanceloans@unionbankph.com. Please include your full name, loan account ID, and specify that you're inquiring about your missing EMI schedule.",
                    context: 'contact_ub_emi',
                    quickReplies: ["Check app regularly", "Other issue"]
                };
            }
        }
        return null;
    }
    
    // Security contextual responses
    function getSecurityContextResponse(message, subContext) {
        if (subContext === 'lost_stolen') {
            if (message.includes('form') || message.includes('fill out')) {
                return {
                    message: "Please report your lost or stolen device by filling out this form: https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform\n\nThis will allow us to mark your device as lost and lock it for security purposes.",
                    context: 'report_lost_device',
                    quickReplies: ["Contact UnionBank", "Payment obligations", "Other issue"]
                };
            } else if (message.includes('contact') || message.includes('unionbank') || message.includes('bank')) {
                return {
                    message: "After reporting through our form, please also report the lost/stolen device to UnionBank via email at samsungfinanceloans@unionbankph.com. Include your:\na. Full name\nb. Loan Account ID\nc. Details about when and how the device was lost/stolen",
                    context: 'contact_bank_lost',
                    quickReplies: ["Fill out form", "Payment obligations", "Other issue"]
                };
            } else if (message.includes('payment') || message.includes('obligation')) {
                return {
                    message: "Even if your device is lost or stolen, you are still obligated to continue making your monthly loan payments. Failure to do so will result in your account being considered delinquent, which may affect your credit score and future loan eligibility.",
                    context: 'payment_obligations',
                    quickReplies: ["How to pay", "Report lost device", "Other issue"]
                };
            }
        } else if (subContext === 'offline_lock') {
            if (message.includes('update policy') || message.includes('policy')) {
                return {
                    message: "To update policy on a locked device:\n1. Connect the device to the internet (WiFi or mobile data)\n2. Go to the Support section on the home screen of your device\n3. Click on 'Update Policy'\n4. Wait for the policy to update and your device should unlock",
                    context: 'update_policy',
                    quickReplies: ["Still locked", "Other lock issue"]
                };
            } else if (message.includes('connect') || message.includes('internet')) {
                return {
                    message: "To prevent your device from being locked due to offline usage, ensure it regularly connects to the internet. Set up automatic connections to known WiFi networks, or make sure mobile data is enabled periodically. The device needs to connect at least once every few days to verify its status.",
                    context: 'prevent_lock',
                    quickReplies: ["Update policy", "Still locked", "Other issue"]
                };
            }
        }
        return null;
    }
    
    // Warranty contextual responses
    function getWarrantyContextResponse(message, subContext) {
        if (subContext === 'doa_replace') {
            if (message.includes('guide') || message.includes('follow')) {
                return {
                    message: "Please follow the step-by-step guide for replacing a defective device (DOA) here: https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing",
                    context: 'replacement_guide',
                    quickReplies: ["Factory reset help", "Other replacement issue"]
                };
            } else if (message.includes('factory') || message.includes('reset')) {
                return {
                    message: "After successfully swapping your device, perform a factory reset on the defective device to uninstall the SF+ App:\n1. Back up any important data\n2. Go to Settings > General Management > Reset > Factory data reset\n3. Follow the prompts to complete the reset\n\nThis step is important to ensure the SF+ app is completely removed from the defective device.",
                    context: 'factory_reset_doa',
                    quickReplies: ["Follow replacement guide", "Other issue"]
                };
            }
        } else if (subContext === 'tablet_purchase_journey') {
            if (message.includes('setup') || message.includes('guide')) {
                return {
                    message: "For the SF+ Customer App setup guide for tablet purchases, please refer to slides 16-22 in this presentation: https://docs.google.com/presentation/d/1QMljVSUBFwtJBv7-A_G7nK_7ksO6cijoDh7K1NjoLEs/edit?usp=sharing",
                    context: 'tablet_setup',
                    quickReplies: ["App reminders", "Setup issues", "Other tablet issue"]
                };
            } else if (message.includes('reminder') || message.includes('app reminder')) {
                return {
                    message: "Important reminders for tablet setup:\n1. Ensure stable internet connection\n2. Install on Android 8.1 or higher\n3. Disable Google Play Protect temporarily\n4. Turn off any app blockers in security settings\n5. Follow the QR code installation process carefully",
                    context: 'tablet_reminders',
                    quickReplies: ["Setup guide", "Setup issues", "Other tablet issue"]
                };
            }
        }
        return null;
    }
    
    // ======================================
    // CORE FUNCTIONS 
    // ======================================
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Add to conversation history
        conversationHistory.push({
            sender: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Process the message and get a response
        processMessage(message);
    }
    
    function addMessage(message, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = message;
        
        messageContainer.appendChild(messageElement);
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // If it's a bot message, add it to history
        if (sender === 'bot') {
            conversationHistory.push({
                sender: 'bot',
                message: message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicator.appendChild(dot);
        }
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    function displayQuickReplies(replies) {
        // Clear existing quick replies
        quickReplyContainer.innerHTML = '';
        
        // Create and add new quick reply buttons
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', () => {
                userInput.value = reply;
                sendMessage();
                // Clear quick replies after selection
                quickReplyContainer.innerHTML = '';
            });
            quickReplyContainer.appendChild(button);
        });
    }
    
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Use the knowledge base to find a response
        const response = findResponseInKnowledgeBase(lowerMessage);
        
        setTimeout(() => {
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response
            addMessage(response.message, 'bot');
            
            // Update context if needed
            if (response.context) {
                currentContext = response.context;
            }
            
            // Show quick replies if available
            if (response.quickReplies && response.quickReplies.length > 0) {
                displayQuickReplies(response.quickReplies);
            }
        }, 1500); // Simulate thinking time
    }
    
    function findResponseInKnowledgeBase(message) {
        // Default response if nothing matches
        let defaultResponse = {
            message: "I'm not sure I understand. Could you please rephrase your question about Samsung Finance+?",
            quickReplies: [
                "KYC Issues", 
                "Payment & Loan Issues", 
                "Application & System Errors", 
                "Product & Order Issues", 
                "Device Security & Lock Issues", 
                "Device Replacement Inquiries"
            ]
        };
        
        // First, check if the message is continuing a context
        if (currentContext) {
            console.log("Current context:", currentContext);
            const contextResponse = getContextualResponse(message, currentContext);
            if (contextResponse) {
                console.log("Found contextual response for:", message);
                return contextResponse;
            }
        }
        
        // Check in our knowledge base
        console.log("Searching knowledge base for:", message);
        const lowerMessage = message.toLowerCase();
        
        // Look for exact matches first (higher priority)
        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                // Perform an exact match to avoid false positives with short keywords
                if (keyword.length > 3 && lowerMessage.includes(keyword)) {
                    console.log(`Match found for keyword: "${keyword}"`);
                    return entry.response;
                }
            }
        }
        
        // For very short queries, try a looser match
        if (lowerMessage.length < 10) {
            for (const entry of knowledgeBase) {
                for (const keyword of entry.keywords) {
                    // For short keywords (3 chars or less), only match if it's a whole word
                    if (keyword.length <= 3) {
                        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                        if (regex.test(lowerMessage)) {
                            console.log(`Word boundary match found for keyword: "${keyword}"`);
                            return entry.response;
                        }
                    }
                }
            }
        }
        
        console.log("No match found, returning default response");
        return defaultResponse;
    }

    // Add a debug utility to test keyword matching - accessible via browser console
    window.testKeyword = function(keyword) {
        console.log(`Testing keyword: "${keyword}"`);
        const lowerKeyword = keyword.toLowerCase();
        let matches = [];
        
        // Check for matches in the knowledge base
        for (const entry of knowledgeBase) {
            for (const entryKeyword of entry.keywords) {
                if (entryKeyword.length > 3 && lowerKeyword.includes(entryKeyword)) {
                    matches.push({
                        keyword: entryKeyword,
                        response: entry.response.message.substring(0, 50) + '...'
                    });
                } else if (entryKeyword.length <= 3) {
                    const regex = new RegExp(`\\b${entryKeyword}\\b`, 'i');
                    if (regex.test(lowerKeyword)) {
                        matches.push({
                            keyword: entryKeyword,
                            response: entry.response.message.substring(0, 50) + '...'
                        });
                    }
                }
            }
        }
        
        if (matches.length > 0) {
            console.log(`Found ${matches.length} matches:`);
            console.table(matches);
        } else {
            console.log("No matches found in knowledge base");
        }
        
        return matches;
    }

    // Expose a debug function to list all keywords in the knowledge base
    window.listAllKeywords = function() {
        let allKeywords = [];
        
        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                allKeywords.push({
                    keyword: keyword,
                    responsePreview: entry.response.message.substring(0, 50) + '...'
                });
            }
        }
        
        console.log(`Found ${allKeywords.length} total keywords in knowledge base:`);
        console.table(allKeywords);
        return allKeywords;
    }
}); 