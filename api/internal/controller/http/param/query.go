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
}

func (query ListQuery) ToContext() context.Context {
	ctx := context.Background()

	ctx = context.WithValue(ctx, "offset", query.Offset)
	ctx = context.WithValue(ctx, "limit", query.Limit)
	ctx = context.WithValue(ctx, "sort_by", query.SortBy)

	return ctx
}

// ListQueryWithSearch parameters values with search query
//
//	@Description	Query parameters for getting entities
type ListQueryWithSearch struct {
	ListQuery

	// Search query
	Query *string `json:"query" form:"query"`
}

func (query ListQueryWithSearch) ToContext() context.Context {
	ctx := context.Background()

	ctx = query.ListQuery.ToContext()
	ctx = context.WithValue(ctx, "query", query.Query)

	return ctx
}
