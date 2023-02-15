package datatypes

import (
	"database/sql/driver"
	"strings"
	"time"
)

type Date struct {
	Time  time.Time
	Valid bool // Valid is true if Time is not NULL
}

const dateLayout = "02-01-2006"

//goland:noinspection GoMixedReceiverTypes
func (date *Date) Scan(value interface{}) (err error) {
	date.Time, date.Valid = value.(time.Time)
	return nil
}

//goland:noinspection GoMixedReceiverTypes
func (date Date) Value() (driver.Value, error) {
	if !date.Valid {
		return nil, nil
	}
	y, m, d := date.Time.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, date.Time.Location()), nil
}

//goland:noinspection GoMixedReceiverTypes
func (date Date) GormDataType() string {
	return "date"
}

//goland:noinspection GoMixedReceiverTypes
func (date Date) MarshalJSON() ([]byte, error) {
	return date.Time.MarshalJSON()
}

//goland:noinspection GoMixedReceiverTypes
func (date *Date) UnmarshalJSON(bytes []byte) (err error) {
	value := strings.Trim(string(bytes), `"`)
	if value == "" {
		return
	}

	date.Time, err = time.Parse(dateLayout, value)
	if err != nil {
		return err
	}
	date.Valid = true

	return
}
