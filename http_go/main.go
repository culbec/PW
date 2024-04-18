package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		f, err := os.ReadFile("../lab1/html4/index.html")

		if err != nil {
			panic(err)
		}

		fmt.Fprint(w, string(f))
	})

	http.HandleFunc("/posttest", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			fmt.Fprint(w, "POST REQUEST!")
		} else {
			fmt.Fprint(w, "NO POST!")
		}
	})

	http.ListenAndServe(":8080", nil)
}
