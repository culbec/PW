package treeview

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type DirEntry struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDir"`
}

// Loads the content from a given directory path.
func loadDirectory(path string) (interface{}, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return nil, err
	}

	if fileInfo.IsDir() {
		entries, err := os.ReadDir(path)
		if err != nil {
			return nil, err
		}

		dirEntries := make([]DirEntry, len(entries))
		for i, entry := range entries {
			dirEntries[i] = DirEntry{
				Name:  entry.Name(),
				IsDir: entry.IsDir(),
			}
		}
		return dirEntries, nil
	} else {
		fileContent, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}
		return string(fileContent), nil
	}
}

func LoadPathHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	path := r.URL.Query().Get("path")
	basePath := "."
	currentPath := path

	if !strings.HasPrefix(path, basePath) {
		currentPath = filepath.Clean(filepath.Join(basePath, path))
	} else {
		currentPath = path
	}

	// Check if the current path is inside the base path
	relPath, err := filepath.Rel(basePath, currentPath)
	if err != nil || strings.HasPrefix(relPath, "..") {
		fmt.Printf("Error: %v, basePath: %v, currentPath: %v", err, basePath, currentPath)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	// If the path is equal to the base path, load the directory
	if path == "" {
		content, err := loadDirectory(basePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if entries, ok := content.([]DirEntry); ok {
			if err := json.NewEncoder(w).Encode(entries); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		return
	}

	content, err := loadDirectory(currentPath)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if entries, ok := content.([]DirEntry); ok {
		if err := json.NewEncoder(w).Encode(entries); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else if fileContent, ok := content.(string); ok {
		w.Write([]byte(fileContent))
	}
}
