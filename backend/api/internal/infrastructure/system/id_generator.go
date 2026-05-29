package system

import (
	"context"
	"fmt"
	"sync/atomic"

	domaintask "github.com/iwasawarenji954/hogedd-clean/backend/api/internal/domain/task"
)

type SequentialIDGenerator struct {
	prefix  string
	counter atomic.Uint64
}

func NewSequentialIDGenerator(prefix string) *SequentialIDGenerator {
	return &SequentialIDGenerator{prefix: prefix}
}

func (g *SequentialIDGenerator) NewID(context.Context) (domaintask.ID, error) {
	next := g.counter.Add(1)
	return domaintask.ID(fmt.Sprintf("%s-%d", g.prefix, next)), nil
}
