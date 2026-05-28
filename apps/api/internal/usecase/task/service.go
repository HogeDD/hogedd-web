package task

import (
	"context"
	"time"

	domaintask "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/domain/task"
)

type Repository interface {
	Save(ctx context.Context, task domaintask.Task) error
	List(ctx context.Context) ([]domaintask.Task, error)
}

type IDGenerator interface {
	NewID(ctx context.Context) (domaintask.ID, error)
}

type Clock interface {
	Now() time.Time
}

type Service struct {
	repository  Repository
	idGenerator IDGenerator
	clock       Clock
}

func NewService(repository Repository, idGenerator IDGenerator, clock Clock) Service {
	return Service{
		repository:  repository,
		idGenerator: idGenerator,
		clock:       clock,
	}
}

type CreateTaskInput struct {
	Title string
}

type TaskOutput struct {
	ID        string
	Title     string
	Completed bool
	CreatedAt time.Time
}

func (s Service) CreateTask(ctx context.Context, input CreateTaskInput) (TaskOutput, error) {
	id, err := s.idGenerator.NewID(ctx)
	if err != nil {
		return TaskOutput{}, err
	}

	task, err := domaintask.New(id, input.Title, s.clock.Now())
	if err != nil {
		return TaskOutput{}, err
	}

	if err := s.repository.Save(ctx, task); err != nil {
		return TaskOutput{}, err
	}

	return toOutput(task), nil
}

func (s Service) ListTasks(ctx context.Context) ([]TaskOutput, error) {
	tasks, err := s.repository.List(ctx)
	if err != nil {
		return nil, err
	}

	outputs := make([]TaskOutput, 0, len(tasks))
	for _, task := range tasks {
		outputs = append(outputs, toOutput(task))
	}

	return outputs, nil
}

func toOutput(task domaintask.Task) TaskOutput {
	return TaskOutput{
		ID:        string(task.ID),
		Title:     task.Title,
		Completed: task.Completed,
		CreatedAt: task.CreatedAt,
	}
}
