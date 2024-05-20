package xo

import (
	"encoding/json"
	"math"
	"net/http"
)

var table [][]byte = [][]byte{
	{'-', '-', '-'},
	{'-', '-', '-'},
	{'-', '-', '-'},
}

var player byte = 'x'
var opponent byte = 'o'

type Move struct {
	Row int `json:"row"`
	Col int `json:"col"`
}

func areMovesLeft(table [][]byte) bool {
	for _, row := range table {
		for _, col := range row {
			if col == '-' {
				return true
			}
		}
	}

	return false
}

func evaluate(table [][]byte) int {
	// Row winner?
	for _, row := range table {
		if row[0] == row[1] && row[1] == row[2] {
			if row[0] == player {
				return +10
			} else if row[0] == opponent {
				return -10
			}
		}
	}

	// Column winner?
	for col := range table {
		if table[0][col] == table[1][col] && table[1][col] == table[2][col] {
			if table[0][col] == player {
				return +10
			} else if table[0][col] == opponent {
				return -10
			}
		}
	}

	// Diagonal winner?
	if table[0][0] == table[1][1] && table[1][1] == table[2][2] {
		if table[0][0] == player {
			return +10
		} else if table[0][0] == opponent {
			return -10
		}
	}
	if table[0][2] == table[1][1] && table[1][1] == table[2][0] {
		if table[0][2] == player {
			return +10
		} else if table[0][2] == opponent {
			return -10
		}
	}

	return 0
}

func minimax(table [][]byte, depth int, isMax bool) int {
	score := evaluate(table)

	if score == 10 || score == -10 {
		return score
	}

	if !areMovesLeft(table) {
		return 0
	}

	if isMax {
		best := -9999

		for row := range table {
			for col := range table[row] {
				if table[row][col] == '-' {
					table[row][col] = player
					best = int(math.Max(float64(best), float64(minimax(table, depth+1, !isMax))))
					table[row][col] = '-'
				}
			}
		}

		return best
	} else {
		best := 9999

		for row := range table {
			for col := range table[row] {
				if table[row][col] == '-' {
					table[row][col] = opponent
					best = int(math.Max(float64(best), float64(minimax(table, depth+1, !isMax))))
					table[row][col] = '-'
				}
			}
		}

		return best
	}

}

func findBestMove(table [][]byte) Move {
	var best int = -9999
	var bestMove Move = Move{
		Row: -1,
		Col: -1,
	}

	for row := range table {
		for col := range table[row] {
			if table[row][col] == '-' {
				table[row][col] = opponent
				move := minimax(table, 0, true)
				table[row][col] = '-'

				if move > best {
					best = move
					bestMove.Row = row
					bestMove.Col = col
				}
			}
		}
	}

	return bestMove
}

func playOpponent(table [][]byte) Move {
	if !areMovesLeft(table) {
		return Move{}
	}

	bestMove := findBestMove(table)
	table[bestMove.Row][bestMove.Col] = opponent
	return bestMove
}

func ResetGameHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}

	table = [][]byte{
		{'-', '-', '-'},
		{'-', '-', '-'},
		{'-', '-', '-'},
	}

	w.Header().Add("Content-type", "text/plain")
}

func CheckStatusHandler(w http.ResponseWriter, r *http.Request) {
	// Check the score and status of the game.
	score := evaluate(table)

	// Check if there are any moves left.
	movesLeft := areMovesLeft(table)

	// If the score is 0 and there are no moves left, set the score to -1.
	if score == 0 && !movesLeft {
		score = -1
	}

	// Prepare the response.
	response := struct {
		Score    int  `json:"score"`
		GameOver bool `json:"game_over"`
	}{
		Score:    score,
		GameOver: score != 0 || !movesLeft,
	}

	// Send the response.
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func PlayerMoveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}

	// Game still going - player move.
	var move Move

	if err := json.NewDecoder(r.Body).Decode(&move); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if table[move.Row][move.Col] != '-' {
		http.Error(w, "Move not allowed: cell is occupied!", http.StatusBadRequest)
		return
	}

	table[move.Row][move.Col] = player
}

func OpponentMoveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}

	// Game is still going - opponent move.
	move := playOpponent(table)

	w.Header().Add("Content-type", "application/json")

	if err := json.NewEncoder(w).Encode(&move); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	table[move.Row][move.Col] = opponent
}
