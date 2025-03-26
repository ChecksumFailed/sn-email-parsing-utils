import { gs } from "@servicenow/glide";

type parsedEmailObj = { [key: string]: string };
export class ParsingUtils {
    private logger: any; // no GSLOG in @servicenow/glide

    constructor(debug = false) {
        this.logger = new global.GSLog('', 'Parse Email Body flow action');
        const logLevel = debug ? "debug" : "warn";
        this.logger.setLevel(logLevel);
    }

    /**
     * Strip out HTML and weirdly formatted HTML.
     */
    public htmlToStr(html:string):string {
        if (gs.nil(html) || typeof html !== "string") {
            throw new Error("CF_EmailParser().htmlToStr(): html is undefined, null, or not a string.");
        }
        try {
            const noHTML = html
                .replace(/<br(?:\s*)?\/?>/gi, "\n") // Replace <br> tags (and variations like <br/> or <BR>) with a newline
                .replace(/(<\/(?:tr|div|p)>)\s*([^\n])/, "$1\n$2") // Add a newline after closing tags </tr>, </div>, or </p> if the next character is not already a newline
                .replace(/(<\/(?:td)>)\s*\n/gi, "$1") // Remove unnecessary newlines after closing </td> tags
                .replace(/(<([^>]+)>)/ig, ''); // Remove all remaining HTML tags
            return decodeURIComponent(noHTML);
        } catch (err) {
            gs.error("Error decoding URI: " + err.message);
            return html; // Return the original HTML if decoding fails
        }
    }

    /**
     * Check if a string contains any HTML tags.
     */
    isHTML(strToCheck = ''):boolean {
        try {
            return /<[^>]+>/i.test(strToCheck); // Matches any HTML tag\
        } catch (ex) {
            gs.error("Error in isHTML: " + ex.message);
            return false;
        }
    }

    /**
     * Parse the email body text into a key-value object.
     */
    parseEmailBody(emailBodyText:string):parsedEmailObj {
        if (gs.nil(emailBodyText) || typeof emailBodyText !== "string") {
            throw new Error("CF_EmailParser().parseEmailBody(): emailBodyText is undefined, null, or not a string.");
        }
        try {
            let body_text = emailBodyText.toString();

            // Process with htmlToStr if any HTML is detected
            if (this.isHTML(body_text)) {
                this.logger.logDebug("HTML detected - Body Text before cleanup: \n" + body_text);
                body_text = this.htmlToStr(body_text);
                this.logger.logDebug("Body Text after cleanup: \n" + body_text);
            }

            const regEx = /^([^:\n\t]+):(.+)$/gmi; // Match key-value pairs separated by a colon
            const emailObj:parsedEmailObj = {};
            let matches;

            while ((matches = regEx.exec(body_text)) !== null) {
                emailObj[matches[1].trim()] = matches[2].trim();
            }

            return emailObj;
        } catch (ex) {
            gs.error("Error in parsing email body: " + ex.message);
            return {};
        }
    }
}
