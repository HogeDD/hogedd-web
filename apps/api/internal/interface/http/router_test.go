package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/iwasawarenji954/hogedd-clean/apps/api/internal/infrastructure/memory"
	"github.com/iwasawarenji954/hogedd-clean/apps/api/internal/infrastructure/system"
	taskusecase "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/usecase/task"
)

func TestHealthz(t *testing.T) {
	router := newTestRouter()
	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)

	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
	assertJSONField(t, response.Body.Bytes(), "status", "ok")
}

func TestCreateAndListTasks(t *testing.T) {
	router := newTestRouter()

	createResponse := httptest.NewRecorder()
	createRequest := httptest.NewRequest(
		http.MethodPost,
		"/tasks",
		bytes.NewBufferString(`{"title":" Learn clean architecture "}`),
	)
	router.ServeHTTP(createResponse, createRequest)

	if createResponse.Code != http.StatusCreated {
		t.Fatalf("create status = %d, want %d; body = %s", createResponse.Code, http.StatusCreated, createResponse.Body.String())
	}
	assertJSONField(t, createResponse.Body.Bytes(), "id", "task-1")
	assertJSONField(t, createResponse.Body.Bytes(), "title", "Learn clean architecture")

	listResponse := httptest.NewRecorder()
	listRequest := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	router.ServeHTTP(listResponse, listRequest)

	if listResponse.Code != http.StatusOK {
		t.Fatalf("list status = %d, want %d", listResponse.Code, http.StatusOK)
	}

	var body struct {
		Tasks []struct {
			ID    string `json:"id"`
			Title string `json:"title"`
		} `json:"tasks"`
	}
	if err := json.Unmarshal(listResponse.Body.Bytes(), &body); err != nil {
		t.Fatalf("failed to decode list response: %v", err)
	}
	if len(body.Tasks) != 1 {
		t.Fatalf("tasks = %d, want 1", len(body.Tasks))
	}
	if body.Tasks[0].ID != "task-1" || body.Tasks[0].Title != "Learn clean architecture" {
		t.Fatalf("task = %#v, want created task", body.Tasks[0])
	}
}

func TestCreateTaskRejectsEmptyTitle(t *testing.T) {
	router := newTestRouter()
	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/tasks", bytes.NewBufferString(`{"title":" "}`))

	router.ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	assertJSONField(t, response.Body.Bytes(), "error", "title must not be empty")
}

func newTestRouter() http.Handler {
	service := taskusecase.NewService(
		memory.NewTaskRepository(),
		system.NewSequentialIDGenerator("task"),
		fixedClock{now: time.Date(2026, 5, 28, 12, 0, 0, 0, time.UTC)},
	)
	return NewRouter(service)
}

func assertJSONField(t *testing.T, body []byte, field string, want string) {
	t.Helper()

	var decoded map[string]any
	if err := json.Unmarshal(body, &decoded); err != nil {
		t.Fatalf("failed to decode json body: %v", err)
	}
	if got, ok := decoded[field].(string); !ok || got != want {
		t.Fatalf("%s = %#v, want %q", field, decoded[field], want)
	}
}

type fixedClock struct {
	now time.Time
}

func (c fixedClock) Now() time.Time {
	return c.now
}
