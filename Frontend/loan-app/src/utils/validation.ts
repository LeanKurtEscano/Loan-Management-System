export const validateFirstName = (firstName: string): string => {
    const regex = /^[A-Z][a-z]*([ ]([A-Z][a-z]*))*$/; // Proper capitalization rule
    const invalidCharsRegex = /[^A-Za-z\s]/; // Checks for special characters or numbers
    const repeatedCharRegex = /(.)\1{2,}/; // Checks for repeated characters
    const maxLength = 20;
    const repeatedWordPattern = /^(\b\w+\b)(?:\s+\1){1}$/; // Regex to allow exactly two occurrences of the same word (e.g., "Jan Jan")

    const randomCombinationRegex = /^[A-Za-z]+([ ]([A-Z][a-z]*))*$/; 
    const words = firstName.trim().split(/\s+/); // Splits by any whitespace

    // If the name consists of a single word and the length of that word is greater than 10
    if (words.length === 1 && firstName.length > 10) {
        // Regex to prevent a single unstructured word (e.g., random characters, no spaces, too long)
        const unstructuredRegex = /^[a-zA-Z]+$/; // Ensures only letters, no spaces, and no special characters
        if (unstructuredRegex.test(firstName)) {
            return "Name must not consist of a single unstructured word with more than 10 characters.";
        }
    }

    // Prevent long sequences of characters that appear random
    const randomSequenceRegex = /([a-zA-Z])\1{3,}/; // Looks for sequences of the same letter repeated more than 3 times

    // Check if the first name is empty
    if (!firstName) return "First name is required.";

    // Check for invalid characters like numbers or special characters
    if (invalidCharsRegex.test(firstName.trim()))
        return "First name must not contain special characters or numbers.";

    // Validate capitalization rule (only first letters are capitalized properly)
    if (!regex.test(firstName.trim()))
        return "Capitalization is allowed only at the start of each word in name";

    // Check if the name length is within the valid range
    if (firstName.trim().length < 2)
        return "First name must be at least 2 characters long.";
    if (firstName.trim().length > maxLength)
        return `First name must be at most ${maxLength} characters long.`;

    const lowerCaseName = firstName.trim().toLowerCase();

    // Check for random 2- or 3-letter combinations, but allow the first word to be random
    if (randomCombinationRegex.test(firstName.trim())) {
        // No need to check for random combinations after the first word
    } else {
        return "First name must not contain random two letter combinations";
    }

    // Check for long sequences of the same character (e.g., "aaaa")
    if (randomSequenceRegex.test(firstName.trim())) {
        return "First name must not contain long sequences of the same character.";
    }

    // Check for repeated characters
    if (repeatedCharRegex.test(lowerCaseName))
        return "First name must not contain repeated characters.";

    // Check for exactly two repeated words (e.g., "Jan Jan")
    if (repeatedWordPattern.test(firstName.trim()))
        return ""; // Allow repeated valid names (e.g., "Jan Jan")

    // Check for other invalid duplicated patterns (three or more repetitions)
    const threeOrMoreRepeatsPattern = /(\b\w+\b)(?:\s+\1){2,}/; // Three or more occurrences
    if (threeOrMoreRepeatsPattern.test(firstName.trim()))
        return "First name must not contain duplicated patterns";

    return "";
};


export const validateMiddleName = (middleName: string): string => {
    const regex = /^[A-Z][a-z]*([ ]([A-Z][a-z]*))*$/;
    const invalidCharsRegex = /[^A-Za-z\s]/;
    const repeatedCharRegex = /(.)\1{2,}/;
    const maxLength = 20;
    const repeatedWordPattern = /^(\b\w+\b)(?:\s+\1){1}$/;

    const randomCombinationRegex = /^[A-Za-z]+([ ]([A-Z][a-z]*))*$/; 
    const words = middleName.trim().split(/\s+/);

    if (words.length === 1 && middleName.length > 10) {
        const unstructuredRegex = /^[a-zA-Z]+$/;
        if (unstructuredRegex.test(middleName)) {
            return "Middle name must not consist of a single unstructured word with more than 10 characters.";
        }
    }

    const randomSequenceRegex = /([a-zA-Z])\1{3,}/;

    if (!middleName) return "Middle name is required.";

    if (invalidCharsRegex.test(middleName.trim()))
        return "Middle name must not contain special characters or numbers.";

    if (!regex.test(middleName.trim()))
        return "Capitalization is allowed only at the start of each word in name";

    if (middleName.trim().length < 2)
        return "Middle name must be at least 2 characters long.";
    if (middleName.trim().length > maxLength)
        return `Middle name must be at most ${maxLength} characters long.`;

    const lowerCaseName = middleName.trim().toLowerCase();

    if (randomCombinationRegex.test(middleName.trim())) {
    } else {
        return "Middle name must not contain random two letter combinations";
    }

    if (randomSequenceRegex.test(middleName.trim())) {
        return "Middle name must not contain long sequences of the same character.";
    }

    if (repeatedCharRegex.test(lowerCaseName))
        return "Middle name must not contain repeated characters.";

    if (repeatedWordPattern.test(middleName.trim()))
        return ""; 

    const threeOrMoreRepeatsPattern = /(\b\w+\b)(?:\s+\1){2,}/; 
    if (threeOrMoreRepeatsPattern.test(middleName.trim()))
        return "Middle name must not contain duplicated patterns";

    return "";
};


export const validateLastName = (lastName: string): string => {
    const regex = /^[A-Z][a-z]*([ ]([A-Z][a-z]*))*$/;
    const invalidCharsRegex = /[^A-Za-z\s]/;
    const repeatedCharRegex = /(.)\1{2,}/;
    const maxLength = 20;
    const repeatedWordPattern = /^(\b\w+\b)(?:\s+\1){1}$/;

    const randomCombinationRegex = /^[A-Za-z]+([ ]([A-Z][a-z]*))*$/; 
    const words = lastName.trim().split(/\s+/);

    if (words.length === 1 && lastName.length > 10) {
        const unstructuredRegex = /^[a-zA-Z]+$/;
        if (unstructuredRegex.test(lastName)) {
            return "Last name must not consist of a single unstructured word with more than 10 characters.";
        }
    }

    const randomSequenceRegex = /([a-zA-Z])\1{3,}/;

    if (!lastName) return "Last name is required.";

    if (invalidCharsRegex.test(lastName.trim()))
        return "Last name must not contain special characters or numbers.";

    if (!regex.test(lastName.trim()))
        return "Capitalization is allowed only at the start of each word in name";

    if (lastName.trim().length < 2)
        return "Last name must be at least 2 characters long.";
    if (lastName.trim().length > maxLength)
        return `Last name must be at most ${maxLength} characters long.`;

    const lowerCaseName = lastName.trim().toLowerCase();

    if (randomCombinationRegex.test(lastName.trim())) {
    } else {
        return "Last name must not contain random two letter combinations";
    }

    if (randomSequenceRegex.test(lastName.trim())) {
        return "Last name must not contain long sequences of the same character.";
    }

    if (repeatedCharRegex.test(lowerCaseName))
        return "Last name must not contain repeated characters.";

    if (repeatedWordPattern.test(lastName.trim()))
        return ""; 

    const threeOrMoreRepeatsPattern = /(\b\w+\b)(?:\s+\1){2,}/; 
    if (threeOrMoreRepeatsPattern.test(lastName.trim()))
        return "Last name must not contain duplicated patterns";

    return "";
};


export const validateUsername = (username: string): string => {
    // Trim leading/trailing spaces
    if (!username.trim()) {
        return "Username is required.";
    }

    username = username.trim();

    // Length check
    if (username.length < 3 || username.length > 20) {
        return "Username must be between 3 and 20 characters long.";
    }

    // Allow letters, numbers, dots, underscores, hyphens, and spaces
    const usernameRegex = /^[a-zA-Z0-9._\- ]+$/;
    if (!usernameRegex.test(username)) {
        return "Username can only contain letters, numbers, spaces, dots (.), underscores (_), or hyphens (-).";
    }

    // Disallow starting/ending with symbols or space
    if (/^[ ._-]|[ ._-]$/.test(username)) {
        return "Username cannot start or end with a space, dot (.), underscore (_), or hyphen (-).";
    }

    // Disallow repeated special symbols or spaces
    if (/([ ._-])\1/.test(username)) {
        return "Username cannot contain repeated spaces or symbols like '..', '__', or '--'.";
    }

    return "";
};


export const validateExplanation = (text: string): string => {
    // Trim input
    if (!text.trim()) {
        return "Explanation is required.";
    }

    text = text.trim();

    // Minimum and maximum length
    if (text.length < 10) {
        return "Explanation must be at least 10 characters long.";
    }

    if (text.length > 1000) {
        return "Explanation must be under 1000 characters.";
    }

    // Disallow all-numeric inputs
    if (/^\d+$/.test(text)) {
        return "Explanation cannot consist of only numbers.";
    }

    // Optional: Prevent repeated punctuation marks (e.g., "!!!", "....")
    if (/([.?!,])\1{2,}/.test(text)) {
        return "Explanation contains too many repeated punctuation marks.";
    }

    return "";
};




export const validateEmail = (email: string): string => {
    const validProviders = [
     'gmail.com', 'yahoo.com', 'yahoo.com.ph', 'outlook.com', 'hotmail.com', 'aol.com', 
     'icloud.com', 'gov.ph', 'dfa.gov.ph', 'dip.gov.ph', 'deped.gov.ph', 'neda.gov.ph', 
     'doh.gov.ph', 'dti.gov.ph', 'dswd.gov.ph', 'dbm.gov.ph', 'pcso.gov.ph', 'pnp.gov.ph', 
     'bsp.gov.ph', 'prc.gov.ph', 'psa.gov.ph', 'dpwh.gov.ph', 'lto.gov.ph', 'boi.gov.ph',
     'hotmail.co.uk', 'hotmail.fr', 'msn.com', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 
     'comcast.net', 'yahoo.co.uk', 'yahoo.com.br', 'yahoo.com.in', 'live.com', 
     'rediffmail.com', 'free.fr', 'gmx.de', 'web.de', 'yandex.ru', 'ymail.com', 
     'libero.it', 'uol.com.br', 'bol.com.br', 'mail.ru', 'cox.net', 'hotmail.it', 
     'sbcglobal.net', 'sfr.fr', 'live.fr', 'verizon.net', 'live.co.uk', 'googlemail.com', 
     'yahoo.es', 'ig.com.br', 'live.nl', 'bigpond.com', 'terra.com.br', 'yahoo.it', 
     'neuf.fr', 'yahoo.de', 'alice.it', 'rocketmail.com', 'att.net', 'laposte.net', 
     'facebook.com', 'bellsouth.net', 'yahoo.in', 'hotmail.es', 'charter.net', 
     'yahoo.ca', 'yahoo.com.au', 'rambler.ru', 'hotmail.de', 'tiscali.it', 'shaw.ca', 
     'yahoo.co.jp', 'sky.com', 'earthlink.net', 'optonline.net', 'freenet.de', 
     't-online.de', 'aliceadsl.fr', 'virgilio.it', 'home.nl', 'qq.com', 'telenet.be', 
     'me.com', 'yahoo.com.ar', 'tiscali.co.uk', 'yahoo.com.mx', 'voila.fr', 'gmx.net', 
     'mail.com', 'planet.nl', 'tin.it', 'live.it', 'ntlworld.com', 'arcor.de', 
     'yahoo.co.id', 'frontiernet.net', 'hetnet.nl', 'live.com.au', 'yahoo.com.sg', 
     'zonnet.nl', 'club-internet.fr', 'juno.com', 'optusnet.com.au', 'blueyonder.co.uk', 
     'bluewin.ch', 'skynet.be', 'sympatico.ca', 'windstream.net', 'mac.com', 
     'centurytel.net', 'chello.nl', 'live.ca', 'aim.com', 'bigpond.net.au',
     'up.edu.ph', 'addu.edu.ph', 'ateneo.edu.ph', 'dlsu.edu.ph', 'ust.edu.ph', 'lu.edu.ph'
 ]
 
     email = email.trim();
 
     if (!email) return "Email is required.";
 
     const localPart = email.split('@')[0];
     if (localPart.length > 64) {
         return "The local part (before the '@') of the email address cannot exceed 64 characters.";
     }
 
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}(\.[a-z]{2,})?$/;
 
     if (!emailRegex.test(email)) {
         return "Invalid email format. Please enter a valid email address.";
     }
 
     const domain = email.split('@')[1];
 
     // Strict validation to ensure no invalid trailing patterns after valid government email domains
     const isStrictGovPh = validProviders.some(provider => new RegExp(`^${provider}$`).test(domain));
 
     if (!isStrictGovPh) {
         return `Invalid email domain. ${domain} is not a recognized email provider.`;
     }
 
     return "";
 };
 

 export const validateAddress = (address: string): string => {
    if (!address.trim()) {
        return "Address is required.";
    }

    address = address.trim();

    if (address.length < 5 || address.length > 100) {
        return "Address must be between 5 and 100 characters long.";
    }

    const addressRegex = /^[a-zA-Z0-9\s.,'-]+$/;
    if (!addressRegex.test(address)) {
        return "Address can only contain letters, numbers, commas, periods, dashes, apostrophes, and spaces.";
    }

    return "";
};


export const validatePostalCode = (postalCode: string): string => {
    if (!postalCode.trim()) {
        return "Postal code is required.";
    }

    postalCode = postalCode.trim();

    // General pattern: allows 4 to 10 characters, numbers and optional dash
    const postalRegex = /^[0-9]{4,10}(-[0-9]{3,4})?$/;
    if (!postalRegex.test(postalCode)) {
        return "Invalid postal code format.";
    }

    return "";
};
export const validateAmountSpent = (amount: string): string => {
    // Check if empty
    if (!amount.trim()) {
        return "Amount is required.";
    }
    
    const specialCases = ['n/a', 'none', 'no'];
    
    // Handle special text cases (case-insensitive)
    if (specialCases.includes(amount.trim().toLowerCase())) {
        return "";
    }
    
    // Check if input is a valid number format (including negative values)
    // Updated regex to reject leading zeros except for decimal values less than 1
    const validNumberRegex = /^-?([1-9][0-9]*|0)(\.[0-9]{1,2})?$/;
    if (validNumberRegex.test(amount)) {
        const num = parseFloat(amount);
        
        // Check if parsed value is a number
        if (isNaN(num)) {
            return "Must be a valid number.";
        }
        
        // Value constraints
        if (num <= 0) {
            return "Amount must be greater than 0.";
        }
        
        if (num > 10000000) {
            return "Amount must not exceed 10,000,000.";
        }
        
        return "";
    }
    
    // If we get here, check what type of invalid input we have
    
    // Check if it's a number format with leading zeros (except for decimal less than 1)
    if (/^-?0[0-9]+(\.[0-9]{1,2})?$/.test(amount)) {
        return "Numbers cannot have leading zeros.";
    }
    
    // Check if it looks like a number but fails our validation
    if (/^-?[0-9]+(\.[0-9]{1,2})?$/.test(amount)) {
        return "Invalid number format.";
    }
    
    // For all other cases (random text, non-allowed words, etc.)
    return "Invalid input. Only 'N/A', 'none', 'no' or a valid number are allowed.";
}


export const validateLoanAmount = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "Loan amount is required.";
    }
  
    if (amount <= 0) {
      return "Loan amount must be greater than 0.";
    }

    if (amount < 500) {
        return "Loan amount must be at least 500.";
      }
  
  
  
    return "";
  };
  
  export const validateInterest = (interest: number): string => {
    if (interest === null || interest === undefined || isNaN(interest)) {
      return "Interest rate is required.";
    }
  
    if (interest <= 0) {
      return "Interest rate must be greater than 0%.";
    }
  
    if (interest > 100) {
      return "Interest rate must not exceed 100%.";
    }
  
    // Optional: limit to 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(interest.toString())) {
      return "Interest rate must have up to 2 decimal places.";
    }
  
    return "";
  };
  

  export const validateRepayDate = (date: string): string => {
    // Check if date is provided
    if (!date.trim()) {
      return "Repayment date is required.";
    }
  
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 180); // 6 months from today
  
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 5); // 6 years from today
  
    // Check if the selected date is valid
    if (isNaN(selectedDate.getTime())) {
      return "Invalid date format.";
    }
  
    // Check if the selected date is at least 6 months ahead
    if (selectedDate < minDate) {
      return "Repayment date must be at least 6 months from today.";
    }
  
    // Check if the selected date is within 6 years
    if (selectedDate > maxDate) {
      return "Repayment date must not be more than 5 years from today.";
    }
  
    return "";
  };
  
  

  export const validateContactNumber = (contactNumber: string): string => {
    
    const regex = /^09\d{9}$/; 

    if (!contactNumber) return "Contact number is required.";

    const trimmedContactNumber = contactNumber.trim();
    

    if (/[^0-9]/.test(trimmedContactNumber)) {
        return "Contact number must not contain letters or special characters.";
    }
  
    if (!regex.test(trimmedContactNumber)) {
        return "Contact number must be a valid Philippine mobile number.";
    }

   
    if (/(\d)\1{3,}/.test(trimmedContactNumber)) {
        return "Contact number must not contain 4 or more repeating digits.";
    }

   
 

    return "";
};