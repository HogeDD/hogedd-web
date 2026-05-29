package task

import (
	"errors"
	"strings"
	"time"
)

var ErrEmptyTitle = errors.New("task title must not be empty")

type ID string

type Task struct {
	ID        ID
	Title     string
	Completed bool
	CreatedAt time.Time
}

func New(id ID, title string, createdAt time.Time) (Task, error) {
	normalizedTitle := strings.TrimSpace(title)
	if normalizedTitle == "" {
		return Task{}, ErrEmptyTitle
	}

	return Task{
		ID:        id,
		Title:     normalizedTitle,
		Completed: false,
		CreatedAt: createdAt,
	}, nil
}
