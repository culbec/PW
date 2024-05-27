package persons

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
)

const FILE_PATH string = "./data/persons.csv"

type Person struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
}

const PAGE_SIZE int = 3

var PAGE_NUMBER int = 0

var persons []Person = nil
var length int = 0

func getPersons(fileName string) ([]Person, int) {
	persons, length := []Person{}, 0

	if len(fileName) == 0 {
		return persons, length
	}

	fd, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
		return persons, length
	}

	csvReader := csv.NewReader(fd)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
		return persons, length
	}

	length = len(records) - 1
	persons = make([]Person, length)

	for i := 1; i < len(records); i++ {
		person := Person{
			FirstName: records[i][0],
			LastName:  records[i][1],
			Phone:     records[i][2],
			Email:     records[i][3],
		}
		persons[i-1] = person
	}

	return persons, length
}

func getNextPage(persons []Person, length, pageIndex int) []Person {
	start := pageIndex * PAGE_SIZE
	end := start + PAGE_SIZE

	if end > length {
		end = length
	}

	if start >= end {
		return []Person{}
	}

	return persons[start:end]
}

func getPreviousPage(persons []Person, length, pageIndex int) []Person {
	start := (pageIndex - 1) * PAGE_SIZE
	end := start + PAGE_SIZE

	if start < 0 {
		return []Person{}
	}

	if end > length {
		end = length
	}

	return persons[start:end]
}

func GetPageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		if persons == nil {
			persons, length = getPersons(FILE_PATH)
		}

		// Setting the returned content type.
		w.Header().Set("Content-Type", "application/json")

		pageIndexStr := path.Base(r.URL.Path)

		pageIndex, err := strconv.Atoi(pageIndexStr)
		if err != nil || pageIndex < 1 {
			pageIndex = 1
		}

		var page []Person = nil
		if pageIndex*PAGE_SIZE >= length {
			page = []Person{}
		} else if pageIndex <= PAGE_NUMBER || PAGE_NUMBER == 0 {
			page = getPreviousPage(persons, length, pageIndex)
			PAGE_NUMBER = pageIndex
		} else {
			page = getNextPage(persons, length, pageIndex)
			PAGE_NUMBER = pageIndex
		}

		// Sending the page to the user

		if err := json.NewEncoder(w).Encode(page); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	} else {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}
