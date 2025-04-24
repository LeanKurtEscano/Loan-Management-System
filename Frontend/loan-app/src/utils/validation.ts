










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
 