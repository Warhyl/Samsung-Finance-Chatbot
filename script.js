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
            message: "GSM! I'm your Samsung Finance+ virtual assistant. Please select an option from the main menu:",
            options: ["Merchant App Concern", "Customer App Concern", "FAQs", "Guides"]
        },
        "Guides": {
            message: "Please select the guide you need:",
            options: [
                "SF+ Guide for Promoters",
                "SF+ Onboarding Guide for Stores",
                "SF+ Installation Guide",
                "SF+ Merchant App Reinstallation Guide",
                "SF+ Customer App Register New Sim Card Guide",
                "SF+ Merchant App Defective Device Replacement",
                "SF+ How to Pay Video Guide",
                "SF+ Trade-in Discount Guide",
                "SF+ Samsung Care+ Guide",
                "Back",
                "Talk to Agent"
            ]
        },
        "SF+ Guide for Promoters": {
            message: "Here's the SF+ Guide for Promoters:\n\n<a href='https://docs.google.com/document/d/1oJkWpA3Bt5GuYXkzjA4UdOe5m9s9ARRDPxAk6oozRWU/edit#heading=h.4ed1ewo9cuyx' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Onboarding Guide for Stores": {
            message: "Here's the SF+ Onboarding Guide for New Stores:\n\n<a href='https://docs.google.com/presentation/d/1RZ3S93xS7gN0M4SOhfz74siF8GGWaDc_GH_uK5prKKY/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Installation Guide": {
            message: "Here's the SF+ Merchant App Installation Guide:\n\n<a href='https://docs.google.com/presentation/d/1RF9AJcVj_wrY-8DxrlxJTyu5d_R_A3mT9VAJImgswHQ/edit#slide=id.g24c6c3fad3b_1_5' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Merchant App Reinstallation Guide": {
            message: "Here's the SF+ Merchant App Reinstallation Guide:\n\n<a href='https://docs.google.com/document/d/1tUuxa_ibdZTRAVDqQ6PlgMHOWC9G94qcDK1-BY1X00k/edit' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Customer App Register New Sim Card Guide": {
            message: "Here's the SF+ Customer App Register New Sim Card Guide:\n\n<a href='https://docs.google.com/presentation/d/1HLjyNro7-RIdv1UPNKzU1H3Cghw8f1IIcVz4Q8lF3Hc/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Merchant App Defective Device Replacement": {
            message: "Here's the SF+ Defective Device Replacement Guide:\n\n<a href='https://docs.google.com/presentation/d/1NO72NB6h3jUp5nxFoZHPj-YNbZkQ8o2DpdrftU-alsM/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ How to Pay Video Guide": {
            message: "Here's the SF+ How to Pay Video Guide:\n\n<a href='https://youtu.be/bwFJBtTxQck?si=biicPHdL8CltExXX' target='_blank' rel='noopener noreferrer'>Watch Video Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Trade-in Discount Guide": {
            message: "Here's the SF+ Trade-in Discount Guide:\n\n<a href='https://docs.google.com/presentation/d/1QMljVSUBFwtJBv7-A_G7nK_7ksO6cijoDh7K1NjoLEs/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "SF+ Samsung Care+ Guide": {
            message: "Here's the SF+ Samsung Care+ Guide:\n\n<a href='https://docs.google.com/presentation/d/1yOpkcbSLC-zOrpaYSZ-KuNGgZI6mdCHRgriTAyDjMo4/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>View Guide</a>",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "FAQs": {
            message: "What would you like to know about Samsung Finance+?",
            options: [
                "General Information",
                "Application & Eligibility",
                "Payment & Billing",
                "Device & Security",
                "Technical Support",
                "Back",
                "Talk to Agent"
            ]
        },
        "General Information": {
            message: "Please select a question about general information:",
            options: [
                "What is Samsung Finance+?",
                "How is Samsung Finance+ different?",
                "Where can I apply?",
                "What products can I buy?",
                "What loan tenors are available?",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Application & Eligibility": {
            message: "Please select a question about application and eligibility:",
            options: [
                "Who is eligible to apply?",
                "What are the required documents?",
                "What is the minimum income required?",
                "Is there a minimum employment length requirement?",
                "Why was my loan application rejected?",
                "Does being rejected from Samsung Finance+ affect my credit score?",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Payment & Billing": {
            message: "Please select a question about payments and billing:",
            options: [
                "How do I make a payment?",
                "Where can I check my payment schedule and history?",
                "When is my due date?",
                "Can I get a refund for overpayment?",
                "Can I pay off my loan early?",
                "Who do I contact if my payment isn't reflected?",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Device & Security": {
            message: "Please select a question about device and security:",
            options: [
                "What is Knox Guard?",
                "What happens if I miss a payment?",
                "How do I unlock my phone after missing a payment?",
                "What if I lose my phone?",
                "What if my device is defective?",
                "Can I get my phone without installing the Samsung Finance+ app?",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Technical Support": {
            message: "Please select a question about technical support:",
            options: [
                "What if I see 'Application Timed Out' in the Merchant App?",
                "Does my address need to match my ID?",
                "Can I change my registered SIM in the Samsung Finance+ app?",
                "How should names with special characters be entered?",
                "What if my device gets locked without internet access?",
                "How can I contact UnionBank for concerns?",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "What is Samsung Finance+?": {
            message: "Samsung Finance+ is a platform that allows customers to buy Samsung devices with an affordable monthly amortization scheme. In the Philippines, customers will be able to avail of Samsung Finance+ at 0% interest, with no processing fees.\n\nIt's a simple and paper-less financial services platform offering:\n• Convenient and accessible financial services\n• Enhanced customer experience at Samsung partner stores\n• Quick and efficient application process\n• Digital-first approach to financing",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How is Samsung Finance+ different?": {
            message: "Samsung Finance+ stands out with these amazing benefits:\n\n• 0% Interest on device loans\n• 0% Processing Fee\n• 0% Down Payment (subject to risk scoring, ranges from 0-30%)\n\nIt's the new easy way to own a Galaxy device with 0% hassle. The platform focuses on providing convenient and accessible financial services to enhance the overall customer experience.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Where can I apply?": {
            message: "You can apply for Samsung Finance+ at select Samsung stores in the Philippines. Visit our partner stores to start your application today!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Is there a fee to apply?": {
            message: "No, there's absolutely no processing fee to apply for Samsung Finance+! We believe in making the process as accessible as possible for our customers.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How long is the process?": {
            message: "The loan application process is super quick - as fast as 5 minutes! We've streamlined everything to get you your Samsung device as soon as possible.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I get multiple loans?": {
            message: "Currently, you can only have one Samsung Finance+ loan at a time. But good news - re-availment will be available soon! Stay tuned for updates.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I trade in my device?": {
            message: "Yes, absolutely! The Samsung Trade-in function is available with Samsung Finance+. This can help you get even better value for your new device purchase.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I get Samsung Care+?": {
            message: "Yes, you can purchase Samsung Care+ along with your Samsung Finance+ loan. This gives you additional protection and peace of mind for your device.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What products can I buy?": {
            message: "Currently, you can purchase mobile phones and tablets through Samsung Finance+.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What loan tenors are available?": {
            message: "Samsung Finance+ offers flexible loan tenors based on device type:\n\nFor Flagship devices:\n• 12 months\n• 18 months\n• 24 months\n\nFor Non-flagship devices:\n• 6 months\n• 9 months\n• 12 months\n\nThe approved tenor depends on your chosen device.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Merchant App Concern": {
            message: "Please select the category of your Merchant App concern:",
            options: [
                "Application Process Issues",
                "KYC & Verification Issues",
                "Documentation Issues",
                "Others",
                "Resolution Check",
                "Back",
                "Talk to Agent"
            ]
        },
        "Application Process Issues": {
            message: "Please select the specific application process issue:",
            options: [
                "Not receiving OTP code",
                "Something Went Wrong Prompt",
                "Duplicate Entry Prompt",
                "Selected product did not display in the offers screen",
                "Application Timed-Out Prompt in Offers Screen",
                "Invalid Input Prompt",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "KYC & Verification Issues": {
            message: "Please select the specific KYC or verification issue:",
            options: [
                "KYC Failure",
                "KYC [UB Response Failure]",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Documentation Issues": {
            message: "Please select the specific documentation issue:",
            options: [
                "Blank details in Loan Agreement",
                "Application Timed-Out Prompt in Loan Agreement",
                "Blank details in Pre-DO",
                "Application Timed-Out Prompt in Pre-DO",
                "Blank details in Final-DO",
                "Application Timed-Out Prompt in Final-DO",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Others": {
            message: "Please select the specific issue:",
            options: [
                "Egift / Evoucher",
                "Disbursment report",
                "Did not input SEC code",
                "Samsung Care+",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Payment & Disbursement": {
            message: "Please select the specific payment or disbursement issue:",
            options: [
                "Egift / Evoucher",
                "Disbursment report",
                "Back",
                "Talk to Agent"
            ]
        },
        "Device & Service Issues": {
            message: "Please select the specific device or service issue:",
            options: [
                "Samsung Care+",
                "Back",
                "Talk to Agent"
            ]
        },
        "Customer App Concern": {
            message: "Please select the category of your Customer App concern:",
            options: [
                "Setup & Installation Issues",
                "Payment Issues",
                "Device Issues",
                "Others",
                "Resolution Check",
                "Back",
                "Talk to Agent"
            ]
        },
        "Setup & Installation Issues": {
            message: "Please select the specific setup or installation issue:",
            options: [
                "Processed with Esim",
                "Customer App: Not Receiving OTP (Verification) Code",
                "Stuck in setting up the device",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Payment Issues": {
            message: "Please select the specific payment issue:",
            options: [
                "Unable to Proceed with Payment",
                "Payment Details Not Showing",
                "Payment Not reflecting",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Device Issues": {
            message: "Please select the specific device issue:",
            options: [
                "Device got Locked",
                "Defective Unit",
                "Lost/Stolen Unit",
                "Back",
                "Talk to Agent",
                "Main Menu"
            ]
        },
        "Others": {
            message: "Please select the specific issue:",
            options: [
                "Uninstall Customer app in the device",
                "Back",
                "Talk to Agent"
            ]
        },
        "Processed with Esim": {
            message: "Please be advised that the use of eSIM (embedded SIM) is not supported for transactions processed through Samsung Finance+.\n\nIn order to proceed, we kindly request that you cancel the current transaction and initiate a new one using a registered physical SIM card.\n\nA physical SIM is required to ensure successful validation and activation during the setup process, as it enables proper communication with network and application systems. This measure is in place to maintain the integrity and security of the application flow.\n\nWe appreciate your understanding and cooperation in adhering to this requirement.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Unable to Proceed with Payment": {
            message: "<b>Kindly try using an alternative payment method available within the Samsung Finance+ (SF+) Customer App to complete your transaction.</b>\n\nThe SF+ Customer App offers a variety of secure and convenient payment channels to accommodate your preferences. Below is the list of supported payment options:\n\n<b>Digital Wallets:</b>\n\n- GCash\n\n- GrabPay\n\n<b>Over-the-Counter Payment Centers:</b>\n\n- SM Store\n\n- Robinsons\n\n- Cebuana Lhuillier\n\n- Palawan Pawnshop\n\n- M. Lhuillier\n\n- Bayad Center\n\n- ECPay 7/11",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Customer App: Not Receiving OTP (Verification) Code": {
            message: "1. Customer's sim card used in SF+ merchant app must be inserted in slot 1 before setting up the device.\n\n2. The customer's sim card inserted in slot 1 in the new device must have a regular load of at least ₱1\n\n3. New Device must be connected to the stable internet via WIFI or Mobile data\n\n4. If customer app is not being installed automatically, make sure the software version is up-to-date then restart.\n\n5. If Samsung Finance+ isn't downloaded within 3 minutes, try connecting to <a href='https://guard.samsungknox.com' target='_blank' rel='noopener noreferrer'>https://guard.samsungknox.com</a> on the purchased phone\n\n<b style='text-transform: uppercase;'>If none works from above reminders, DO A FACTORY RESET.</b>",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Payment Details Not Showing": {
            message: "- Kindly continue refreshing the page by clicking the refresh button, typically located at the upper section of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the Equated Monthly Installment (EMI) details still do not appear after refreshing, we recommend allowing a few days for the system to automatically update and reflect the correct information.\n\n- Rest assured that this is usually a temporary synchronization issue, and no further action may be required on your part.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Payment Not reflecting": {
            message: "Hi. Customer may contact UnionBank through <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a> for any payment related issue.\n\nPlease fill out the form for us to help follow up UnionBank.\n\n<a href='https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform' target='_blank' rel='noopener noreferrer'>https://docs.google.com/forms/d/e/1FAIpQLScYMgqhWhFCwXTDGgdZ48MIejsGYFAMflMAwJRSG0dAXghjqA/viewform</a>\n\nNOTE: If the device is also locked as of the moment, please try the following temporary solution;\n\n1. Insert a different SIM card with data\n2. Restart the device\n3. Open the customer app\n4. Make a payment",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Device got Locked": {
            message: "- Please first ensure that the customer has made the required payment. If the payment has been made but the device remains locked, please try the following steps:\n\n1. Insert a different SIM card with active data connection\n2. Restart the device completely\n3. Open the Samsung Finance+ app and navigate to the support section\n4. Click on 'Refresh Account' to update the payment status\n\n- These steps will help synchronize the payment information with the device's locking system, which should resolve the issue in most cases.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Stuck in setting up the device": {
            message: "We kindly recommend performing a factory reset on the device to resolve the issue.\n\nTo proceed with a factory reset, navigate to:\nSettings > General Management > Reset > Factory Data Reset, then follow the on-screen instructions to complete the process.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Uninstall Customer app in the device": {
            message: "Please be advised that the Samsung Finance+ (SF+) Customer App can only be uninstalled once the customer has fully settled all outstanding Equated Monthly Installments (EMI) associated with their loan account.\n\nThe continued presence of the app on the device is required throughout the duration of the loan term to facilitate payment monitoring, ensure compliance with financing terms, and support account management features.\n\nWe appreciate your understanding and cooperation in adhering to this policy, which is intended to safeguard both the customer's financial obligations and the integrity of the SF+ financing program.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Defective Unit": {
            message: "To replace the defective device, kindly follow the step by step Guide: <a href='https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing' target='_blank' rel='noopener noreferrer'>https://docs.google.com/presentation/d/1WTpZSgYtnc3TinGEekzUBXSipZzI46oPYuFM_CfqEC4/edit?usp=sharing</a>\n\nReminder! Once swap is successful, perform a Factory Reset on the defective device to uninstall the SF+ App.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Lost/Stolen Unit": {
            message: "Please report the loan details in this form so we can Mark as Lost and locked the device: \n\n<div class='form-preview'><iframe src='https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform?embedded=true' width='100%' height='400' frameborder='0' marginheight='0' marginwidth='0'>Loading form...</iframe></div>\n\nAfter reporting in the form above, please advise the customer to:\nYou may report this to UnionBank via <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n\nYou will still need to pay the monthly loan amounts to pay off your loan, or else will be considered delinquent.\nFor faster assistance, please provide the following information via email:\na. Full name,\nb. Loan Account ID, and\nc. Concern (subject of email) and background.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Not receiving OTP code": {
            message: "<b>Please check the following steps:</b>\n\n1. Ensure you have adequate signal strength - Weak network or 'No Service' conditions can prevent OTP messages from being delivered.\n\n2. Toggle Airplane Mode ON and then OFF - This simple action can reset your mobile network connection and resolve temporary network issues.\n\n3. Check your SMS inbox storage - If your message storage is full, new messages including OTPs cannot be received.\n\n4. Restart your device completely - A full restart can refresh your network connections and resolve many temporary communication issues.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Something Went Wrong Prompt": {
            message: "<b>Please check the following:</b>\n\n- Ensure that there's no special characters in Name, Employer's Name and Address Field.\n\n- Check the Spaces and First Letter of the word must be Uppercase (e.g. Pasay City)\n\n- Cancel and reprocess a new application\n\n<b style='text-transform: uppercase;'>If the error persists after performing the steps the customer/s are either:</b>\n1. have existing applications with UB/SF+\n2. have rejected UB/SF+ transactions and can retry 3 months later",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Duplicate Entry Prompt": {
            message: "Kindly cancel the current loan application and initiate a new application process using a different mobile phone number",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Selected product did not display in the offers screen": {
            message: "The offer is dependent on his/her credit score and the annual income provided. Please explain to the customer that the devices shown in the offers are based UB's decisions. Ask if he/she would consider any of the other models that are available in the offers.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Offers Screen": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Loan Agreement": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Loan Agreement": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Invalid Input Prompt": {
            message: "Please cancel and reprocess with a different IMEI",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "KYC Failure": {
            message: "<b>Please check these reminders:</b>\n\n1. Please make sure your ID is valid for at least 30 calendar days from date of application\n2. Must be valid photo ID card / passport\n3. Must match with the name you provided\n4. Make sure the ID is right side up\n5. Make sure the ID is clear and readable\n6. Avoid flash or glare\n7. An ID with an address is preferable\n8. Laminated ID with manually affixed photo is not acceptable\n\n<b style='text-transform: uppercase;'>Make sure ALL DETAILS are matched in SF+ Merchant App vs ID. Make sure as well that photos are clear and readable.</b>",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "KYC [UB Response Failure]": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Pre-DO": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Pre-DO": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Application Timed-Out Prompt in Final-DO": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Blank details in Final-DO": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please cancel the current transaction and initiate a new application or process flow. This will help prevent data corruption and ensure a smooth and uninterrupted experience",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Samsung Care+": {
            message: "This claim should be linked to the SC+ Philippines claim page provided below. Please note that the page may be updated soon. Customers can submit their claims through this page if their phone requires inspection or repair.\n\n<a href='https://careplus.co/' target='_blank' rel='noopener noreferrer'>https://careplus.co/</a>\n\nAdditionally, there is no need to take any action to enroll in SC+ for SF+, as it is automatically registered in the SC+ portal.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Did not input SEC code": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please coordinate with your respective TS or OIC to manually record your sale.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Egift / Evoucher": {
            message: "Please submit your concern through the following form:\nhttps://forms.gle/1fqKRcxqxGnTMnFe8\n\nAfter submission, kindly tag Haej (0945-601-3342) or Paula (0912-710-8924) in your designated Viber group for a faster response.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Disbursment report": {
            message: "All concerns related on disbursement report, please contact to Haej (09456013342) or Pau (09127108924) to help you check with Unionbank. You may contact them via viber for faster assistance.\n\nKindly fill up below google link for us to check if registered email address is correct for disbursement report.\n<a href='https://forms.gle/1LQHQeCkfb7m2DDc6' target='_blank' rel='noopener noreferrer'>https://forms.gle/1LQHQeCkfb7m2DDc6</a>",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Talk to agent": {
            message: "I'm connecting you to a customer service agent. Please wait a moment...",
            options: ["Main Menu"]
        },
        "Resolution Check": {
            message: "Did the resolution provided fix your issue?",
            options: ["Yes, it's resolved", "No, I still need help", "Main Menu"]
        },
        "Yes, it's resolved": {
            message: "Thank You for Your Patience\n\nWe're pleased that your concern has been successfully resolved.\n\nWe truly appreciate your cooperation and understanding throughout the process. Should you encounter any further issues or have additional questions, please do not hesitate to reach out. Our support team is always ready to assist you.\n\nThank you once again for choosing Samsung Finance+. We're committed to providing you with excellent service and continued support.",
            options: ["Main Menu"]
        },
        "No, I still need help": {
            message: "We apologize that the issue has not yet been resolved. To allow our technical support team to conduct a more thorough investigation, we kindly ask you to submit your concern using our online form.",
            options: ["Fill out form", "Main Menu"]
        },
        "Fill out form": {
            message: "You can access our concern form here: <a href='https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform' target='_blank' rel='noopener noreferrer'>Samsung Finance+ App Concerns Form</a>\n\nPlease fill out all the required information so we can better assist you with your concern.",
            options: ["Back", "Main Menu"]
        },
        "Lost/Stolen Unit": {
            message: "Please report the loan details using our lost/stolen device form so we can mark it as lost and lock the device for security purposes. After reporting, you will still need to pay the monthly loan amounts to avoid being considered delinquent.",
            options: ["Report lost device", "Back", "Talk to Agent", "Main Menu"]
        },
        "Report lost device": {
            message: "You can access our lost/stolen device form here: <a href='https://docs.google.com/forms/d/e/1FAIpQLScbPQ8jX0jRNi5Gwb87jWX6TSDzfpbmPWzEKMDsipyJBUaGkw/viewform' target='_blank' rel='noopener noreferrer'>Lost/Stolen Device Report Form</a>\n\nAdditionally, please report this to UnionBank via <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n\nFor faster assistance, please provide the following information via email:\na. Full name\nb. Loan Account ID\nc. Concern (subject of email) and background",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Submit Concern Form": {
            message: "Please provide the following information to help us better assist you:\n\n1. Full name:\n2. Contact number:\n3. Email address:\n4. Detailed description of the issue:\n5. When did the issue start:\n6. What steps have you already tried:\n\nAfter typing your response, please click the 'Submit Form' button below.",
            options: ["Submit Form", "Back", "Main Menu"]
        },
        "Submit Form": {
            message: "Thank You for Submitting Your Concern\n\nWe have successfully received your submission and appreciate you taking the time to provide the necessary details.\n\nOur technical support team will review your concern and get back to you as soon as possible. Rest assured, we are committed to resolving your issue with care and urgency.\n\nThank you for your continued trust in Samsung Finance+.",
            options: ["Main Menu"]
        },
        "Back": {
            message: "Let me take you back to the previous menu.",
            action: "goBack"
        },
        "Who is eligible to apply?": {
            message: "To be eligible for Samsung Finance+, you must:\n\n• Be 21-70 years old\n• Have good credit standing\n• Not be a UnionBank employee\n• Have an active email and mobile number\n• Have a valid government-issued ID\n• Pass the Know-Your-Customer (KYC) process\n• Not be prohibited under applicable Gifts, Anti-Bribery and Corruption Laws\n\nAdditionally, you must meet the minimum income requirement of ₱180,000 annual gross income (₱15,000/month).",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What are the required documents?": {
            message: "The process is simple! You only need one valid government-issued ID. We accept:\n\n• Driver's License\n• UMID\n• Passport\n• Philsys/National ID\n\nThat's all you need to get started with your application!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Why was my loan application rejected?": {
            message: "There are several reasons why an application might be rejected:\n\n• Bad credit history\n• Mismatch in provided information\n• Poor quality ID/selfie submission\n\n<b style='text-transform: uppercase;'>Good news!</b> Applicants can retry after 90 days. We recommend ensuring all information is accurate and your ID photos are clear before reapplying.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What is the minimum income required?": {
            message: "The minimum annual gross income required is ₱180,000 (₱15,000/month). This helps ensure you can comfortably manage your monthly payments while enjoying your new Samsung device!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Is there a minimum employment length requirement?": {
            message: "No, there's no minimum employment length requirement! Even newly employed individuals can apply for Samsung Finance+. We believe in making our services accessible to everyone who meets our basic eligibility criteria.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How do I make a payment?": {
            message: "You can make payments through the Samsung Finance+ app using the 'Pay Now' option. We offer multiple payment methods for your convenience:\n\n• GCash\n• GrabPay\n• Over-the-counter at:\n  - SM Store\n  - Robinsons\n  - Cebuana Lhuillier\n  - Palawan Pawnshop\n  - M. Lhuillier\n  - Bayad Center\n  - ECPay 7/11\n\nChoose the payment method that works best for you!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Where can I check my payment schedule and history?": {
            message: "You can easily check your payment schedule and history on the Samsung Finance+ app under the 'Details' section. This gives you a clear view of your payment status and upcoming dues.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "When is my due date?": {
            message: "Your due date depends on your purchase date:\n\n• If purchased between 1st-10th: Due on 1st of the next month\n• If purchased between 11th-31st: Due on 1st of the month after next\n\nThis gives you plenty of time to prepare for your payment!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I get a refund for overpayment?": {
            message: "While we don't provide refunds for overpayments, don't worry! Any excess amount will be automatically adjusted in your final installment. This ensures you don't lose any of your payments.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Where can I find my Loan ID?": {
            message: "Your Loan ID is easily accessible on the Samsung Finance+ app. You can find it in your account details section.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Where can I access my loan documents?": {
            message: "Your loan documents are sent directly to your email upon loan approval. Make sure to check your inbox (and spam folder) for these important documents.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I pay off my loan early?": {
            message: "Yes, absolutely! You can pay off your loan early through the Samsung Finance+ app. This gives you the flexibility to complete your payments ahead of schedule.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How can I re-avail a Samsung Finance+ loan?": {
            message: "If your previous loan application was rejected, you can reapply after waiting for 90 days. This gives you time to address any issues that might have led to the rejection.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Who do I contact if my payment isn't reflected?": {
            message: "If your payment isn't reflected, you can contact UnionBank through:\n\n• Email: <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n• Phone: (+632) 8841-8600\n\nOur team will help you resolve any payment-related concerns.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Who receives the pre-document and post-document?": {
            message: "The pre-document and post-document are sent exclusively to the dealer's email address. This ensures proper documentation and processing of your transaction.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What is Knox Guard?": {
            message: "Knox Guard is a security feature that helps manage your device payments. It reminds you of due payments and, if a payment is overdue, it will lock the device to ensure payment compliance. This helps protect both you and the financing agreement.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What happens if I miss a payment?": {
            message: "If you miss a payment:\n\n• A ₱150 late fee will be applied\n• Your device will be locked\n• While locked, you can only:\n  - Access the Samsung Finance+ app for payment\n  - Answer incoming calls\n  - Make emergency calls\n\nTo unlock your device:\n1. Pay the overdue amount plus late payment fee\n2. Device should unlock in real-time after payment\n3. Processing time may vary by payment method\n\nTip: Pay at least 3 working days before due date to avoid device locking.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How do I unlock my phone after missing a payment?": {
            message: "To unlock your phone after missing a payment:\n\n1. Make the payment through the Samsung Finance+ app\n2. The unlocking process should happen in real-time\n\nOnce your payment is processed, your device will be automatically unlocked.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What if I lose my phone?": {
            message: "If you lose your phone:\n\n1. Report the loss to UnionBank\n2. Continue making your payments to avoid delinquency\n3. Contact UnionBank at <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n\nRemember: You'll still need to complete your loan payments even if the device is lost.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I cancel my purchase?": {
            message: "No, once pre-documentation is completed, cancellation is not allowed. This is to ensure proper processing and prevent any potential issues with the financing agreement.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What if I see 'Application Timed Out' in the Merchant App?": {
            message: "- Kindly continue refreshing the page by clicking the loader icon located at the upper right corner of the screen. This action may help in re-establishing a connection with the server and resolving temporary data loading issues.\n\n- If the problem continues despite multiple refresh attempts, we recommend switching to a different internet connection (e.g., from Wi-Fi to mobile data or vice versa) to rule out network-related concerns.\n\n- Should the issue persist after trying the above steps, please try again later or contact our support team for assistance.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Does being rejected from Samsung Finance+ affect my credit score?": {
            message: "No, being rejected from Samsung Finance+ does not affect your credit score or other financing applications. You can still apply for other financing options without any impact.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What if my device is defective?": {
            message: "For defective devices, here's what to do:\n\nWithin 7 days of purchase:\n• Eligible for replacement\n\nAfter 7 days:\n1. Visit a Samsung service center with SF+ stamped receipt\n2. Get a technical report validating the defect\n3. Return to original purchase store\n4. Store will verify report and check new device\n5. IMEI will be swapped and new device set up\n6. SF+ Customer App must be installed before leaving\n\nNote: Keep your device in good condition and report issues promptly.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Does my address need to match my ID?": {
            message: "No, your address does not need to match your ID. We understand that your current address may be different from what's shown on your identification documents.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Can I change my registered SIM in the Samsung Finance+ app?": {
            message: "Yes, you can update your registered SIM in the Samsung Finance+ app. This gives you the flexibility to change your contact information when needed.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How should names with special characters be entered?": {
            message: "When entering names with special characters:\n\n• Omit special characters\nExamples:\n- Ma. → Ma\n- Jr. → Jr\n- Mary-Ann → Mary Ann\n- Niña → Nina\n- Bayani St. → Bayani St\n\nFor suffixes:\n1. If suffix is in first name: Enter in First Name field\n2. If suffix is in last name: Enter in Suffix field\n\nImportant: Information must match exactly with the ID provided.",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "What if my device gets locked without internet access?": {
            message: "If your device gets locked without internet access:\n\n• Contact the Samsung Finance+ tech team\n• Contact UnionBank for unlocking support\n• Make sure to have your payment ready when contacting support",
            options: ["Resolution Check", "Back", "Talk to Agent", "Main Menu"]
        },
        "Can I get my phone without installing the Samsung Finance+ app?": {
            message: "No, installation and activation of the Samsung Finance+ app are required before the device can be released. This is a mandatory step to ensure proper device management and payment processing.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How can I contact UnionBank for concerns?": {
            message: "To contact UnionBank for any concerns:\n\n• Email: <a href='mailto:samsungfinanceloans@unionbankph.com'>samsungfinanceloans@unionbankph.com</a>\n\nPlease include:\n• Your full name\n• Loan ID\n• Detailed description of your concern\n\nThis will help us assist you more effectively!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        }
    };
    
    // Intent-to-Answer Map: maps keywords/phrases to menu selections
    const intentMap = {
        // Main Menu
        "main menu": "Main Menu",
        "home": "Main Menu",
        "start": "Main Menu",
        "beginning": "Main Menu",
        "top menu": "Main Menu",
        "welcome": "Main Menu",
        "back to start": "Main Menu",
        "dashboard": "Main Menu",
        "options": "Main Menu",
        "overview": "Main Menu",
        "list of topics": "Main Menu",
        
        // Merchant App Concern
        "merchant app concern": "Merchant App Concern",
        "merchant issues": "Merchant App Concern",
        "partner app": "Merchant App Concern",
        "store app": "Merchant App Concern",
        "merchant help": "Merchant App Concern",
        "merchant trouble": "Merchant App Concern",
        "merchant problem": "Merchant App Concern",
        "dealer issue": "Merchant App Concern",
        
        // Application Process Issues
        "application process issues": "Application Process Issues",
        "can't apply": "Application Process Issues",
        "application failed": "Application Process Issues",
        "form error": "Application Process Issues",
        "app error": "Application Process Issues",
        "registration problem": "Application Process Issues",
        "cannot submit form": "Application Process Issues",
        
        // OTP Issues
        "not receiving otp": "Not receiving OTP code",
        "otp missing": "Not receiving OTP code",
        "code not sent": "Not receiving OTP code",
        "no verification code": "Not receiving OTP code",
        "verification failed": "Not receiving OTP code",
        "didn't get OTP": "Not receiving OTP code",
        "sms code issue": "Not receiving OTP code",
        "no SMS": "Not receiving OTP code",
        "fail to verify": "Not receiving OTP code",
        "didn't get code": "Not receiving OTP code",
        
        // Something Went Wrong
        "something went wrong": "Something Went Wrong Prompt",
        "error message": "Something Went Wrong Prompt",
        "bug": "Something Went Wrong Prompt",
        "glitch": "Something Went Wrong Prompt",
        "general error": "Something Went Wrong Prompt",
        "app crashed": "Something Went Wrong Prompt",
        "fail to load": "Something Went Wrong Prompt",
        
        // Duplicate Entry
        "duplicate entry": "Duplicate Entry Prompt",
        "duplicate application": "Duplicate Entry Prompt",
        "repeated entry": "Duplicate Entry Prompt",
        "reapplication problem": "Duplicate Entry Prompt",
        "record exists": "Duplicate Entry Prompt",
        
        // Product Not Displayed
        "product not displayed": "Selected product did not display in the offers screen",
        "missing offer": "Selected product did not display in the offers screen",
        "product not found": "Selected product did not display in the offers screen",
        "offer screen blank": "Selected product did not display in the offers screen",
        "no options shown": "Selected product did not display in the offers screen",
        
        // Invalid Input
        "invalid input": "Invalid Input Prompt",
        "wrong info": "Invalid Input Prompt",
        "bad input": "Invalid Input Prompt",
        "incorrect entry": "Invalid Input Prompt",
        "wrong format": "Invalid Input Prompt",
        "input issue": "Invalid Input Prompt",
        
        // KYC Issues
        "kyc issues": "KYC & Verification Issues",
        "verification failed": "KYC & Verification Issues",
        "id not working": "KYC & Verification Issues",
        "identity issue": "KYC & Verification Issues",
        "kyc failure": "KYC Failure",
        "kyc error": "KYC & Verification Issues",
        "ID verification failed": "KYC & Verification Issues",
        "selfie not accepted": "KYC & Verification Issues",
        
        // Documentation Issues
        "documentation issues": "Documentation Issues",
        "blank loan form": "Documentation Issues",
        "missing pre-do": "Documentation Issues",
        "do issues": "Documentation Issues",
        "blank details": "Blank details in Loan Agreement",
        "missing info": "Documentation Issues",
        "document blank": "Documentation Issues",
        "agreement problem": "Documentation Issues",
        
        // Other Merchant Issues
        "egift": "Egift / Evoucher",
        "evoucher": "Egift / Evoucher",
        "disbursement report": "Disbursment report",
        "sec code": "Did not input SEC code",
        "egift issue": "Egift / Evoucher",
        "voucher not received": "Egift / Evoucher",
        "payout report": "Disbursment report",
        
        // Customer App Concern
        "customer app concern": "Customer App Concern",
        "customer issues": "Customer App Concern",
        "user app": "Customer App Concern",
        "end-user app": "Customer App Concern",
        "buyer app": "Customer App Concern",
        "mobile user issue": "Customer App Concern",
        "end user concern": "Customer App Concern",
        
        // Setup & Installation Issues
        "setup & installation issues": "Setup & Installation Issues",
        "can't install": "Setup & Installation Issues",
        "setup failed": "Setup & Installation Issues",
        "stuck on setup": "Setup & Installation Issues",
        "failed install": "Setup & Installation Issues",
        "stuck in setup": "Setup & Installation Issues",
        "can't configure": "Setup & Installation Issues",
        
        // eSIM Issues
        "esim": "Processed with Esim",
        "esim problem": "Processed with Esim",
        "sim setup": "Processed with Esim",
        "e-sim problem": "Processed with Esim",
        "embedded sim issue": "Processed with Esim",
        
        // Payment Issues
        "payment issues": "Payment Issues",
        "can't pay": "Payment Issues",
        "error paying": "Payment Issues",
        "no payment history": "Payment Issues",
        "error on payment": "Payment Issues",
        "billing problem": "Payment Issues",
        
        // Payment Not Reflecting
        "payment not reflecting": "Payment Not reflecting",
        "payment not shown": "Payment Not reflecting",
        "missing payment": "Payment Not reflecting",
        "no update": "Payment Not reflecting",
        "status not updated": "Payment Not reflecting",
        "not showing payment": "Payment Not reflecting",
        
        // Device Issues
        "device issues": "Device Issues",
        "phone locked": "Device Issues",
        "defective": "Device Issues",
        "lost phone": "Device Issues",
        "unit locked": "Device Issues",
        "problem with device": "Device Issues",
        "phone malfunction": "Device Issues",
        
        // Other Customer Issues
        "uninstall customer app": "Uninstall Customer app in the device",
        "delete app": "Uninstall Customer app in the device",
        "remove app": "Uninstall Customer app in the device",
        "uninstall request": "Uninstall Customer app in the device",
        "remove finance+ app": "Uninstall Customer app in the device",
        
        // FAQs
        "faqs": "FAQs",
        "common questions": "FAQs",
        "help": "FAQs",
        "how-to": "FAQs",
        "frequent questions": "FAQs",
        "answers": "FAQs",
        "help topics": "FAQs",
        "quick questions": "FAQs",
        "support info": "FAQs",
        
        // Guides
        "guides": "Guides",
        "tutorials": "Guides",
        "instructions": "Guides",
        "step-by-step": "Guides",
        "how to": "Guides",
        "walk-through": "Guides",
        "steps": "Guides",
        "how-to manual": "Guides",
        "instructional material": "Guides",
        
        // Specific Guides
        "guide for promoters": "SF+ Guide for Promoters",
        "promoter guide": "SF+ Guide for Promoters",
        "promoter manual": "SF+ Guide for Promoters",
        "training guide": "SF+ Guide for Promoters",
        
        "onboarding guide": "SF+ Onboarding Guide for Stores",
        "store onboarding": "SF+ Onboarding Guide for Stores",
        "setup guide for stores": "SF+ Onboarding Guide for Stores",
        "store orientation": "SF+ Onboarding Guide for Stores",
        
        "installation guide": "SF+ Installation Guide",
        "how to install": "SF+ Installation Guide",
        "app setup": "SF+ Installation Guide",
        "install steps": "SF+ Installation Guide",
        
        "reinstallation guide": "SF+ Merchant App Reinstallation Guide",
        "reinstall merchant app": "SF+ Merchant App Reinstallation Guide",
        "install again": "SF+ Merchant App Reinstallation Guide",
        "fix broken app": "SF+ Merchant App Reinstallation Guide",
        
        "register new sim": "SF+ Customer App Register New Sim Card Guide",
        "new sim setup": "SF+ Customer App Register New Sim Card Guide",
        "sim registration": "SF+ Customer App Register New Sim Card Guide",
        "new number setup": "SF+ Customer App Register New Sim Card Guide",
        
        "defective device replacement": "SF+ Merchant App Defective Device Replacement",
        "device return": "SF+ Merchant App Defective Device Replacement",
        "exchange": "SF+ Merchant App Defective Device Replacement",
        "exchange broken unit": "SF+ Merchant App Defective Device Replacement",
        
        "how to pay": "SF+ How to Pay Video Guide",
        "payment video": "SF+ How to Pay Video Guide",
        "bill guide": "SF+ How to Pay Video Guide",
        "payment help": "SF+ How to Pay Video Guide",
        "step to pay": "SF+ How to Pay Video Guide",
        
        "trade-in discount": "SF+ Trade-in Discount Guide",
        "trade in help": "SF+ Trade-in Discount Guide",
        "exchange offer": "SF+ Trade-in Discount Guide",
        "trade in program": "SF+ Trade-in Discount Guide",
        
        "samsung care+ guide": "SF+ Samsung Care+ Guide",
        "warranty": "SF+ Samsung Care+ Guide",
        "device protection": "SF+ Samsung Care+ Guide",
        "insurance help": "SF+ Samsung Care+ Guide",
        "extended warranty": "SF+ Samsung Care+ Guide",
        
        // Application & Eligibility
        "application & eligibility": "Application & Eligibility",
        "apply": "Application & Eligibility",
        "how to apply": "Application & Eligibility",
        "submit application": "Application & Eligibility",
        "eligibility": "Application & Eligibility",
        "who can apply": "Application & Eligibility",
        "requirements": "Application & Eligibility",
        "qualifications": "Application & Eligibility",
        "apply now": "Application & Eligibility",
        "start loan": "Application & Eligibility",
        "begin application": "Application & Eligibility",
        "qualified person": "Application & Eligibility",
        "who can join": "Application & Eligibility",
        "allowed users": "Application & Eligibility",
        
        // Specific Application & Eligibility Questions
        "who is eligible": "Who is eligible to apply?",
        "required documents": "What are the required documents?",
        "what documents needed": "What are the required documents?",
        "papers needed": "What are the required documents?",
        "needed papers": "What are the required documents?",
        "what to submit": "What are the required documents?",
        
        "minimum income": "What is the minimum income required?",
        "income needed": "What is the minimum income required?",
        "salary requirement": "What is the minimum income required?",
        "earnings needed": "What is the minimum income required?",
        
        "employment length": "Is there a minimum employment length requirement?",
        "work requirement": "Is there a minimum employment length requirement?",
        "job duration needed": "Is there a minimum employment length requirement?",
        "how long to work": "Is there a minimum employment length requirement?",
        
        "loan rejection": "Why was my loan application rejected?",
        "declined loan": "Why was my loan application rejected?",
        "failed loan": "Why was my loan application rejected?",
        "application declined": "Why was my loan application rejected?",
        
        "credit score": "Does being rejected from Samsung Finance+ affect my credit score?",
        "affects score": "Does being rejected from Samsung Finance+ affect my credit score?",
        "credit impact": "Does being rejected from Samsung Finance+ affect my credit score?",
        "affects rating": "Does being rejected from Samsung Finance+ affect my credit score?",
        
        // Payment & Billing
        "payment & billing": "Payment & Billing",
        "make a payment": "How do I make a payment?",
        "how to pay": "How do I make a payment?",
        "payment process": "How do I make a payment?",
        "pay now": "How do I make a payment?",
        "where to pay": "How do I make a payment?",
        "complete payment": "How do I make a payment?",
        
        "check schedule": "Where can I check my payment schedule and history?",
        "view payments": "Where can I check my payment schedule and history?",
        "payment history": "Where can I check my payment schedule and history?",
        "view due dates": "Where can I check my payment schedule and history?",
        "loan status": "Where can I check my payment schedule and history?",
        
        "due date": "When is my due date?",
        "deadline": "When is my due date?",
        "payment date": "When is my due date?",
        "next bill": "When is my due date?",
        "pay by": "When is my due date?",
        "when to pay": "When is my due date?",
        
        "refund": "Can I get a refund for overpayment?",
        "overpayment": "Can I get a refund for overpayment?",
        "get money back": "Can I get a refund for overpayment?",
        "extra payment return": "Can I get a refund for overpayment?",
        "refund process": "Can I get a refund for overpayment?",
        
        "early payoff": "Can I pay off my loan early?",
        "settle early": "Can I pay off my loan early?",
        "pay loan now": "Can I pay off my loan early?",
        "pay in full": "Can I pay off my loan early?",
        "close loan": "Can I pay off my loan early?",
        
        "payment not reflected": "Who do I contact if my payment isn't reflected?",
        "not shown": "Who do I contact if my payment isn't reflected?",
        "missing transaction": "Who do I contact if my payment isn't reflected?",
        "missing confirmation": "Who do I contact if my payment isn't reflected?",
        "status delay": "Who do I contact if my payment isn't reflected?",
        
        // Device & Security
        "device & security": "Device & Security",
        "knox guard": "What is Knox Guard?",
        "lock": "What is Knox Guard?",
        "security app": "What is Knox Guard?",
        "samsung lock system": "What is Knox Guard?",
        "phone security": "What is Knox Guard?",
        
        "missed payment": "What happens if I miss a payment?",
        "missed due": "What happens if I miss a payment?",
        "didn't pay": "What happens if I miss a payment?",
        "forgot payment": "What happens if I miss a payment?",
        
        "unlock phone": "How do I unlock my phone after missing a payment?",
        "phone locked": "How do I unlock my phone after missing a payment?",
        "blocked": "How do I unlock my phone after missing a payment?",
        "remove lock": "How do I unlock my phone after missing a payment?",
        "get access back": "How do I unlock my phone after missing a payment?",
        
        "lost phone": "What if I lose my phone?",
        "stolen": "What if I lose my phone?",
        "misplaced phone": "What if I lose my phone?",
        "missing device": "What if I lose my phone?",
        "can't find phone": "What if I lose my phone?",
        
        "defective device": "What if my device is defective?",
        "damaged": "What if my device is defective?",
        "not working": "What if my device is defective?",
        "broken unit": "What if my device is defective?",
        "malfunctioning": "What if my device is defective?",
        
        "without app": "Can I get my phone without installing the Samsung Finance+ app?",
        "no Samsung Finance+ app": "Can I get my phone without installing the Samsung Finance+ app?",
        "no need to install": "Can I get my phone without installing the Samsung Finance+ app?",
        "skip app": "Can I get my phone without installing the Samsung Finance+ app?",
        
        // Technical Support
        "technical support": "Technical Support",
        "application timed out": "What if I see 'Application Timed Out' in the Merchant App?",
        "timeout": "What if I see 'Application Timed Out' in the Merchant App?",
        "not responding": "What if I see 'Application Timed Out' in the Merchant App?",
        "timeout error": "What if I see 'Application Timed Out' in the Merchant App?",
        "loading failed": "What if I see 'Application Timed Out' in the Merchant App?",
        
        "address match": "Does my address need to match my ID?",
        "address issue": "Does my address need to match my ID?",
        "address mismatch": "Does my address need to match my ID?",
        "ID address issue": "Does my address need to match my ID?",
        
        "change sim": "Can I change my registered SIM in the Samsung Finance+ app?",
        "sim card change": "Can I change my registered SIM in the Samsung Finance+ app?",
        "swap number": "Can I change my registered SIM in the Samsung Finance+ app?",
        "replace sim": "Can I change my registered SIM in the Samsung Finance+ app?",
        
        "special characters": "How should names with special characters be entered?",
        "name format issue": "How should names with special characters be entered?",
        "name entry issue": "How should names with special characters be entered?",
        "invalid name format": "How should names with special characters be entered?",
        
        "locked without internet": "What if my device gets locked without internet access?",
        "device locked offline": "What if my device gets locked without internet access?",
        "no wifi": "What if my device gets locked without internet access?",
        "locked offline": "What if my device gets locked without internet access?",
        
        "contact unionbank": "How can I contact UnionBank for concerns?",
        "unionbank help": "How can I contact UnionBank for concerns?",
        "bank support": "How can I contact UnionBank for concerns?",
        "unionbank hotline": "How can I contact UnionBank for concerns?",
        
        // Talk to Agent
        "talk to agent": "Talk to Agent",
        "live help": "Talk to Agent",
        "human support": "Talk to Agent",
        "customer rep": "Talk to Agent",
        "contact support": "Talk to Agent",
        "live chat": "Talk to Agent",
        "contact person": "Talk to Agent",
        "get human help": "Talk to Agent",
        "real agent": "Talk to Agent",
        
        // Resolution Check
        "resolution check": "Resolution Check",
        "did it work": "Resolution Check",
        "problem fixed": "Resolution Check",
        "issue resolved": "Resolution Check",
        "resolved my issue": "Resolution Check",
        "still have issue": "Resolution Check",
        "not working": "Resolution Check",
        "problem persists": "Resolution Check",
        
        // Resolution responses
        "yes it's resolved": "Yes, it's resolved",
        "yes resolved": "Yes, it's resolved",
        "issue fixed": "Yes, it's resolved",
        "problem solved": "Yes, it's resolved",
        "working now": "Yes, it's resolved",
        
        "no still need help": "No, I still need help",
        "still have problem": "No, I still need help",
        "not resolved": "No, I still need help",
        "need more help": "No, I still need help",
        "still not working": "No, I still need help",
        
        "submit concern": "Submit Concern Form",
        "submit form": "Submit Form"
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
            
            // Check if this is a specific issue or a concern category
            const isConcernCategory = [
                "Merchant App Concern", 
                "Customer App Concern", 
                "Application Process Issues", 
                "KYC & Verification Issues", 
                "Documentation Issues", 
                "Setup & Installation Issues", 
                "Payment Issues", 
                "Device Issues",
                "Others"
            ].includes(selection);
            
            // Check if the options array includes "Resolution Check"
            // If it does and this is not a concern category, automatically ask the resolution check question
            const options = [...menuItem.options]; // Create a copy of the options array
            const resolutionCheckIndex = options.indexOf("Resolution Check");
            
            if (resolutionCheckIndex !== -1 && !isConcernCategory) {
                // Remove the "Resolution Check" option
                options.splice(resolutionCheckIndex, 1);
                
                // Show the modified options
                displayQuickReplies(options);
                
                // After a short delay, show the resolution check message
                setTimeout(() => {
                    addMessage(menuStructure["Resolution Check"].message, 'bot');
                    displayQuickReplies(menuStructure["Resolution Check"].options);
                }, 1500);
            } else {
                // Display the quick reply options normally
                displayQuickReplies(menuItem.options);
            }
        } else {
            // Handle unknown selection
            addMessage("I'm not sure how to help with that specific option. Let me take you back to the main menu.", 'bot');
            navigationStack.length = 0;
            handleMenuSelection("Main Menu", true);
        }
    }
    
    // Enhanced function to find the best matching menu item based on keywords
    function findBestMatch(userMessage) {
        // First check exact match in intent map (case insensitive)
        const userMessageLower = userMessage.toLowerCase();
        
        // Check for direct match in intent map
        for (const [intent, menuItem] of Object.entries(intentMap)) {
            if (userMessageLower.includes(intent.toLowerCase())) {
                return menuItem;
            }
        }
        
        // If no direct match found, fallback to the existing word matching logic
        let bestMatch = null;
        let highestMatchCount = 0;
        const userWords = userMessageLower.split(/\s+/);

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

        // Return the best match if it has at least 1 matching word
        return highestMatchCount >= 1 ? bestMatch : null;
    }

    // Function to process the user's message
    function processMessage(message) {
        // For debugging purposes in development
        const debug = false; // Set to true to enable debug messages
        
        // Check if this is a form submission
        if (navigationStack.length > 0 && navigationStack[navigationStack.length - 1] === "Submit Concern Form") {
            // Process the form data
            addMessage("Processing your submission...", 'bot');
            setTimeout(() => {
                handleMenuSelection("Submit Form");
            }, 1000);
            return;
        }
        
        // If message starts with "AI: " - send to OpenAI
        if (message.trim().toLowerCase().startsWith('ai:')) {
            // Extract the actual query by removing the "AI:" prefix
            const query = message.substring(3).trim();
            
            // Process with AI
            processWithAI(query);
        }
        // Check if message is a direct menu selection
        else if (Object.keys(menuStructure).includes(message)) {
            handleMenuSelection(message);
        } else {
            // For free text input, try to find the best matching menu item or intent
            const bestMatch = findBestMatch(message);
            
            if (debug) {
                console.log(`User input: "${message}"`);
                console.log(`Best match found: "${bestMatch}"`);
            }
            
            if (bestMatch) {
                // If we found a good match, handle it as a menu selection
                addMessage("I found information related to your question!", 'bot');
                setTimeout(() => {
                    if (Object.keys(menuStructure).includes(bestMatch)) {
                        // If the best match is a menu item, navigate to it
                    handleMenuSelection(bestMatch);
                    } else {
                        // If it's a question that has a direct answer, show the answer
                        processMenuSelection(bestMatch);
                    }
                }, 1000);
            } else {
                // If no good match, automatically use AI instead of asking
                addMessage("I don't have a specific answer in my menu system. Let me use AI to help answer your question...", 'bot');
                // Short delay before processing with AI
                setTimeout(() => {
                    processWithAI(message);
                }, 1000);
            }
        }
    }
    
    // Helper function to process menu selections that might be direct answers
    function processMenuSelection(selection) {
        // Check if this is a direct question/answer rather than a menu
        if (menuStructure[selection]) {
            handleMenuSelection(selection);
        } else {
            // We need to find which menu item contains this answer
            for (const [key, value] of Object.entries(menuStructure)) {
                if (key === selection) {
                    handleMenuSelection(key);
                    return;
                }
            }
            
            // If we can't find a direct mapping, try to find it in the intent map
            for (const [intent, menuItem] of Object.entries(intentMap)) {
                if (menuItem === selection) {
                    if (menuStructure[menuItem]) {
                        handleMenuSelection(menuItem);
                        return;
                    }
                }
            }
            
            // If all else fails, return to main menu
            addMessage("I'm not sure how to help with that specific question. Let me show you the main options instead.", 'bot');
            handleMenuSelection("Main Menu");
        }
    }
    
    // Function to handle AI-specific replies
    function handleAIReply(selection) {
        if (selection === "Yes, use AI") {
            addMessage("Great! Please type your question with 'AI:' at the beginning. For example: 'AI: What is Samsung Finance+?'", 'bot');
            displayQuickReplies(["Main Menu", "Talk to Agent"]);
        } else if (selection === "No, show menu options") {
            addMessage("Sure, here are the main menu options:", 'bot');
            displayQuickReplies(["Merchant App Concern", "Customer App Concern", "FAQs", "Guides"]);
        }
    }
    
    // Function to process a query using OpenAI API
    async function processWithAI(query) {
        // Show typing indicator while waiting for response
        showTypingIndicator();
        
        try {
            // Use a serverless function endpoint to protect API key
            const response = await fetch('/api/chatai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query
                })
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();
            
            if (data.response) {
                addMessage(data.response, 'bot');
                
                // After AI response, offer some options
                setTimeout(() => {
                    displayQuickReplies(["Ask another AI question", "Main Menu", "Talk to Agent"]);
                }, 1000);
            } else {
                throw new Error('Invalid response from AI service');
            }
        } catch (error) {
            console.error('Error with AI processing:', error);
            hideTypingIndicator();
            addMessage("I'm sorry, I couldn't process your question at the moment. Would you like to try again or check our menu options?", 'bot');
            displayQuickReplies(["Ask another AI question", "Main Menu", "Talk to Agent"]);
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
            
            // Check for special quick reply options
            if (message === "Ask another AI question") {
                addMessage("Please type your question and I'll use AI to answer it.", 'bot');
                displayQuickReplies(["Main Menu", "Talk to Agent"]);
            } else if (message === "Yes, use AI" || message === "No, show menu options") {
                handleAIReply(message);
            } else {
        processMessage(message);
            }
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
        
        // Filter out "Talk to Agent" and "Resolution Check" from replies
        replies = replies.filter(reply => reply !== "Talk to Agent" && reply !== "Resolution Check");
        
        // Separate content buttons from navigation buttons
        const contentButtons = replies.filter(reply => !["Back", "Main Menu"].includes(reply));
        const navButtons = replies.filter(reply => ["Back", "Main Menu"].includes(reply));
        
        // Track which buttons are currently visible
        let currentIndex = 0;
        const buttonsPerPage = 8;
        
        // Function to show buttons for current page
        function showButtons(startIndex) {
            // Clear the container first
            quickReplySection.innerHTML = '';
            
            // Calculate end index (either 8 more or end of array)
            const endIndex = Math.min(startIndex + buttonsPerPage, contentButtons.length);
            
            // Create buttons for current page
            for (let i = startIndex; i < endIndex; i++) {
                const reply = contentButtons[i];
                const button = createQuickReplyButton(reply);
                quickReplySection.appendChild(button);
            }
        
            // Add "More" button if there are more options
            if (endIndex < contentButtons.length) {
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
            else if (startIndex > 0 && endIndex === contentButtons.length) {
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
            
            // Add navigation buttons with divider if we have any
            if (navButtons.length > 0) {
                // Add divider
                const divider = document.createElement('div');
                divider.classList.add('nav-divider');
                quickReplySection.appendChild(divider);
                
                // Add navigation buttons container
                const navContainer = document.createElement('div');
                navContainer.classList.add('nav-buttons-container');
                quickReplySection.appendChild(navContainer);
                
                // Add each navigation button
                navButtons.forEach(reply => {
                    const button = createQuickReplyButton(reply);
                    button.classList.add('nav-button');
                    navContainer.appendChild(button);
                });
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
        
        // Show first page of buttons (only if we have content buttons)
        if (contentButtons.length > 0) {
            showButtons(0);
        } else if (navButtons.length > 0) {
            // If we only have navigation buttons, show them directly
            const navContainer = document.createElement('div');
            navContainer.classList.add('nav-buttons-container');
            quickReplySection.appendChild(navContainer);
            
            // Add each navigation button
            navButtons.forEach(reply => {
                const button = createQuickReplyButton(reply);
                button.classList.add('nav-button');
                navContainer.appendChild(button);
            });
            
            // Scroll to bottom after adding buttons
            scrollToBottom();
        }
    }
    
    // Start with the main menu
    function initializeChatbot() {
        // Show main menu options directly
        handleMenuSelection("Main Menu", true);
    }

    // Initialize the chatbot when the page loads
    initializeChatbot();

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


