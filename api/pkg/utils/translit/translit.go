package translit

import (
	"strings"
)

const (
	Ru = iota
)

var ruMatch = map[string]string{
	"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "j", "з": "z", "и": "i", "й": "i",
	"к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
	"х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sc", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "iu", "я": "ia",
}

func Translate(text string, base int) string {
	text = strings.ReplaceAll(strings.ToLower(text), " ", "-")

	var match map[string]string
	switch base {
	case Ru:
		match = ruMatch
	}

	var result strings.Builder
	for _, letter := range text {
		if _, exist := match[string(letter)]; !exist {
			result.WriteRune(letter)
		} else {
			result.WriteString(match[string(letter)])
		}
	}

	return result.String()
}
