<?php
// Matrix Tetris - Highscore Server Script
// Save highscores to JSON file

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (isset($data['highscores']) && is_array($data['highscores'])) {
        $highscores = $data['highscores'];
        
        // Validate and sanitize
        $highscores = array_slice($highscores, 0, 10);
        
        foreach ($highscores as &$entry) {
            $entry['name'] = htmlspecialchars($entry['name'], ENT_QUOTES, 'UTF-8');
            $entry['score'] = (int)$entry['score'];
            $entry['level'] = (int)$entry['level'];
            $entry['lines'] = (int)$entry['lines'];
        }
        
        // Save to JSON file
        $json = json_encode($highscores, JSON_PRETTY_PRINT);
        file_put_contents('highscores.json', $json);
        
        echo json_encode(['success' => true, 'message' => 'Highscores saved']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
