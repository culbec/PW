package shop

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

const FILE_PATH string = "./data/shop.csv"
const PAGE_SIZE int = 10

type Product struct {
	Type     string  `json:"type"`
	Producer string  `json:"producer"`
	Color    string  `json:"color"`
	Season   string  `json:"seasons"`
	Price    float32 `json:"price"`
}

func getUniqueValues(attributeIndex int) ([]string, error) {
	file, err := os.Open(FILE_PATH)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)

	// Skip the header
	_, _ = reader.Read()

	uniqueValues := make(map[string]bool)

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		// Check if the attribute index is valid
		if attributeIndex < 0 || attributeIndex >= len(record) {
			return nil, fmt.Errorf("invalid attribute index")
		}

		uniqueValues[record[attributeIndex]] = true
	}

	// Convert the map keys to a slice
	result := make([]string, 0, len(uniqueValues))
	for value := range uniqueValues {
		result = append(result, value)
	}

	return result, nil
}

func GetUniqueValuesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	attributeIndexStr := r.URL.Query().Get("attribute-index")
	attributeIndex, err := strconv.Atoi(attributeIndexStr)
	if err != nil {
		http.Error(w, "Invalid attribute index", http.StatusBadRequest)
		return
	}

	uniqueValues, err := getUniqueValues(attributeIndex)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(uniqueValues); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func loadProducts(filterCriteria string, filterValue string) []Product {
	fd, err := os.Open(FILE_PATH)

	if err != nil {
		return []Product{}
	}

	defer fd.Close()

	reader := csv.NewReader(fd)
	_, _ = reader.Read()

	var products []Product = make([]Product, 0)
	for {
		record, err := reader.Read()

		if err == io.EOF {
			break
		}

		if err != nil {
			return products
		}

		productPrice, err := strconv.ParseFloat(record[4], 32)

		if err != nil {
			productPrice = 0.0
		}

		productType, productProducer, productColor, productSeason := record[0], record[1], record[2], record[3]

		product := Product{
			Type:     productType,
			Producer: productProducer,
			Color:    productColor,
			Season:   productSeason,
			Price:    float32(productPrice),
		}

		if filterCriteria == "" {
			products = append(products, product)
		} else {
			var ok bool = true

			switch filterCriteria {
			case "Type":
				ok = productType == filterValue
			case "Producer":
				ok = productProducer == filterValue
			case "Color":
				ok = productColor == filterValue
			case "Season":
				ok = productSeason == filterValue
			}

			if ok {
				products = append(products, product)
			}
		}
	}

	return products
}

func LoadProductsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	filterCriteria, filterValue := r.URL.Query().Get("filter-criteria"), r.URL.Query().Get("filter-value")

	products := loadProducts(filterCriteria, filterValue)

	if err := json.NewEncoder(w).Encode(products); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
