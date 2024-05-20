package cities

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"
)

var routes map[string][]string = nil

func getRoutes(fileName string) map[string][]string {
	routes := map[string][]string{}

	if len(fileName) == 0 {
		return routes
	}

	// Opening the file with the given filename if it exists.
	fd, err := os.Open(fileName)

	if err != nil {
		log.Fatal(err)
		return routes
	}

	// Defering file closure for when the function ends.
	defer fd.Close()

	// Reading the paths from a .csv file.
	fileReader := csv.NewReader(fd)
	records, err := fileReader.ReadAll()

	if err != nil {
		log.Fatal(err)
		return routes
	}

	// Reading the records one by one and saving the relevant data.
	recordsLen := len(records)
	for i := 1; i < recordsLen; i++ {
		depCity, arrCity := records[i][0], records[i][1]

		if routes[depCity] == nil {
			routes[depCity] = make([]string, 0)
		}
		routes[depCity] = append(routes[depCity], arrCity)
	}

	return routes
}

func getDepartues(routes map[string][]string) []string {
	if routes == nil {
		return []string{}
	}

	departureCities := make([]string, len(routes))

	i := 0
	for city := range routes {
		departureCities[i] = city
		i++
	}

	sort.Strings(departureCities)
	return departureCities
}

func getArrivals(departureCity string, routes map[string][]string) []string {
	if routes == nil || routes[departureCity] == nil {
		return []string{}
	}

	return routes[departureCity]
}

func GetDepartureCitiesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		if routes == nil {
			routes = getRoutes("../data/cities.csv")
		}

		departureCities := getDepartues(routes)

		// Setting the returned content type.
		w.Header().Set("Content-Type", "application/json")

		// Encoding the departure cities as JSON and sending them towards the client.
		if err := json.NewEncoder(w).Encode(departureCities); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func GetArrivalCitiesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		departureCity := r.URL.Query().Get("departure-city")
		if departureCity == "" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		// Setting the returned content type.
		w.Header().Set("Content-Type", "application/json")

		arrivalCities := getArrivals(departureCity, routes)
		if arrivalCities == nil {
			http.NotFound(w, r)
			return
		}

		if err := json.NewEncoder(w).Encode(arrivalCities); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}
