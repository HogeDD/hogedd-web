package memory

import (
	"context"
	"sync"

	domaintask "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/domain/task"
)

type TaskRepository struct {
	mu    sync.RWMutex
	tasks []domaintask.Task
}

func NewTaskRepository() *TaskRepository {
	return &TaskRepository{tasks: []domaintask.Task{}}
}

func (r *TaskRepository) Save(_ context.Context, task domaintask.Task) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.tasks = append(r.tasks, task)
	return nil
}

func (r *TaskRepository) List(context.Context) ([]domaintask.Task, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	tasks := make([]domaintask.Task, len(r.tasks))
	copy(tasks, r.tasks)
	return tasks, nil
}
