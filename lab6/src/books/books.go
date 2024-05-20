package books

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
)

type Book struct {
	Id        int    `json:"id"`
	Title     string `json:"title"`
	Author    string `json:"author"`
	Editorial string `json:"editorial"`
}

var books map[int]*Book = nil

func readBooks(fileName string) map[int]*Book {
	var result map[int]*Book = map[int]*Book{}

	if len(fileName) == 0 {
		return result
	}

	fd, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
		return result
	}

	csvReader := csv.NewReader(fd)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
		return result
	}

	for i := 1; i < len(records); i++ {
		id, err := strconv.Atoi(records[i][0])
		if err != nil {
			log.Println("Id at ", i, " not an int.")
			continue
		}

		book := Book{
			Id:        id,
			Title:     records[i][1],
			Author:    records[i][2],
			Editorial: records[i][3],
		}

		result[book.Id] = &book

	}

	return result
}

func retrieveIds(books map[int]*Book) []int {
	ids := make([]int, 0)

	for key := range books {
		ids = append(ids, key)
	}

	return ids
}

func getBookById(books map[int]*Book, id int) *Book {
	var book *Book = books[id]

	if book == nil {
		return nil
	}

	return book
}

func saveBook(books map[int]*Book, book *Book) bool {
	if books[book.Id] == nil {
		return false
	}

	books[book.Id] = book
	return true
}

func GetIdsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	if books == nil {
		books = readBooks("../data/books.csv")
	}

	ids := retrieveIds(books)

	// Setting the returned content type.
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(ids); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func GetBookByIdHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	if books == nil {
		books = readBooks("../data/books.csv")
	}

	idStr := path.Base(r.URL.Path)
	id, err := strconv.Atoi(idStr)

	if err != nil {
		http.Error(w, "Bad ID provided.", http.StatusBadRequest)
		return
	}

	book := getBookById(books, id)

	// Setting the returned content type.
	w.Header().Set("Content-Type", "application/json")

	if book == nil {
		if err := json.NewEncoder(w).Encode("{}"); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if err := json.NewEncoder(w).Encode(*book); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func SaveBookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	var book Book

	err := json.NewDecoder(r.Body).Decode(&book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	saved := saveBook(books, &book)

	// Setting the returned content type.
	w.Header().Set("Content-Type", "text/plain")

	if saved {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "The provided book doesn't exist!", http.StatusBadRequest)
	}

}
