package helper

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"gorm.io/gorm"
)

type Helper struct {
	DB            *gorm.DB
	ctx           context.Context
	fields        []string
	filterOptions map[string]string
}

func New(db *gorm.DB, ctx context.Context, model interface{}) *Helper {
	var fields []string
	modelType := reflect.TypeOf(model)
	for i := 0; i < modelType.NumField(); i++ {
		fields = append(fields, modelType.Field(i).Tag.Get("json"))
	}

	filterOptions := map[string]string{
		"starts_with": "%s%%",
		"ends_with":   "%%s%",
		"contains":    "%%%s%%",
		"equal":       "%s",
	}

	return &Helper{DB: db, ctx: ctx, fields: fields, filterOptions: filterOptions}
}

func (helper *Helper) Paging() *Helper {
	db := helper.DB

	if offset := helper.ctx.Value("offset").(*int); offset != nil {
		db = db.Offset(*offset)
	}

	if limit := helper.ctx.Value("limit").(*int); limit != nil {
		db = db.Limit(*limit)
	}

	helper.DB = db
	return helper
}

func (helper *Helper) Order() *Helper {
	db := helper.DB

	if sort := helper.ctx.Value("sort_by").(*string); sort != nil {
		var resultSort []string

		sorts := strings.Split(*sort, ",")
		for _, s := range sorts {
			order := strings.Split(s, ".")

			if len(order) > 2 {
				return helper
			}

			direction := "asc"
			if len(order) == 2 {
				if strings.ToLower(order[1]) != "asc" && strings.ToLower(order[1]) != "desc" {
					return helper
				}

				direction = order[1]
			}

			valid := false
			for _, field := range helper.fields {
				if strings.ToLower(order[0]) == strings.ToLower(field) {
					valid = true
				}
			}

			if !valid {
				return helper
			}

			resultSort = append(resultSort, fmt.Sprintf("%s %s", order[0], direction))
		}

		db = db.Order(strings.Join(resultSort, ", "))
	}

	helper.DB = db
	return helper
}

func (helper *Helper) Filter(args ...string) *Helper {
	db := helper.DB

	if query := helper.ctx.Value("query").(*string); query != nil {
		db = db.Where(fmt.Sprintf("%s ILIKE '%%%s%%'", strings.Join(args, " || ' ' || "), *query))
	}

	helper.DB = db

	if filterField := helper.ctx.Value("filter_field").(*string); filterField != nil {
		validField := false
		for _, field := range helper.fields {
			if strings.ToLower(*filterField) == strings.ToLower(field) {
				validField = true
			}
		}

		if filterOption := helper.ctx.Value("filter_option").(*string); filterOption != nil && validField {
			if option, ok := helper.filterOptions[*filterOption]; ok {
				if filterValue := helper.ctx.Value("filter_value").(*string); filterValue != nil && validField {
					db = db.Where(fmt.Sprintf(fmt.Sprintf("%s ILIKE '%s'", *filterField, option), *filterValue))
				}
			}
		}
	}

	helper.DB = db
	return helper
}
