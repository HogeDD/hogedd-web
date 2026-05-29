package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	domaintask "github.com/iwasawarenji954/hogedd-clean/backend/apps/clean-tasks/internal/domain/task"
	taskusecase "github.com/iwasawarenji954/hogedd-clean/backend/apps/clean-tasks/internal/usecase/task"
)

type TaskService interface {
	CreateTask(ctx context.Context, input taskusecase.CreateTaskInput) (taskusecase.TaskOutput, error)
	ListTasks(ctx context.Context) ([]taskusecase.TaskOutput, error)
	CompleteTask(ctx context.Context, id string) (taskusecase.TaskOutput, error)
}

func NewRouter(service taskusecase.Service) http.Handler {
	mux := http.NewServeMux()
	handler := taskHandler{service: service}

	mux.HandleFunc("GET /healthz", handleHealthz)
	mux.HandleFunc("/tasks", handler.handleTasks)
	mux.HandleFunc("PATCH /tasks/{taskID}/complete", handler.completeTask)

	return mux
}

type taskHandler struct {
	service TaskService
}

type createTaskRequest struct {
	Title string `json:"title"`
}

type taskResponse struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
	CreatedAt string `json:"createdAt"`
}

type listTasksResponse struct {
	Tasks []taskResponse `json:"tasks"`
}

func handleHealthz(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h taskHandler) handleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.listTasks(w, r)
	case http.MethodPost:
		h.createTask(w, r)
	default:
		w.Header().Set("Allow", "GET, POST")
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}

func (h taskHandler) completeTask(w http.ResponseWriter, r *http.Request) {
	output, err := h.service.CompleteTask(r.Context(), r.PathValue("taskID"))
	if err != nil {
		if errors.Is(err, taskusecase.ErrTaskNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "task not found"})
			return
		}

		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}

	writeJSON(w, http.StatusOK, toTaskResponse(output))
}

func (h taskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	var request createTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json body"})
		return
	}

	output, err := h.service.CreateTask(r.Context(), taskusecase.CreateTaskInput{Title: request.Title})
	if err != nil {
		if errors.Is(err, domaintask.ErrEmptyTitle) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "title must not be empty"})
			return
		}

		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}

	writeJSON(w, http.StatusCreated, toTaskResponse(output))
}

func (h taskHandler) listTasks(w http.ResponseWriter, r *http.Request) {
	outputs, err := h.service.ListTasks(r.Context())
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}

	response := listTasksResponse{Tasks: make([]taskResponse, 0, len(outputs))}
	for _, output := range outputs {
		response.Tasks = append(response.Tasks, toTaskResponse(output))
	}

	writeJSON(w, http.StatusOK, response)
}

func toTaskResponse(output taskusecase.TaskOutput) taskResponse {
	return taskResponse{
		ID:        output.ID,
		Title:     output.Title,
		Completed: output.Completed,
		CreatedAt: output.CreatedAt.Format(time.RFC3339Nano),
	}
}

func writeJSON(w http.ResponseWriter, statusCode int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(body)
}
