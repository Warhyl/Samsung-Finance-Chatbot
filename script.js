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
                "What is the Samsung Finance+ UnionBank Loan?",
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
            message: "Samsung Finance+ is a convenient platform that lets you purchase Samsung devices with affordable monthly payments. Here in the Philippines, we offer 0% interest and no processing fees, making it easier for you to get your dream Samsung device!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What is the Samsung Finance+ UnionBank Loan?": {
            message: "The Samsung Finance+ UnionBank Loan is a fully digital loan solution for purchasing Samsung gadgets. The best part? Your application can be completed in as fast as 5 minutes with just one valid government-issued ID!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "How is Samsung Finance+ different?": {
            message: "Samsung Finance+ stands out with these amazing benefits:\n\n• 0% Interest on device loans\n• 0% Processing Fee\n• 0% Down Payment (subject to risk scoring, ranges from 0-30%)\n\nThis means you get the best value for your money with no hidden charges!",
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
            message: "Currently, you can purchase mobile phones and tablets through Samsung Finance+. We're working on including wearables and accessories in the future!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What loan tenors are available?": {
            message: "We offer flexible loan tenors to suit your needs:\n\nFor Flagship devices:\n• 12 months\n• 18 months\n• 24 months\n\nFor Non-flagship devices:\n• 6 months\n• 9 months\n• 12 months\n\nChoose the tenor that works best for your budget!",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Merchant App Concern": {
            message: "Please select the category of your Merchant App concern:",
            options: [
                "Application Process Issues",
                "KYC & Verification Issues",
                "Documentation Issues",
                "Others",
                "Back",
                "Talk to Agent"
            ]
        },
        "Application Process Issues": {
            message: "Please select the specific application process issue:",
            options: [
                "Not Receiving OTP Code",
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
        },
        "Who is eligible to apply?": {
            message: "To apply for Samsung Finance+, you must meet these requirements:\n\n• Be 21-70 years old\n• Have good credit standing\n• Not be a UnionBank employee\n• Have an active email and mobile number\n• Have a valid government-issued ID\n• Pass the Know-Your-Customer (KYC) process\n\nWe've made the process simple and accessible for qualified applicants!",
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
            message: "If you miss a payment:\n\n• A ₱150 late fee will be applied\n• Your device will be locked\n\nWe recommend making payments on time to avoid these consequences and maintain uninterrupted access to your device.",
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
            message: "If you see 'Application Timed Out' in the Merchant App:\n\n• Try refreshing the Offers screen\n• Try refreshing the KYC Registration screen\n• If the issue persists, try again later or contact support",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "Does being rejected from Samsung Finance+ affect my credit score?": {
            message: "No, being rejected from Samsung Finance+ does not affect your credit score or other financing applications. You can still apply for other financing options without any impact.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What if my device is defective?": {
            message: "For defective devices:\n\n• Within 7 days: You can get a replacement\n• After 7 days: Visit a Samsung service center for repair\n\nMake sure to keep your device in good condition and report any issues promptly.",
            options: ["Back", "Talk to Agent", "Main Menu"]
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
            message: "When entering names with special characters:\n\n• Omit special characters\n• Example: 'Mary-Ann' should be entered as 'Mary Ann'\n\nThis helps prevent any system issues during processing.",
            options: ["Back", "Talk to Agent", "Main Menu"]
        },
        "What if my device gets locked without internet access?": {
            message: "If your device gets locked without internet access:\n\n• Contact the Samsung Finance+ tech team\n• Contact UnionBank for unlocking support\n• Make sure to have your payment ready when contacting support",
            options: ["Back", "Talk to Agent", "Main Menu"]
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

        // Return the best match if it has at least 1 matching word
        return highestMatchCount >= 1 ? bestMatch : null;
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
                addMessage("I think I found the answer to your question!", 'bot');
                setTimeout(() => {
                    handleMenuSelection(bestMatch);
                }, 1000);
            } else {
                // If no good match found, provide a generic response
                addMessage("I'm not sure about that specific question. Let me help you find the right information.", 'bot');
                setTimeout(() => {
                    addMessage("You can check our FAQs or select from the main menu options below:", 'bot');
                    displayQuickReplies(["FAQs", "Merchant App Concern", "Customer App Concern"]);
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
        const buttonsPerPage = 8;
        
        // Function to show buttons for current page
        function showButtons(startIndex) {
            // Clear the container first
            quickReplySection.innerHTML = '';
            
            // Calculate end index (either 8 more or end of array)
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
