const DATA_ENV = {};

DATA_ENV.appUrl = 'http://localhost/trackerbackend/index.php/api'
DATA_ENV.exportDuration = 10    // Export csv file less than X days ago. If we set it 0 or unset, it export whole history to CSV.