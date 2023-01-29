package translit

import (
	"fmt"
	"strings"
)

var baseRuEn = map[string]string{
	"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "j", "з": "z", "и": "i", "й": "i",
	"к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
	"х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sc", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "iu", "я": "ia",
}

func GenerateLinkFromText(text string) string {
	text = strings.ReplaceAll(strings.ToLower(text), " ", "-")

	var link strings.Builder
	for _, ru := range text {
		fmt.Println(string(ru))
		if _, exist := baseRuEn[string(ru)]; !exist {
			link.WriteRune(ru)
		} else {
			link.WriteString(baseRuEn[string(ru)])
		}
	}

	return link.String()
}
