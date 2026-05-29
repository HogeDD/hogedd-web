package task

import (
	"context"
	"errors"
	"time"

	domaintask "github.com/iwasawarenji954/hogedd-clean/backend/apps/clean-tasks/internal/domain/task"
)

type Repository interface {
	Save(ctx context.Context, task domaintask.Task) error
	List(ctx context.Context) ([]domaintask.Task, error)
	Complete(ctx context.Context, id domaintask.ID) (domaintask.Task, error)
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

var ErrTaskNotFound = errors.New("task not found")

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

func (s Service) CompleteTask(ctx context.Context, id string) (TaskOutput, error) {
	task, err := s.repository.Complete(ctx, domaintask.ID(id))
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			return TaskOutput{}, ErrTaskNotFound
		}

		return TaskOutput{}, err
	}

	return toOutput(task), nil
}

func toOutput(task domaintask.Task) TaskOutput {
	return TaskOutput{
		ID:        string(task.ID),
		Title:     task.Title,
		Completed: task.Completed,
		CreatedAt: task.CreatedAt,
	}
}
