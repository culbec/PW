package main

import (
	"ajax-go/src/books"
	"ajax-go/src/cities"
	"ajax-go/src/persons"
	"ajax-go/src/shop"
	"ajax-go/src/treeview"
	"ajax-go/src/xo"
	"fmt"
	"net/http"
)

func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Credentials", "true")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

		if r.Method == "OPTIONS" {
			http.Error(w, "No Content", http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func staticWebFiles() {
	fs := http.FileServer(http.Dir("./html"))
	http.Handle("/", fs)
}

func createHandlers() {
	http.HandleFunc("/lab6_1/departure-cities", CORS(cities.GetDepartureCitiesHandler))
	http.HandleFunc("/lab6_1/arrival-cities", CORS(cities.GetArrivalCitiesHandler))

	http.HandleFunc("/lab6_2/persons/", CORS(persons.GetPageHandler))

	http.HandleFunc("/lab6_3/books/id", CORS(books.GetIdsHandler))
	http.HandleFunc("/lab6_3/books/id/", CORS(books.GetBookByIdHandler))
	http.HandleFunc("/lab6_3/books", CORS(books.SaveBookHandler))

	http.HandleFunc("/lab6_4/xo/player", CORS(xo.PlayerMoveHandler))
	http.HandleFunc("/lab6_4/xo/computer", CORS(xo.OpponentMoveHandler))
	http.HandleFunc("/lab6_4/xo/reset", CORS(xo.ResetGameHandler))
	http.HandleFunc("/lab6_4/xo/check-status", CORS(xo.CheckStatusHandler))

	http.HandleFunc("/lab6_5/tree-view", CORS(treeview.LoadPathHandler))

	http.HandleFunc("/lab6_6/shop", CORS(shop.LoadProductsHandler))
	http.HandleFunc("/lab6_6/shop/initial-load", CORS(shop.LoadProductsHandler))
	http.HandleFunc("/lab6_6/shop/unique-values", CORS(shop.GetUniqueValuesHandler))
}

func main() {
	staticWebFiles()
	createHandlers()

	fmt.Println("Listening on port :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
