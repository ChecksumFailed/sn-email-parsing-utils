import { gs } from "@servicenow/glide";

type ParsedEmailObj = { [key: string]: string };

interface IGSLog {
    setLevel(level: string): void;
    logDebug(message: string): void;
    logError(message: string): void;
}

/**
 * Utility class for parsing email bodies and handling HTML strings.
 */
export class ParsingUtils {
    private logger: IGSLog; // no GSLOG in @servicenow/glide

    /**
     * Initializes the ParsingUtils class.
     * @param {boolean} debug - Whether to enable debug logging.
     */
    constructor(debug = false) {
        // @ts-expect-error GSLog is a ServiceNow global
        this.logger = new global.GSLog('', 'Parse Email Body flow action') as IGSLog;
        const logLevel = debug ? "debug" : "warn";
        this.logger.setLevel(logLevel);
    }

    /**
     * Strip out HTML and weirdly formatted HTML.
     * @param {string} html - The HTML string to convert to plain text.
     * @returns {string} The converted plain text string.
     */
    public htmlToStr(html:string):string {
        if (gs.nil(html) || typeof html !== "string") {
            throw new Error("CF_EmailParser().htmlToStr(): html is undefined, null, or not a string.");
        }
        try {
            const noHTML = html
                .replace(/<br\s*\/?>/gi, "\n") // Replace <br> tags (and variations like <br/> or <BR>) with a newline
                .replace(/(?<tag><\/(?:tr|div|p)>)\s*(?<next>[^\n])/g, "$<tag>\n$<next>") // Add a newline after closing tags </tr>, </div>, or </p> if the next character is not already a newline
                .replace(/(?<tdTag><\/td>)\s*\n/gi, "$<tdTag>") // Remove unnecessary newlines after closing </td> tags
                .replace(/<[a-z/][^>]*>/gi, ''); // Remove all remaining HTML tags
            return decodeURIComponent(noHTML);
        } catch (err: unknown) {
            if (err instanceof Error) {
                gs.error("Error decoding URI: " + err.message);
            }
            return html; // Return the original HTML if decoding fails
        }
    }

    /**
     * Check if a string contains any HTML tags.
     * @param {string} strToCheck - The string to check for HTML.
     * @returns {boolean} True if the string contains HTML, false otherwise.
     */
    isHTML(strToCheck = ''):boolean {
        try {
            return /<[a-z/][^>]*>/i.test(strToCheck); // Matches any HTML tag
        } catch (ex: unknown) {
            if (ex instanceof Error) {
                gs.error("Error in isHTML: " + ex.message);
            }
            return false;
        }
    }

    /**
     * Parse the email body text into a key-value object.
     * @param {string} emailBodyText - The email body text to parse.
     * @returns {ParsedEmailObj} The parsed key-value object.
     */
    parseEmailBody(emailBodyText:string):ParsedEmailObj {
        if (gs.nil(emailBodyText) || typeof emailBodyText !== "string") {
            throw new Error("CF_EmailParser().parseEmailBody(): emailBodyText is undefined, null, or not a string.");
        }
        try {
            let bodyText = emailBodyText.toString();

            // Process with htmlToStr if any HTML is detected
            if (this.isHTML(bodyText)) {
                this.logger.logDebug("HTML detected - Body Text before cleanup: \n" + bodyText);
                bodyText = this.htmlToStr(bodyText);
                this.logger.logDebug("Body Text after cleanup: \n" + bodyText);
            }

            const emailObj:ParsedEmailObj = Object.create(null);
            const lines = bodyText.split(/\r?\n/);

            for (const line of lines) {
                const colonIndex = line.indexOf(':');
                // Ensure there is a key (length > 0) before the colon
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    
                    if (key && value) {
                        // eslint-disable-next-line security/detect-object-injection
                        emailObj[key] = value;
                    }
                }
            }

            return emailObj;
        } catch (ex: unknown) {
            if (ex instanceof Error) {
                gs.error("Error in parsing email body: " + ex.message);
            }
            return {};
        }
    }
}
