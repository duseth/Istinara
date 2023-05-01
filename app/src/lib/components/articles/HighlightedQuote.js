import React from "react";

const HighlightedQuote = (input_quote: string, input_title: string, highlight: string) => {
    const remove_diacritics = (str) => {
        return str.replace((/[\u064B-\u0652]/g), "");
    };

    let start, end;
    if (highlight) {
        start = input_quote.indexOf(highlight);
        end = start + highlight.length;
    } else {
        try {
            input_title = input_title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const titleLength = input_title.length;
            const quote = remove_diacritics(input_quote);

            let title = null;
            const variables = [
                input_title,
                input_title.slice(0, titleLength - 1),
                input_title.slice(0, titleLength - 2),
                input_title.slice(1, titleLength),
                input_title.slice(2, titleLength)
            ];

            for (const variable of variables) {
                const re = new RegExp("([^\\s\\.,]*)(" + remove_diacritics(variable) + ")([^\\s\\.,]*)", "gi");
                title = quote.match(re);

                if (title) {
                    break;
                }
            }

            if (title === null) {
                return <p>{input_quote}</p>
            }

            start = input_quote.indexOf(title[0]);
            end = start + title[0].length;
        } catch {
        }
    }

    return (
        <p>
            {input_quote.substring(0, start)}
            <b className="article-quote">{input_quote.substring(start, end)}</b>
            {input_quote.substring(end, input_quote.length)}
        </p>
    )
}

export default HighlightedQuote;