package main

import (
	"log"
	"net/http"
	"os"

	"github.com/iwasawarenji954/hogedd-clean/apps/api/internal/infrastructure/memory"
	"github.com/iwasawarenji954/hogedd-clean/apps/api/internal/infrastructure/system"
	httpapi "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/interface/http"
	taskusecase "github.com/iwasawarenji954/hogedd-clean/apps/api/internal/usecase/task"
)

func main() {
	repository := memory.NewTaskRepository()
	service := taskusecase.NewService(
		repository,
		system.NewSequentialIDGenerator("task"),
		system.Clock{},
	)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("api server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, httpapi.NewRouter(service)); err != nil {
		log.Fatal(err)
	}
}
