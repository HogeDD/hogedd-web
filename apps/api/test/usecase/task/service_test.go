package task_test

import (
	"context"
	"testing"
	"time"

	domaintask "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/domain/task"
	taskusecase "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/usecase/task"
)

func TestServiceCreateTask(t *testing.T) {
	now := time.Date(2026, 5, 28, 12, 0, 0, 0, time.UTC)
	repository := newFakeRepository()
	service := taskusecase.NewService(repository, fixedIDGenerator{id: "task-1"}, fixedClock{now: now})

	output, err := service.CreateTask(
		context.Background(),
		taskusecase.CreateTaskInput{Title: "  Write tests  "},
	)
	if err != nil {
		t.Fatalf("CreateTask returned error: %v", err)
	}

	if output.ID != "task-1" {
		t.Fatalf("ID = %q, want %q", output.ID, "task-1")
	}
	if output.Title != "Write tests" {
		t.Fatalf("Title = %q, want %q", output.Title, "Write tests")
	}
	if output.Completed {
		t.Fatal("Completed = true, want false")
	}
	if !output.CreatedAt.Equal(now) {
		t.Fatalf("CreatedAt = %s, want %s", output.CreatedAt, now)
	}
	if len(repository.saved) != 1 {
		t.Fatalf("saved tasks = %d, want 1", len(repository.saved))
	}
}

func TestServiceCreateTaskRejectsEmptyTitle(t *testing.T) {
	service := taskusecase.NewService(
		newFakeRepository(),
		fixedIDGenerator{id: "task-1"},
		fixedClock{now: time.Now()},
	)

	_, err := service.CreateTask(context.Background(), taskusecase.CreateTaskInput{Title: "   "})
	if err != domaintask.ErrEmptyTitle {
		t.Fatalf("error = %v, want %v", err, domaintask.ErrEmptyTitle)
	}
}

func TestServiceListTasks(t *testing.T) {
	now := time.Date(2026, 5, 28, 12, 0, 0, 0, time.UTC)
	repository := newFakeRepository()
	repository.saved = []domaintask.Task{
		{ID: "task-1", Title: "First", CreatedAt: now},
		{ID: "task-2", Title: "Second", CreatedAt: now.Add(time.Minute)},
	}
	service := taskusecase.NewService(repository, fixedIDGenerator{id: "unused"}, fixedClock{now: now})

	outputs, err := service.ListTasks(context.Background())
	if err != nil {
		t.Fatalf("ListTasks returned error: %v", err)
	}

	if len(outputs) != 2 {
		t.Fatalf("outputs = %d, want 2", len(outputs))
	}
	if outputs[0].ID != "task-1" || outputs[1].ID != "task-2" {
		t.Fatalf("outputs = %#v, want ordered task IDs", outputs)
	}
}

type fakeRepository struct {
	saved []domaintask.Task
}

func newFakeRepository() *fakeRepository {
	return &fakeRepository{saved: []domaintask.Task{}}
}

func (r *fakeRepository) Save(_ context.Context, task domaintask.Task) error {
	r.saved = append(r.saved, task)
	return nil
}

func (r *fakeRepository) List(_ context.Context) ([]domaintask.Task, error) {
	tasks := make([]domaintask.Task, len(r.saved))
	copy(tasks, r.saved)
	return tasks, nil
}

type fixedIDGenerator struct {
	id domaintask.ID
}

func (g fixedIDGenerator) NewID(context.Context) (domaintask.ID, error) {
	return g.id, nil
}

type fixedClock struct {
	now time.Time
}

func (c fixedClock) Now() time.Time {
	return c.now
}
