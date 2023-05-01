package helper

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"gorm.io/gorm"
)

type Helper struct {
	DB    *gorm.DB
	ctx   context.Context
	model interface{}
}

func New(db *gorm.DB, ctx context.Context, model interface{}) *Helper {
	return &Helper{DB: db, ctx: ctx, model: model}
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

		var fields []string
		modelType := reflect.TypeOf(helper.model)
		for i := 0; i < modelType.NumField(); i++ {
			fields = append(fields, modelType.Field(i).Tag.Get("json"))
		}

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
			for _, field := range fields {
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
		for _, property := range args {
			db = db.Or(fmt.Sprintf("%s ILIKE '%%%s%%'", property, *query))
		}
	}

	helper.DB = db
	return helper
}
