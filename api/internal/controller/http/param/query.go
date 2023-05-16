package param

import (
	"context"
)

// ListQuery parameters values
//
//	@Description	Query parameters for getting entities
type ListQuery struct {
	// Number of records skipped
	Offset *int `json:"offset" form:"offset" example:"5"`

	// Record limit
	Limit *int `json:"limit" form:"limit" example:"5"`

	// Sort options
	SortBy *string `json:"sort_by" form:"sort_by" example:"name_ru.asc"`

	// Sort options
	Filter QueryFilter `json:"filter" form:"filter" example:"{'field': 'name_ru', 'value': 'A', 'option': 'starts_with'}"`

	// Search query
	Query *string `json:"query" form:"query"`
}

type QueryFilter struct {
	Field  *string `json:"field" form:"field"`
	Value  *string `json:"value" form:"value"`
	Option *string `json:"option" form:"option"`
}

func (query ListQuery) ToContext() context.Context {
	ctx := context.Background()

	ctx = context.WithValue(ctx, "offset", query.Offset)
	ctx = context.WithValue(ctx, "limit", query.Limit)
	ctx = context.WithValue(ctx, "sort_by", query.SortBy)
	ctx = context.WithValue(ctx, "query", query.Query)

	ctx = context.WithValue(ctx, "filter_field", query.Filter.Field)
	ctx = context.WithValue(ctx, "filter_value", query.Filter.Value)
	ctx = context.WithValue(ctx, "filter_option", query.Filter.Option)

	return ctx
}
